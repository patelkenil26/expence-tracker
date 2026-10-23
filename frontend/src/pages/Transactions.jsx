// src/pages/Transactions.jsx
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { FiList } from "react-icons/fi";

import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import TransactionFilters from "../components/filters/TransactionFilters";
import TransactionTable from "../components/transactions/TransactionTable";
import { selectMergedCategoryNames } from "../store/categorySlice";
import { useTransactionsData } from "../hooks/useTransactionsData";

function Transactions() {
  const categories = useSelector(selectMergedCategoryNames);

  const [filters, setFilters] = useState({
    search: "",
    type: "",
    category: "",
    startDate: "",
    endDate: "",
    sort: "desc", // desc = newest first
  });

  // TanStack Query custom hook for fetching and deleting
  const { transactions: rawList, loading, deleteTransaction } = useTransactionsData(filters);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      type: "",
      category: "",
      startDate: "",
      endDate: "",
      sort: "desc",
    });
  };

  const filteredList = useMemo(() => {
    let list = [...rawList];

    // Client-side search for note or category
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter((tx) => {
        const note = tx.note?.toLowerCase() || "";
        const cat = tx.category?.toLowerCase() || "";
        return note.includes(q) || cat.includes(q);
      });
    }

    // Client-side amount sort
    if (filters.sort === "high") {
      list.sort((a, b) => (b.amount || 0) - (a.amount || 0));
    } else if (filters.sort === "low") {
      list.sort((a, b) => (a.amount || 0) - (b.amount || 0));
    } else if (filters.sort === "asc") {
      list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (filters.sort === "desc") {
      list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    return list;
  }, [rawList, filters.search, filters.sort]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    try {
      await deleteTransaction(id);
    } catch {
      // Handled in TanStack mutation
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      <PageHeader
        title="All Transactions"
        subtitle="Search, filter, and inspect your unified income and expense ledger."
        icon={<FiList />}
      />

      <Card>
        <TransactionFilters
          filters={filters}
          categories={categories}
          onChange={handleFilterChange}
          onClear={handleClearFilters}
        />

        <TransactionTable
          list={filteredList}
          loading={loading}
          onDelete={handleDelete}
        />
      </Card>
    </div>
  );
}

export default Transactions;
