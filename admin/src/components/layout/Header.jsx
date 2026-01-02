import { FiMenu, FiBell, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';
import { useState } from 'react';

export default function Header({ toggleSidebar }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4">
        <button onClick={toggleSidebar} className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"><FiMenu size={24} /></button>
        <h2 className="text-lg font-semibold text-gray-800 hidden sm:block">Admin Dashboard</h2>
        <div className="flex items-center gap-3">
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <FiBell size={20} /><span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="relative">
            <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-medium">A</div>
              <span className="hidden sm:block text-sm font-medium text-gray-700">Admin</span>
            </button>
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><FiUser size={16} /> Profile</button>
                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><FiSettings size={16} /> Settings</button>
                <hr className="my-1" />
                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100"><FiLogOut size={16} /> Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}