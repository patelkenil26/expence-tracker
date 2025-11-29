// src/components/ui/Card.jsx
import React from "react";

function Card({ children, className = "" }) {
  return (
    <div
      className={
        "bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm " +
        className
      }
    >
      {children}
    </div>
  );
}

export default Card;
