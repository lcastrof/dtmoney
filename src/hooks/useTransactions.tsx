import { createContext, ReactNode, useContext } from 'react';
import { useEffect, useState } from "react";
import { api } from '../services/api';

interface Transaction {
  id: number;
  title: string;
  type: string;
  category: string;
  amount: number;
  createdAt: string;
}

interface TransactionsProviderProps {
  children: ReactNode;
}

interface TransactionsContextData {
  transactions: Transaction[];
  createTransaction: (transaction: TransactionInput) => Promise<void>;
}

type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>;

const TransactionsContext = createContext({} as TransactionsContextData);

export function TransactionsProvider({ children }:TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    api.get('http://localhost:3000/api/transactions')
      .then(response => setTransactions(response.data.transactions))
  }, []);

  async function createTransaction(inputTransaction: TransactionInput) {
    const response = await api.post('/transactions', {
      ...inputTransaction,
      createdAt: new Date()
    });
    const { transaction } = response.data;

    setTransactions([...transactions, transaction]);
  }

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        createTransaction
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionsContext);

  return context;
}