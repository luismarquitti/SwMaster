from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base
from pgvector.sqlalchemy import Vector

class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    type = Column(String)  # Income / Expense
    subcategories = relationship("SubCategory", back_populates="category")

class SubCategory(Base):
    __tablename__ = "subcategories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"))
    category = relationship("Category", back_populates="subcategories")

class Account(Base):
    __tablename__ = "accounts"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    institution = Column(String)
    type = Column(String)  # Checking / Savings / Cash
    initial_balance = Column(Float, default=0.0)
    current_balance = Column(Float, default=0.0)

class CreditCard(Base):
    __tablename__ = "credit_cards"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    institution = Column(String)
    limit = Column(Float)
    closing_day = Column(Integer)
    due_day = Column(Integer)

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, index=True)
    description = Column(String, index=True)
    amount = Column(Float)
    type = Column(String)  # Income / Expense
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    subcategory_id = Column(Integer, ForeignKey("subcategories.id"), nullable=True)
    account_id = Column(Integer, ForeignKey("accounts.id"), nullable=True)
    credit_card_id = Column(Integer, ForeignKey("credit_cards.id"), nullable=True)
    status = Column(String, default="confirmed")
    
    # Vector for semantic search (768 for models/text-embedding-004)
    embedding = Column(Vector(768)) 
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class StagedTransaction(Base):
    __tablename__ = "staged_transactions"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date)
    description = Column(String)
    amount = Column(Float)
    type = Column(String)
    category_suggestion = Column(String)
    account_suggestion = Column(String)
    source_file = Column(String)
    parsing_confidence = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
