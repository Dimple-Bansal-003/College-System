import React from "react";
import { ArrowRight } from "lucide-react";
function StatCard({ label, value, icon: Icon, onClick, gradient }) {
  return (
    <div
      className={`bg-gradient-to-br ${gradient} text-white rounded-xl p-5 cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-lg`}
      onClick={onClick}
    >
      {" "}
      <div className="flex items-center justify-between mb-3">
        {" "}
        <Icon className="opacity-80" size={32} />{" "}
        <span className="text-3xl font-bold">{value}</span>{" "}
      </div>{" "}
      <p className="text-white/80">{label}</p>{" "}
      <p className="text-xs text-white/60 mt-2 flex items-center gap-1">
        {" "}
        <ArrowRight size={12} /> Click to view{" "}
      </p>{" "}
    </div>
  );
}
export default StatCard;
