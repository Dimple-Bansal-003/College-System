import React from "react";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";
function Layout({ children }) {
  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {" "}
      <Sidebar />{" "}
      <div className="flex-1 flex flex-col overflow-hidden">
        {" "}
        <Header />{" "}
        <main className="flex-1 overflow-auto p-8">{children}</main>{" "}
      </div>{" "}
    </div>
  );
}
export default Layout;
