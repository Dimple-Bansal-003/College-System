import { FiUsers, FiUserCheck, FiAward, FiCalendar, FiTrendingUp } from 'react-icons/fi';
import PageHeader from '../common/PageHeader';
import ExamCalendar from './ExamCalendar';

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <div className="card">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-3xl font-bold text-gray-800 mt-1">{value}</h3>
        {trend && <p className="flex items-center gap-1 text-green-600 text-sm mt-2"><FiTrendingUp size={14} /> {trend}</p>}
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}><Icon size={24} className="text-white" /></div>
    </div>
  </div>
);

export default function Dashboard() {
  const stats = [
    { title: 'Total Faculty', value: '-', icon: FiUsers, color: 'bg-blue-500' },
    { title: 'Total Staff', value: '-', icon: FiUserCheck, color: 'bg-purple-500' },
    { title: 'Total Students', value: '-', icon: FiAward, color: 'bg-green-500' },
    { title: 'Upcoming Exams', value: '5', icon: FiCalendar, color: 'bg-orange-500' },
  ];

  // Sample exam data - connect to your actual data source
  const upcomingExams = [
    { id: 1, subject: 'Mathematics', date: '2024-01-15', time: '10:00 AM', venue: 'Hall A', type: 'Mid-Term' },
    { id: 2, subject: 'Physics', date: '2024-01-18', time: '2:00 PM', venue: 'Hall B', type: 'Internal' },
    { id: 3, subject: 'Chemistry', date: '2024-01-22', time: '10:00 AM', venue: 'Lab 1', type: 'Practical' },
    { id: 4, subject: 'English', date: '2024-01-25', time: '11:00 AM', venue: 'Hall A', type: 'End-Term' },
    { id: 5, subject: 'Computer Science', date: '2024-01-28', time: '9:00 AM', venue: 'Lab 2', type: 'Practical' },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Welcome back, Admin! Here's what's happening." />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => <StatCard key={index} {...stat} />)}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Exam Calendar - Takes 2 columns */}
        <div className="lg:col-span-2">
          <ExamCalendar exams={upcomingExams} />
        </div>
        
        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 text-sm flex items-center gap-3 transition-colors">
                <FiUsers size={18} className="text-blue-500" /> Add Faculty
              </button>
              <button className="w-full px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 text-sm flex items-center gap-3 transition-colors">
                <FiAward size={18} className="text-green-500" /> Add Students
              </button>
              <button className="w-full px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 text-sm flex items-center gap-3 transition-colors">
                <FiCalendar size={18} className="text-orange-500" /> Schedule Exam
              </button>
            </div>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activities</h3>
            <div className="text-center py-6 text-gray-500">
              <p>No recent activities.</p>
              <p className="text-sm mt-1">Connect to database to see data.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}