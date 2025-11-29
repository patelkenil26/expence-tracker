export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || Number.isNaN(amount)) {
    return "₹ 0";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
};


export const formatDate = (dateStr) => {
  if (!dateStr) return "-";

  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};