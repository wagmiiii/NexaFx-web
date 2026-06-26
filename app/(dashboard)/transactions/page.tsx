"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { TransactionFilters } from "@/components/dashboard/transaction-filters";
import { Pagination } from "@/components/shared/pagination";
import { getTransactions, Transaction, TransactionFilters as APIFilters } from "@/lib/api/transactions";
import { TransactionTable } from "@/components/dashboard/transaction-table";
import { TransactionDetails } from "@/components/transactions/transaction-details";

function TransactionsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Transaction | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchFilteredTransactions = async () => {
      setLoading(true);
      setError(null);
      
      const filters: APIFilters = {
        type: searchParams.get("type") || "All",
        status: searchParams.get("status") || "All",
        page: Number(searchParams.get("page")) || 1,
        limit: Number(searchParams.get("limit")) || 20,
        startDate: searchParams.get("startDate") || undefined,
        endDate: searchParams.get("endDate") || undefined,
      };

      try {
        const response = await getTransactions(filters);
        if (!cancelled) {
          setTransactions(response.data || []);
          setTotal(response.total || 0);
          setCurrentPage(response.page || 1);
          setTotalPages(response.totalPages || Math.ceil((response.total || 0) / (response.limit || 20)) || 1);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const errorMessage = err instanceof Error ? err.message : "Failed to fetch transactions";
          setError(errorMessage);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchFilteredTransactions();

    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-col h-full space-y-6 max-w-7xl mx-auto w-full p-4 md:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Transaction History</h1>
      </div>
      
      <TransactionFilters />

      <div className="bg-card rounded-xl p-4 md:p-6 shadow-sm border border-border/50">
        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-12 bg-muted/30 border-b border-border rounded-t-md" />
            <div className="divide-y divide-border">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted" />
                    <div className="h-4 w-20 bg-muted rounded" />
                  </div>
                  <div className="h-4 w-12 bg-muted rounded" />
                  <div className="h-4 w-24 bg-muted rounded" />
                  <div className="h-6 w-16 bg-muted rounded-full" />
                  <div className="h-4 w-20 bg-muted rounded ml-auto" />
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <p className="text-sm text-muted-foreground">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setLoading(true);
                getTransactions({
                  type: searchParams.get("type") || "All",
                  status: searchParams.get("status") || "All",
                  page: Number(searchParams.get("page")) || 1,
                  limit: Number(searchParams.get("limit")) || 20,
                  startDate: searchParams.get("startDate") || undefined,
                  endDate: searchParams.get("endDate") || undefined,
                }).then(res => {
                  setTransactions(res.data);
                  setTotal(res.total);
                  setCurrentPage(res.page);
                  setTotalPages(res.totalPages || Math.ceil(res.total / res.limit));
                  setLoading(false);
                }).catch(() => setLoading(false));
              }}
              className="text-sm font-medium text-primary hover:underline px-4 py-2 border rounded-md"
            >
              Retry
            </button>
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 space-y-4 min-h-[400px] border rounded-lg bg-card">
            <p className="text-lg font-medium text-muted-foreground">No transactions found for the selected filters.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Showing {transactions.length} of {total} transactions
            </div>
            <TransactionTable
              transactions={transactions}
              onSelectTransaction={setSelected}
            />
            {total > 0 && totalPages > 1 && (
              <div className="pt-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        )}
      </div>
      <TransactionDetails
        transaction={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}

export default function TransactionsPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col h-full space-y-6 max-w-7xl mx-auto w-full p-4 md:p-6 items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    }>
      <TransactionsContent />
    </Suspense>
  );
}
