from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from app.db.session import get_db
from app.models.finance import (
    Transaction, TransactionCreate, StagedTransaction, 
    Category, CategoryCreate, Account, AccountCreate,
    CreditCard, CreditCardCreate
)
from app.services.finance_service import FinanceService

router = APIRouter(prefix="/api/finance", tags=["finance"])

@router.get("/transactions", response_model=List[Transaction])
def list_transactions(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    category_id: Optional[int] = None,
    account_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    service = FinanceService(db)
    return service.get_transactions(start_date, end_date, category_id, account_id)

@router.post("/transactions", response_model=Transaction)
async def create_transaction(transaction: TransactionCreate, db: Session = Depends(get_db)):
    service = FinanceService(db)
    return await service.create_transaction(transaction)

@router.get("/staged", response_model=List[StagedTransaction])
def list_staged(db: Session = Depends(get_db)):
    service = FinanceService(db)
    return service.get_staged_transactions()

@router.post("/staged/{staged_id}/approve", response_model=Transaction)
async def approve_staged(staged_id: int, account_id: int, db: Session = Depends(get_db)):
    service = FinanceService(db)
    try:
        return await service.approve_staged_transaction(staged_id, account_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...), 
    db: Session = Depends(get_db)
):
    service = FinanceService(db)
    content = await file.read()
    filename = file.filename
    
    if filename.endswith(".csv"):
        items = service.parse_csv(content.decode("utf-8"), filename)
        return {"status": "success", "count": len(items), "staged": items}
    elif filename.endswith((".pdf", ".png", ".jpg", ".jpeg")):
        # For PDF/Images, we'd normally use OCR or a vision model.
        # For now, we simulate by sending the direct text if it's a PDF 
        # or we just hint that LLM processing is needed.
        # In a real scenario, we'd extract text from PDF first.
        items = await service.parse_with_llm(content.decode("utf-8", errors="ignore"), "file")
        return {"status": "success", "count": len(items), "staged": items}
    else:
        raise HTTPException(status_code=400, detail="Unsupported file format")

# --- Settings ---

@router.get("/categories", response_model=List[Category])
def get_categories(db: Session = Depends(get_db)):
    service = FinanceService(db)
    return service.get_categories()

@router.post("/categories", response_model=Category)
def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    service = FinanceService(db)
    return service.create_category(category)

@router.get("/accounts", response_model=List[Account])
def get_accounts(db: Session = Depends(get_db)):
    service = FinanceService(db)
    return service.get_accounts()

@router.post("/accounts", response_model=Account)
def create_account(account: AccountCreate, db: Session = Depends(get_db)):
    service = FinanceService(db)
    return service.create_account(account)

@router.get("/analysis")
async def get_analysis(db: Session = Depends(get_db)):
    service = FinanceService(db)
    return await service.get_analysis()

@router.post("/query")
async def semantic_search(query: str, db: Session = Depends(get_db)):
    service = FinanceService(db)
    return await service.semantic_search(query)
