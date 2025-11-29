import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FiList } from "react-icons/fi";

import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import TransactionFilters from "../components/filters/TransactionFilters";
import TransactionTable from "../components/transactions/TransactionTable";
import { getTransactionsApi, deleteTransactionApi } from "../api/transactionApi";
import { selectMergedCategoryNames } from "../store/categorySlice";

function Transactions() {
  const categories = useSelector(selectMergedCategoryNames);
  const [rawList, setRawList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    type: "",
    category: "",
    startDate: "",
    endDate: "",
    sort: "desc", // desc = newest first
  });

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

  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const query = {
        limit: 500,
      };

      if (filters.type) query.type = filters.type;
      if (filters.category) query.category = filters.category;
      if (filters.startDate) query.startDate = filters.startDate;
      if (filters.endDate) query.endDate = filters.endDate;

      // sort only by date for backend
      if (filters.sort === "asc" || filters.sort === "desc") {
        query.sort = filters.sort;
      }

      const res = await getTransactionsApi(query);
      const list = Array.isArray(res.data?.data) ? res.data.data : [];
      setRawList(list);
    } catch (err) {
      console.error("Fetch transactions error:", err);
      toast.error("Failed to load transactions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.type, filters.category, filters.startDate, filters.endDate, filters.sort === "asc" || filters.sort === "desc" ? filters.sort : "desc"]);
  // note: search filter only client-side, isliye dependency me nahi rakha

  const filteredList = useMemo(() => {
    let list = [...rawList];

    // client-side search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter((tx) => {
        const note = tx.note?.toLowerCase() || "";
        const cat = tx.category?.toLowerCase() || "";
        return note.includes(q) || cat.includes(q);
      });
    }

    // sort by amount client-side (high/low)
    if (filters.sort === "high") {
      list.sort((a, b) => (b.amount || 0) - (a.amount || 0));
    } else if (filters.sort === "low") {
      list.sort((a, b) => (a.amount || 0) - (b.amount || 0));
    } else if (filters.sort === "asc") {
      list.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    } else if (filters.sort === "desc") {
      list.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    }

    return list;
  }, [rawList, filters.search, filters.sort]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    try {
      await deleteTransactionApi(id);
      toast.success("Transaction deleted.");
      setRawList((prev) => prev.filter((tx) => tx._id !== id));
    } catch (err) {
      console.error("Delete transaction error:", err);
      toast.error("Failed to delete transaction.");
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="All Transactions"
        subtitle="Search and filter through all your income and expenses."
        icon={<FiList />}
      />

      <Card className="p-4 sm:p-5">
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
