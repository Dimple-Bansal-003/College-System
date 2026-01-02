import { useState } from 'react'
import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'
import Dashboard from './components/dashboard/Dashboard'
import ViewStudents from './components/students/ViewStudents'
import MarksEntry from './components/marks/MarksEntry'
import ViewMarks from './components/marks/ViewMarks'
import Toast from './components/ui/Toast'

function App() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [toasts, setToasts] = useState([])
  const [config] = useState({
    portal_title: 'Staff Portal',
    staff_name: 'Staff Member',
    department_name: 'Marks Entry System'
  })

  const showToast = (message, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  const pageTitles = {
    'dashboard': 'Dashboard',
    'students': 'View Students',
    'marks-entry': 'Enter Marks',
    'view-marks': 'View Marks'
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        config={config} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={pageTitles[activeSection]} />
        
        <main className="flex-1 overflow-auto p-8">
          {activeSection === 'dashboard' && <Dashboard />}
          {activeSection === 'students' && <ViewStudents />}
          {activeSection === 'marks-entry' && <MarksEntry showToast={showToast} />}
          {activeSection === 'view-marks' && <ViewMarks showToast={showToast} />}
        </main>
      </div>

      {/* Toast Container */}
      <div id="toast-container">
        {toasts.map(toast => (
          <Toast 
            key={toast.id} 
            message={toast.message} 
            type={toast.type} 
            onClose={() => removeToast(toast.id)} 
          />
        ))}
      </div>
    </div>
  )
}

export default App
