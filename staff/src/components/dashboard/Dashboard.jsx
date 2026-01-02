import { useMemo } from 'react'
import { useData } from '../../context/DataContext'

export default function Dashboard() {
  const { marksData } = useData()

  const stats = useMemo(() => {
    const total = marksData.length
    const passed = marksData.filter(m => m.percentage >= 40).length
    const avg = total > 0 ? Math.round(marksData.reduce((s, m) => s + (m.percentage || 0), 0) / total) : 0
    const today = new Date().toDateString()
    const todayEntries = marksData.filter(m => new Date(m.timestamp).toDateString() === today).length
    
    const grades = { 'A+': 0, 'A': 0, 'B+': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0 }
    marksData.forEach(m => { if (grades[m.grade] !== undefined) grades[m.grade]++ })
    
    return { total, passed, avg, todayEntries, grades }
  }, [marksData])

  const recentEntries = useMemo(() => marksData.slice(-5).reverse(), [marksData])

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <svg className="w-10 h-10 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
            <span className="text-4xl font-bold">{stats.total}</span>
          </div>
          <p className="text-blue-200">Total Students</p>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-400 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <svg className="w-10 h-10 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span className="text-4xl font-bold">{stats.passed}</span>
          </div>
          <p className="text-emerald-100">Students Passed</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-600 to-purple-400 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <svg className="w-10 h-10 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/>
            </svg>
            <span className="text-4xl font-bold">{stats.avg}%</span>
          </div>
          <p className="text-purple-100">Average Score</p>
        </div>
        
        <div className="bg-gradient-to-br from-amber-500 to-orange-400 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <svg className="w-10 h-10 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span className="text-4xl font-bold">{stats.todayEntries}</span>
          </div>
          <p className="text-amber-100">Today's Entries</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
            </svg>
            Recent Entries
          </h3>
          <div className="space-y-3">
            {recentEntries.length > 0 ? recentEntries.map((m) => (
              <div key={m.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="font-semibold text-blue-600">{m.student_name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{m.student_name}</p>
                    <p className="text-xs text-gray-500">Roll: {m.roll_no} • {m.semester}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${m.percentage >= 40 ? 'text-green-600' : 'text-red-600'}`}>{m.percentage}%</p>
                  <p className="text-xs text-gray-500">{m.grade}</p>
                </div>
              </div>
            )) : (
              <p className="text-gray-500 text-center py-8">No recent entries</p>
            )}
          </div>
        </div>
        
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            Grade Distribution
          </h3>
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{stats.grades['A+'] + stats.grades['A']}</p>
              <p className="text-sm text-gray-500">A+/A</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.grades['B+'] + stats.grades['B']}</p>
              <p className="text-sm text-gray-500">B+/B</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-yellow-600">{stats.grades['C'] + stats.grades['D']}</p>
              <p className="text-sm text-gray-500">C/D</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-red-600">{stats.grades['F']}</p>
              <p className="text-sm text-gray-500">F</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
