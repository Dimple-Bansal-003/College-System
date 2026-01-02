import { useCallback } from 'react'
import { calculateGrade } from '../../utils/helpers'

export default function ExcelRow({ 
  row, 
  rowIndex, 
  subjects, 
  maxMarks, 
  onUpdateRow, 
  onSaveRow, 
  onDeleteRow, 
  inputRefs 
}) {
  const calculateTotals = useCallback(() => {
    const totalObtained = row.marks.reduce((sum, m) => sum + (parseInt(m) || 0), 0)
    const totalMax = subjects.length * maxMarks
    const percentage = totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0
    const grade = calculateGrade(percentage)
    return { totalObtained, totalMax, percentage, grade }
  }, [row.marks, subjects.length, maxMarks])

  const totals = calculateTotals()

  const handleKeyDown = (e, fieldType, subjectIndex = -1) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault()
      
      if (fieldType === 'subject' && subjectIndex === subjects.length - 1) {
        onSaveRow(rowIndex)
      } else {
        const currentRefKey = fieldType === 'roll' ? `${rowIndex}-roll` : 
                              fieldType === 'name' ? `${rowIndex}-name` : 
                              `${rowIndex}-subject-${subjectIndex}`
        
        const allKeys = [
          `${rowIndex}-roll`,
          `${rowIndex}-name`,
          ...subjects.map((_, i) => `${rowIndex}-subject-${i}`)
        ]
        
        const currentIndex = allKeys.indexOf(currentRefKey)
        const nextKey = allKeys[currentIndex + 1]
        
        if (nextKey && inputRefs.current[nextKey]) {
          inputRefs.current[nextKey].focus()
        }
      }
    }
  }

  return (
    <tr className={row.saved ? 'saved-row' : 'current-row'}>
      <td className="row-number">{rowIndex + 1}</td>
      <td>
        <input
          ref={el => inputRefs.current[`${rowIndex}-roll`] = el}
          type="text"
          value={row.rollNo}
          onChange={e => onUpdateRow(rowIndex, 'rollNo', e.target.value)}
          onKeyDown={e => handleKeyDown(e, 'roll')}
          placeholder="Roll No"
          disabled={row.saved}
        />
      </td>
      <td>
        <input
          ref={el => inputRefs.current[`${rowIndex}-name`] = el}
          type="text"
          className="name-input"
          value={row.name}
          onChange={e => onUpdateRow(rowIndex, 'name', e.target.value)}
          onKeyDown={e => handleKeyDown(e, 'name')}
          placeholder="Student Name"
          disabled={row.saved}
        />
      </td>
      {subjects.map((_, i) => (
        <td key={i}>
          <input
            ref={el => inputRefs.current[`${rowIndex}-subject-${i}`] = el}
            type="number"
            min="0"
            max={maxMarks}
            value={row.marks[i] || ''}
            onChange={e => {
              const newMarks = [...row.marks]
              newMarks[i] = e.target.value
              onUpdateRow(rowIndex, 'marks', newMarks)
            }}
            onKeyDown={e => handleKeyDown(e, 'subject', i)}
            placeholder="0"
            disabled={row.saved}
          />
        </td>
      ))}
      <td className="total-cell">{totals.totalObtained}/{totals.totalMax}</td>
      <td className="percentage-cell">{totals.percentage}%</td>
      <td className={`text-center font-bold p-3 ${totals.grade === 'F' ? 'text-red-600' : totals.grade.includes('A') ? 'text-green-600' : 'text-blue-600'}`}>
        {totals.grade}
      </td>
      <td style={{ textAlign: 'center', padding: '8px' }}>
        {!row.saved && (
          <>
            <button onClick={() => onSaveRow(rowIndex)} className="text-green-500 hover:text-green-700 p-1" title="Save">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
              </svg>
            </button>
            <button onClick={() => onDeleteRow(rowIndex)} className="text-red-500 hover:text-red-700 p-1" title="Delete">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </>
        )}
      </td>
    </tr>
  )
}
