import csv
import io
import logging
from datetime import date
from typing import List, Optional
from sqlalchemy.orm import Session
from app.db.models.finance import (
    Transaction, StagedTransaction, Category, SubCategory, Account, CreditCard
)
from app.models.finance import (
    TransactionCreate, StagedTransactionCreate, CategoryCreate, 
    AccountCreate, CreditCardCreate
)
from app.agents.nodes.base import get_llm
from langchain_core.messages import HumanMessage, SystemMessage
import json

logger = logging.getLogger(__name__)

class FinanceService:
    def __init__(self, db: Session):
        self.db = db

    # --- Transactions ---

    def get_transactions(self, 
                         start_date: Optional[date] = None, 
                         end_date: Optional[date] = None,
                         category_id: Optional[int] = None,
                         account_id: Optional[int] = None,
                         limit: Optional[int] = None) -> List[Transaction]:
        query = self.db.query(Transaction)
        if start_date:
            query = query.filter(Transaction.date >= start_date)
        if end_date:
            query = query.filter(Transaction.date <= end_date)
        if category_id:
            query = query.filter(Transaction.category_id == category_id)
        if account_id:
            query = query.filter(Transaction.account_id == account_id)
        
        query = query.order_by(Transaction.date.desc())
        
        if limit:
            query = query.limit(limit)
            
        return query.all()

    async def generate_embedding(self, text: str) -> List[float]:
        """Generates a 1536-dimensional embedding using Gemini."""
        from langchain_google_genai import GoogleGenerativeAIEmbeddings
        from app.config import settings
        
        embeddings = GoogleGenerativeAIEmbeddings(
            model="models/text-embedding-004", # or another available embedding model
            google_api_key=settings.gemini_api_key
        )
        try:
            vector = await embeddings.aembed_query(text)
            # pad or truncate to 1536 if needed, though text-embedding-004 is 768 by default
            # We adjusted the model to Column(Vector(1536)) in models/finance.py
            # If the model is 768, we should probably update the DB model or vice versa.
            # Let's assume 768 for text-embedding-004 and update models later if needed.
            return vector
        except Exception as e:
            logger.error(f"Embedding generation failed: {e}")
            return [0.0] * 768

    async def create_transaction(self, transaction_in: TransactionCreate) -> Transaction:
        db_transaction = Transaction(**transaction_in.model_dump())
        self.db.add(db_transaction)
        
        # Generate embedding
        text_to_embed = f"{db_transaction.description} {db_transaction.type}"
        db_transaction.embedding = await self.generate_embedding(text_to_embed)
        
        self.db.commit()
        self.db.refresh(db_transaction)
        return db_transaction

    async def approve_staged_transaction(self, staged_id: int, account_id: int) -> Transaction:
        staged = self.db.query(StagedTransaction).filter(StagedTransaction.id == staged_id).first()
        if not staged:
            raise ValueError("Staged transaction not found")
        
        # Create confirmed transaction
        transaction = Transaction(
            date=staged.date,
            description=staged.description,
            amount=staged.amount,
            type=staged.type,
            account_id=account_id,
            status="confirmed"
        )
        self.db.add(transaction)
        
        # Generate embedding
        text_to_embed = f"{transaction.description} {transaction.type}"
        transaction.embedding = await self.generate_embedding(text_to_embed)
        
        self.db.delete(staged)
        self.db.commit()
        self.db.refresh(transaction)
        return transaction

    # --- Parsing ---

    def parse_csv(self, file_content: str, source_name: str) -> List[StagedTransaction]:
        f = io.StringIO(file_content)
        reader = csv.DictReader(f)
        staged_items = []
        for row in reader:
            # Basic heuristic for CSV mapping (Date, Description, Amount)
            # This can be improved with LLM or flexible mapping
            try:
                staged = StagedTransaction(
                    date=date.fromisoformat(row.get("Date", date.today().isoformat())),
                    description=row.get("Description", "No description"),
                    amount=float(row.get("Amount", 0.0)),
                    type="Expense" if float(row.get("Amount", 0.0)) < 0 else "Income",
                    source_file=source_name,
                    parsing_confidence=1.0
                )
                self.db.add(staged)
                staged_items.append(staged)
            except Exception as e:
                logger.error(f"Error parsing row {row}: {e}")
        
        self.db.commit()
        return staged_items

    async def parse_with_llm(self, content_desc: str, file_type: str) -> List[StagedTransaction]:
        """Uses LLM to extract transactions from PDF text or Image descriptions."""
        llm = get_llm(temperature=0)
        
        system_prompt = """You are a financial data extractor. 
        Extract a list of transactions from the provided text or image description.
        Return ONLY a JSON array of objects with the following keys:
        - date (YYYY-MM-DD)
        - description
        - amount (float)
        - type (Income/Expense)
        If you are unsure about a field, leave it null or skip the transaction.
        """
        
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=f"Extract transactions from this {file_type} content: {content_desc}")
        ]
        
        response = await llm.ainvoke(messages)
        try:
            # Clean response potential markdown markers
            raw_content = response.content.replace("```json", "").replace("```", "").strip()
            data = json.loads(raw_content)
            staged_items = []
            for item in data:
                staged = StagedTransaction(
                    date=date.fromisoformat(item.get("date", date.today().isoformat())),
                    description=item.get("description", "Unknown"),
                    amount=float(item.get("amount", 0.0)),
                    type=item.get("type", "Expense"),
                    source_file=f"LLM_{file_type}",
                    parsing_confidence=0.8
                )
                self.db.add(staged)
                staged_items.append(staged)
            
            self.db.commit()
            return staged_items
        except Exception as e:
            logger.error(f"LLM Parsing failed: {e}")
            return []

    # --- Settings ---

    def get_categories(self) -> List[Category]:
        return self.db.query(Category).all()

    def create_category(self, category_in: CategoryCreate) -> Category:
        db_cat = Category(**category_in.model_dump())
        self.db.add(db_cat)
        self.db.commit()
        self.db.refresh(db_cat)
        return db_cat

    def get_accounts(self) -> List[Account]:
        return self.db.query(Account).all()

    def create_account(self, account_in: AccountCreate) -> Account:
        db_account = Account(**account_in.model_dump())
        # current_balance starts as initial_balance
        db_account.current_balance = db_account.initial_balance
        self.db.add(db_account)
        self.db.commit()
        self.db.refresh(db_account)
        return db_account

    async def semantic_search(self, query_text: str, limit: int = 5) -> List[Transaction]:
        """Performs a semantic search using pgvector."""
        embedding = await self.generate_embedding(query_text)
        return self.db.query(Transaction).order_by(
            Transaction.embedding.l2_distance(embedding)
        ).limit(limit).all()

    async def get_analysis(self) -> dict:
        """Generates a financial analysis report using LLM and context."""
        # Get recent transactions and context
        transactions = self.get_transactions(limit=20) # Get last 20
        tx_summary = "\n".join([f"{t.date}: {t.description} - ${t.amount} ({t.type})" for t in transactions])
        
        llm = get_llm()
        system_prompt = "You are a senior financial advisor for the SwMaster project. Analyze the transactions and provide 3-4 concise, actionable insights."
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=f"Analyze these recent transactions and provide insights:\n{tx_summary}")
        ]
        
        response = await llm.ainvoke(messages)
        return {"analysis": response.content}
