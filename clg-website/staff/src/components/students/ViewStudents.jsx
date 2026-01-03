import { useState, useMemo } from 'react'
import { useData } from '../../context/DataContext'

export default function ViewStudents() {
  const { marksData } = useData()
  const [yearFilter, setYearFilter] = useState('all')
  const [semesterFilter, setSemesterFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const years = useMemo(() => 
    [...new Set(marksData.map(m => m.academic_year).filter(Boolean))].sort().reverse(), 
    [marksData]
  )

  const filteredData = useMemo(() => {
    let filtered = marksData
    if (yearFilter !== 'all') filtered = filtered.filter(m => m.academic_year === yearFilter)
    if (semesterFilter !== 'all') filtered = filtered.filter(m => m.semester === semesterFilter)
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(m => 
        m.student_name.toLowerCase().includes(term) || 
        m.roll_no.toLowerCase().includes(term)
      )
    }
    return filtered
  }, [marksData, yearFilter, semesterFilter, searchTerm])

  return (
    <div className="card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h3 className="text-lg font-semibold">Students by Academic Year</h3>
        <div className="flex items-center gap-4">
          <select 
            value={yearFilter} 
            onChange={e => setYearFilter(e.target.value)} 
            className="input-field w-auto"
          >
            <option value="all">All Years</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <select 
            value={semesterFilter} 
            onChange={e => setSemesterFilter(e.target.value)} 
            className="input-field w-auto"
          >
            <option value="all">All Semesters</option>
            {[1,2,3,4,5,6,7,8].map(s => (
              <option key={s} value={`Semester ${s}`}>Semester {s}</option>
            ))}
          </select>
          <div className="relative">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input 
              type="text" 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
              className="input-field pl-10 w-auto" 
              placeholder="Search students..."
            />
          </div>
        </div>
      </div>
      
      {filteredData.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Name</th>
                <th>Academic Year</th>
                <th>Semester</th>
                <th>Total Marks</th>
                <th>Percentage</th>
                <th>Grade</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((m) => (
                <tr key={m.id}>
                  <td className="font-mono font-medium">{m.roll_no}</td>
                  <td className="font-medium">{m.student_name}</td>
                  <td><span className="badge badge-info">{m.academic_year || '-'}</span></td>
                  <td>{m.semester}</td>
                  <td className="font-semibold">{m.total_obtained}/{m.total_max}</td>
                  <td className={`font-bold ${m.percentage >= 40 ? 'text-green-600' : 'text-red-600'}`}>
                    {m.percentage}%
                  </td>
                  <td>
                    <span className={`badge ${m.grade === 'F' ? 'badge-danger' : m.grade.includes('A') ? 'badge-success' : 'badge-info'}`}>
                      {m.grade}
                    </span>
                  </td>
                  <td>
                    {m.percentage >= 40 ? (
                      <span className="badge badge-success">PASS</span>
                    ) : (
                      <span className="badge badge-danger">FAIL</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 text-center py-8">No students found. Add marks to see students here.</p>
      )}
    </div>
  )
}
