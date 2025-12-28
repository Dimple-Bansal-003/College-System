import React from 'react';
import { NavLink } from 'react-router-dom';
import { GraduationCap, LayoutDashboard, Calendar, Edit3, BarChart3, Upload, Table, FileText, Eye, User } from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/scheduling', label: 'Exam Scheduling', icon: Calendar },
  { path: '/marks-entry', label: 'Marks Entry', icon: Edit3 },
  { path: '/evaluation', label: 'Marks Evaluation', icon: BarChart3 },
  { path: '/question-papers', label: 'Question Papers', icon: Upload },
  { path: '/student-marks', label: 'Student Marks', icon: Table },
  { path: '/reports', label: 'Reports', icon: FileText },
  { path: '/results', label: 'Results Preview', icon: Eye },
];

function Sidebar() {
  return (
    <aside className="w-64 flex-shrink-0 flex flex-col bg-gradient-to-b from-primary to-secondary">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-2">
          <GraduationCap className="text-white" size={32} />
          <h1 className="text-xl font-bold text-white">Faculty Portal</h1>
        </div>
        <p className="text-blue-200 text-sm">University Exam Management</p>
      </div>
      <nav className="flex-1 mt-4">
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink key={path} to={path} className={({ isActive }) => `w-full flex items-center gap-3 px-6 py-3 text-white transition-colors hover:bg-white/10 ${isActive ? 'bg-white/15 border-l-4 border-white' : ''}`}>
            <Icon size={20} />{label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"><User className="text-white" size={20} /></div>
          <div><p className="text-white font-medium text-sm">Dr. John Smith</p><p className="text-blue-200 text-xs">Faculty ID: FAC2024</p></div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;