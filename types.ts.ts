
export interface Transaction {
  date: string;
  description: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
}

export interface BankStatementData {
  bankName: string;
  period: string;
  transactions: Transaction[];
}

export enum AppState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
  ERROR = 'ERROR'
}
