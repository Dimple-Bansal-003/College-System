import { useState, useRef, useCallback } from 'react'
import { useData } from '../../context/DataContext'
import { calculateGrade, downloadFile } from '../../utils/helpers'
import ExcelRow from './ExcelRow'

export default function MarksEntry({ showToast }) {
  const { addRecord } = useData()
  const [setup, setSetup] = useState({ year: '', semester: '', maxMarks: 100 })
  const [subjects, setSubjects] = useState([])
  const [newSubject, setNewSubject] = useState('')
  const [isSetupDone, setIsSetupDone] = useState(false)
  const [rows, setRows] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const inputRefs = useRef({})

  const addSubject = () => {
    const name = newSubject.trim()
    if (!name) {
      showToast('Please enter a subject name', 'error')
      return
    }
    if (subjects.includes(name)) {
      showToast('Subject already added', 'error')
      return
    }
    setSubjects([...subjects, name])
    setNewSubject('')
  }

  const removeSubject = (index) => {
    setSubjects(subjects.filter((_, i) => i !== index))
  }

  const startMarksEntry = () => {
    if (!setup.year || !setup.semester) {
      showToast('Please select academic year and semester', 'error')
      return
    }
    if (subjects.length === 0) {
      showToast('Please add at least one subject', 'error')
      return
    }
    setIsSetupDone(true)
    setRows([{ rollNo: '', name: '', marks: Array(subjects.length).fill(''), saved: false }])
    
    setTimeout(() => {
      if (inputRefs.current['0-roll']) {
        inputRefs.current['0-roll'].focus()
      }
    }, 100)
  }

  const updateRow = (index, field, value) => {
    setRows(rows.map((row, i) => i === index ? { ...row, [field]: value } : row))
  }

  const addNewRow = () => {
    setRows([...rows, { rollNo: '', name: '', marks: Array(subjects.length).fill(''), saved: false }])
    
    setTimeout(() => {
      const newIndex = rows.length
      if (inputRefs.current[`${newIndex}-roll`]) {
        inputRefs.current[`${newIndex}-roll`].focus()
      }
    }, 100)
  }

  const saveRow = async (index) => {
    const row = rows[index]
    if (!row.rollNo.trim() || !row.name.trim()) {
      showToast('Please enter Roll No and Student Name', 'error')
      return
    }

    setIsLoading(true)

    const subjectsData = subjects.map((name, i) => ({
      name,
      marks: parseInt(row.marks[i]) || 0,
      max: setup.maxMarks
    }))

    const totalObtained = subjectsData.reduce((sum, s) => sum + s.marks, 0)
    const totalMax = subjects.length * setup.maxMarks
    const percentage = totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0
    const grade = calculateGrade(percentage)

    try {
      addRecord({
        type: 'marks',
        academic_year: setup.year,
        semester: setup.semester,
        roll_no: row.rollNo,
        student_name: row.name,
        subjects: JSON.stringify(subjectsData),
        total_obtained: totalObtained,
        total_max: totalMax,
        percentage,
        grade,
        status: percentage >= 40 ? 'Pass' : 'Fail'
      })

      setRows(rows.map((r, i) => i === index ? { ...r, saved: true } : r))
      showToast(`Saved: ${row.name} (Roll: ${row.rollNo})`)
      addNewRow()
    } catch (err) {
      showToast('An error occurred', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const deleteRow = (index) => {
    setRows(rows.filter((_, i) => i !== index))
  }

  const saveAllRows = async () => {
    for (let i = 0; i < rows.length; i++) {
      if (!rows[i].saved && rows[i].rollNo.trim() && rows[i].name.trim()) {
        await saveRow(i)
      }
    }
    showToast('All valid rows saved')
  }

  const downloadExcel = () => {
    const savedRows = rows.filter(r => r.saved)
    if (savedRows.length === 0) {
      showToast('No saved entries to download', 'error')
      return
    }

    let csv = 'Roll No,Student Name,' + subjects.join(',') + ',Total,Percentage,Grade\n'
    savedRows.forEach(row => {
      const totalObtained = row.marks.reduce((sum, m) => sum + (parseInt(m) || 0), 0)
      const totalMax = subjects.length * setup.maxMarks
      const percentage = totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0
      const grade = calculateGrade(percentage)
      csv += `${row.rollNo},${row.name},${row.marks.join(',')},${totalObtained}/${totalMax},${percentage}%,${grade}\n`
    })

    downloadFile(csv, `marks_${setup.semester.replace(' ', '_')}_${setup.year}.csv`)
    showToast('Download started')
  }

  const resetSetup = () => {
    setIsSetupDone(false)
    setRows([])
  }

  const savedCount = rows.filter(r => r.saved).length

  if (!isSetupDone) {
    return (
      <div className="setup-panel mb-6 animate-fade-in">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          Class Setup
        </h3>
        <p className="text-gray-600 mb-6">Configure the class details once, then enter marks for all students in an Excel-like grid.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year *</label>
            <select 
              value={setup.year} 
              onChange={e => setSetup({ ...setup, year: e.target.value })} 
              className="input-field"
            >
              <option value="">Select Year</option>
              {['2024-2025', '2023-2024', '2022-2023', '2021-2022'].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Semester *</label>
            <select 
              value={setup.semester} 
              onChange={e => setSetup({ ...setup, semester: e.target.value })} 
              className="input-field"
            >
              <option value="">Select Semester</option>
              {[1,2,3,4,5,6,7,8].map(s => (
                <option key={s} value={`Semester ${s}`}>Semester {s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Marks per Subject</label>
            <input 
              type="number" 
              value={setup.maxMarks} 
              onChange={e => setSetup({ ...setup, maxMarks: parseInt(e.target.value) || 100 })} 
              className="input-field" 
              min="1"
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Subjects *</label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newSubject}
              onChange={e => setNewSubject(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addSubject())}
              className="input-field flex-1"
              placeholder="Enter subject name and press Enter or click Add"
            />
            <button type="button" onClick={addSubject} className="btn-primary">Add</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {subjects.length > 0 ? subjects.map((s, i) => (
              <span key={i} className="subject-tag">
                {s}
                <button onClick={() => removeSubject(i)} title="Remove">×</button>
              </span>
            )) : (
              <p className="text-gray-400 text-sm">No subjects added yet</p>
            )}
          </div>
        </div>
        
        <button type="button" onClick={startMarksEntry} className="btn-primary">
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
            </svg>
            Start Marks Entry
          </span>
        </button>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              Marks Entry Sheet
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              <strong>Year:</strong> {setup.year} | <strong>Semester:</strong> {setup.semester} | <strong>Subjects:</strong> {subjects.length}
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={downloadExcel} className="btn-success">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                Download Excel
              </span>
            </button>
            <button onClick={resetSetup} className="btn-secondary">Change Setup</button>
          </div>
        </div>
      </div>
      
      <div className="card p-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            <strong>Tip:</strong> Enter Roll No and press <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">Enter</kbd> or <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">Tab</kbd> to move to next field.
          </p>
          <span className="badge badge-info">{savedCount} saved / {rows.length} total</span>
        </div>
        
        <div className="excel-grid overflow-x-auto" style={{ maxHeight: '500px', overflowY: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th style={{ minWidth: '60px' }}>#</th>
                <th style={{ minWidth: '120px' }}>Roll No</th>
                <th style={{ minWidth: '200px' }}>Student Name</th>
                {subjects.map((s, i) => (
                  <th key={i} style={{ minWidth: '100px' }}>{s}<br/><small>(Max: {setup.maxMarks})</small></th>
                ))}
                <th style={{ minWidth: '100px' }}>Total</th>
                <th style={{ minWidth: '80px' }}>%</th>
                <th style={{ minWidth: '80px' }}>Grade</th>
                <th style={{ minWidth: '100px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <ExcelRow
                  key={index}
                  row={row}
                  rowIndex={index}
                  subjects={subjects}
                  maxMarks={setup.maxMarks}
                  onUpdateRow={updateRow}
                  onSaveRow={saveRow}
                  onDeleteRow={deleteRow}
                  inputRefs={inputRefs}
                />
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <button onClick={addNewRow} className="btn-secondary">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
              </svg>
              Add Row
            </span>
          </button>
          <button onClick={saveAllRows} disabled={isLoading} className="btn-primary">
            <span className="flex items-center gap-2">
              {isLoading ? <span className="loading-spinner"></span> : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                </svg>
              )}
              Save All
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
