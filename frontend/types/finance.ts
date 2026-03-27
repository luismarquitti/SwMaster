export interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  type: "Income" | "Expense";
  category_id?: number;
  subcategory_id?: number;
  account_id?: number;
  status: "confirmed" | "pending" | "staged";
}

export interface StagedTransaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  type: string;
  category_suggestion?: string;
  account_suggestion?: string;
  source_file?: string;
  parsing_confidence: number;
}

export interface Category {
  id: number;
  name: string;
  type: string;
}

export interface Account {
  id: number;
  name: string;
  institution: string;
  type: string;
  current_balance: number;
}
