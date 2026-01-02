import { useState, useMemo } from 'react'
import { useData } from '../../context/DataContext'
import { downloadFile } from '../../utils/helpers'

export default function ViewMarks({ showToast }) {
  const { marksData, deleteRecord } = useData()
  const [yearFilter, setYearFilter] = useState('all')
  const [semesterFilter, setSemesterFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)

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

  const handleDelete = (id) => {
    deleteRecord(id)
    showToast('Record deleted successfully')
    setDeleteConfirmId(null)
  }

  const downloadAllMarks = () => {
    if (marksData.length === 0) {
      showToast('No data to export', 'error')
      return
    }

    let csv = 'Roll No,Student Name,Academic Year,Semester,Total Obtained,Total Max,Percentage,Grade,Status\n'
    marksData.forEach(m => {
      csv += `${m.roll_no},${m.student_name},${m.academic_year || ''},${m.semester},${m.total_obtained},${m.total_max},${m.percentage}%,${m.grade},${m.status}\n`
    })

    downloadFile(csv, `all_marks_${new Date().toISOString().split('T')[0]}.csv`)
    showToast('Download started')
  }

  return (
    <div className="card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h3 className="text-lg font-semibold">All Student Marks</h3>
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
              placeholder="Search..."
            />
          </div>
          <button onClick={downloadAllMarks} className="btn-success">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
              Export
            </span>
          </button>
        </div>
      </div>
      
      {filteredData.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student Name</th>
                <th>Year</th>
                <th>Semester</th>
                <th>Subjects</th>
                <th>Total</th>
                <th>%</th>
                <th>Grade</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((m) => {
                const subjectsData = m.subjects ? JSON.parse(m.subjects) : []
                return (
                  <tr key={m.id}>
                    <td className="font-mono font-medium">{m.roll_no}</td>
                    <td className="font-medium">{m.student_name}</td>
                    <td><span className="badge badge-info">{m.academic_year || '-'}</span></td>
                    <td>{m.semester}</td>
                    <td>
                      <div className="text-sm text-gray-600">
                        {subjectsData.map(s => `${s.name}: ${s.marks}`).join(', ')}
                      </div>
                    </td>
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
                      {deleteConfirmId === m.id ? (
                        <div className="confirm-inline">
                          <button 
                            className="confirm-btn confirm-yes" 
                            onClick={() => handleDelete(m.id)}
                          >
                            Yes
                          </button>
                          <button 
                            className="confirm-btn confirm-no" 
                            onClick={() => setDeleteConfirmId(null)}
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setDeleteConfirmId(m.id)} 
                          className="text-red-500 hover:text-red-700" 
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 text-center py-8">No marks recorded yet</p>
      )}
    </div>
  )
}
