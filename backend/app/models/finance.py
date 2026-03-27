from pydantic import BaseModel, Field, ConfigDict
from datetime import date, datetime
from typing import List, Optional

class CategoryBase(BaseModel):
    name: str
    type: str

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class SubCategoryBase(BaseModel):
    name: str
    category_id: int

class SubCategoryCreate(SubCategoryBase):
    pass

class SubCategory(SubCategoryBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class AccountBase(BaseModel):
    name: str
    institution: str
    type: str # Checking / Savings / Cash
    initial_balance: float = 0.0

class AccountCreate(AccountBase):
    pass

class Account(AccountBase):
    id: int
    current_balance: float
    model_config = ConfigDict(from_attributes=True)

class CreditCardBase(BaseModel):
    name: str
    institution: str
    limit: float
    closing_day: int
    due_day: int

class CreditCardCreate(CreditCardBase):
    pass

class CreditCard(CreditCardBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class TransactionBase(BaseModel):
    date: date
    description: str
    amount: float
    type: str
    category_id: Optional[int] = None
    subcategory_id: Optional[int] = None
    account_id: Optional[int] = None
    credit_card_id: Optional[int] = None

class TransactionCreate(TransactionBase):
    pass

class Transaction(TransactionBase):
    id: int
    status: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class StagedTransactionBase(BaseModel):
    date: date
    description: str
    amount: float
    type: str
    category_suggestion: Optional[str] = None
    account_suggestion: Optional[str] = None
    source_file: Optional[str] = None
    parsing_confidence: float

class StagedTransactionCreate(StagedTransactionBase):
    pass

class StagedTransaction(StagedTransactionBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
