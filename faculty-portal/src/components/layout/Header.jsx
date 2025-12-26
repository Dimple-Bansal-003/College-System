import React from "react";
import { Bell, Settings } from "lucide-react";
import { getCurrentDateTime } from "../../utils/dateUtils";
function Header() {
  return (
    <header className="bg-white shadow-sm px-8 py-4 flex items-center justify-between">
      {" "}
      <div>
        {" "}
        <h2 className="text-2xl font-bold text-gray-800">
          Welcome back, Professor
        </h2>{" "}
        <p className="text-gray-500 text-sm">{getCurrentDateTime()}</p>{" "}
      </div>{" "}
      <div className="flex items-center gap-4">
        {" "}
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors relative">
          {" "}
          <Bell className="text-gray-600" size={20} />{" "}
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>{" "}
        </button>{" "}
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          {" "}
          <Settings className="text-gray-600" size={20} />{" "}
        </button>{" "}
      </div>{" "}
    </header>
  );
}
export default Header;
