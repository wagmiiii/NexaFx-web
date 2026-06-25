export type TransactionType = "Deposit" | "Withdraw" | "Convert" | "Transfer";
export type TransactionStatus = "Success" | "Failed" | "Pending";

export interface Transaction {
  id: string;
  userId: string;
  userEmail: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  currency: string;
  toAmount?: number;
  toCurrency?: string;
  date: string;
}

export interface AdminTransactionFilters {
  search?: string; // user email or transaction ID
  type?: TransactionType;
  status?: TransactionStatus;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

// Mock data generation for testing the UI
const generateMockTransactions = (): Transaction[] => {
  return Array.from({ length: 50 }).map((_, i) => ({
    id: `tx_${Math.random().toString(36).substring(2, 9)}`,
    userId: `usr_${Math.floor(Math.random() * 1000)}`,
    userEmail: `user${i}@example.com`,
    type: ["Deposit", "Withdraw", "Convert", "Transfer"][Math.floor(Math.random() * 4)] as TransactionType,
    status: ["Success", "Failed", "Pending"][Math.floor(Math.random() * 3)] as TransactionStatus,
    amount: parseFloat((Math.random() * 1000).toFixed(2)),
    currency: "USD",
    date: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  }));
};

// Keep in memory so filters apply to a consistent dataset
const MOCK_TRANSACTIONS = generateMockTransactions();

export const getAdminTransactions = async (filters?: AdminTransactionFilters): Promise<{
  data: Transaction[];
  total: number;
  totalPages: number;
}> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  let filtered = [...MOCK_TRANSACTIONS];

  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (tx) => tx.id.toLowerCase().includes(searchLower) || tx.userEmail.toLowerCase().includes(searchLower)
    );
  }
  
  if (filters?.type) {
    filtered = filtered.filter((tx) => tx.type === filters.type);
  }
  
  if (filters?.status) {
    filtered = filtered.filter((tx) => tx.status === filters.status);
  }

  if (filters?.startDate) {
    const start = new Date(filters.startDate).getTime();
    filtered = filtered.filter(tx => new Date(tx.date).getTime() >= start);
  }
  
  if (filters?.endDate) {
    const end = new Date(filters.endDate).getTime();
    filtered = filtered.filter(tx => new Date(tx.date).getTime() <= end);
  }

  const page = filters?.page || 1;
  const limit = filters?.limit || 20;
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  
  const startIdx = (page - 1) * limit;
  const data = filtered.slice(startIdx, startIdx + limit);

  return {
    data,
    total,
    totalPages,
  };
};
