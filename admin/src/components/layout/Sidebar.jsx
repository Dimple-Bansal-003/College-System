import { useState } from 'react';
import { FiHome, FiUsers, FiUserCheck, FiBook, FiCalendar, FiFileText, FiPercent, FiChevronDown, FiChevronRight, FiX, FiGrid, FiClipboard, FiAward } from 'react-icons/fi';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: FiHome },
  { id: 'users', label: 'User Management', icon: FiUsers, subItems: [
    { id: 'faculty', label: 'Faculty', icon: FiUserCheck },
    { id: 'staff', label: 'Staff', icon: FiUsers },
  ]},
  { id: 'student-management', label: 'Students', icon: FiAward, subItems: [
    { id: 'students', label: 'Add Students', icon: FiAward },
    { id: 'view-students', label: 'View Students', icon: FiGrid },
  ]},
  { id: 'exam-management', label: 'Exams', icon: FiCalendar, subItems: [
    { id: 'exam-scheduling', label: 'Schedule Exams', icon: FiCalendar },
    { id: 'exam-timetable', label: 'Upload Timetable', icon: FiFileText },
  ]},
  { id: 'marks-evaluation', label: 'Marks Evaluation', icon: FiClipboard },
  { id: 'subject-assignment', label: 'Assign Subjects', icon: FiBook },
  { id: 'gracing-marks', label: 'Gracing Marks', icon: FiPercent },
  { id: 'reports', label: 'Reports', icon: FiFileText },
];

export default function Sidebar({ activeSection, setActiveSection, isOpen, setIsOpen }) {
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (id) => setOpenMenus(prev => ({ ...prev, [id]: !prev[id] }));
  const handleItemClick = (id) => { setActiveSection(id); setIsOpen(false); };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsOpen(false)} />}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <FiAward className="text-white text-xl" />
            </div>
            <div>
              <h1 className="font-bold text-primary-600">University</h1>
              <p className="text-xs text-gray-500">Admin Portal</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-500"><FiX size={24} /></button>
        </div>
        <nav className="p-4 overflow-y-auto h-[calc(100%-4rem)]">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                {item.subItems ? (
                  <div>
                    <button onClick={() => toggleMenu(item.id)} className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                      <span className="flex items-center gap-3"><item.icon size={18} /><span className="text-sm font-medium">{item.label}</span></span>
                      {openMenus[item.id] ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
                    </button>
                    {openMenus[item.id] && (
                      <ul className="mt-1 ml-4 space-y-1">
                        {item.subItems.map((subItem) => (
                          <li key={subItem.id}>
                            <button onClick={() => handleItemClick(subItem.id)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${activeSection === subItem.id ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                              <subItem.icon size={16} />{subItem.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <button onClick={() => handleItemClick(item.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeSection === item.id ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                    <item.icon size={18} />{item.label}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}