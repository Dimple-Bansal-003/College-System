import { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './components/dashboard/Dashboard';
import FacultyManagement from './components/faculty/FacultyManagement';
import StaffManagement from './components/faculty/StaffManagement';
import StudentManagement from './components/students/StudentManagement';
import ViewStudents from './components/students/ViewStudents';
import ExamScheduling from './components/exams/ExamScheduling';
import ExamTimetable from './components/exams/ExamTimetable';
import MarksEvaluation from './components/marks/MarksEvaluation';
import SubjectAssignment from './components/subjects/SubjectAssignment';
import GracingMarks from './components/gracing/GracingMarks';
import ReportGeneration from './components/reports/ReportGeneration';

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard': return <Dashboard />;
      case 'faculty': return <FacultyManagement />;
      case 'staff': return <StaffManagement />;
      case 'students': return <StudentManagement />;
      case 'view-students': return <ViewStudents />;
      case 'exam-scheduling': return <ExamScheduling />;
      case 'exam-timetable': return <ExamTimetable />;
      case 'marks-evaluation': return <MarksEvaluation />;
      case 'subject-assignment': return <SubjectAssignment />;
      case 'gracing-marks': return <GracingMarks />;
      case 'reports': return <ReportGeneration />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      <div className="flex-1 lg:ml-64">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;