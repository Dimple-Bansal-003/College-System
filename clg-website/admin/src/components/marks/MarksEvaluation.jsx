import { useState } from 'react';
import { FiSave, FiDownload, FiSearch } from 'react-icons/fi';
import PageHeader from '../common/PageHeader';
import { useApp } from '../../context/AppContext';
import { isFailingMarks, exportToExcel } from '../../utils/helpers';

export default function MarksEvaluation() {
  const { showNotification } = useApp();
  const [semester, setSemester] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [marksData, setMarksData] = useState([]);
  const [editingCell, setEditingCell] = useState(null);

  const subjects = [
    { code: 'MTH101', name: 'Mathematics', maxMarks: 100, passingMarks: 40 },
    { code: 'PHY101', name: 'Physics', maxMarks: 100, passingMarks: 40 },
    { code: 'CHM101', name: 'Chemistry', maxMarks: 100, passingMarks: 40 },
    { code: 'ENG101', name: 'English', maxMarks: 100, passingMarks: 40 },
    { code: 'CSE101', name: 'Computer Science', maxMarks: 100, passingMarks: 40 },
  ];

  const handleCellEdit = (studentId, subjectCode, value) => {
    const numValue = parseInt(value) || 0;
    const subject = subjects.find(s => s.code === subjectCode);
    const clampedValue = Math.min(Math.max(0, numValue), subject?.maxMarks || 100);
    
    setMarksData(prev => prev.map(student => 
      student.id === studentId 
        ? { ...student, marks: { ...student.marks, [subjectCode]: clampedValue } }
        : student
    ));
  };

  const handleSave = () => {
    showNotification('Marks saved successfully');
  };

  const loadStudentData = () => {
    if (!semester) {
      showNotification('Please select a semester', 'warning');
      return;
    }
    
    // Sample data - replace with actual API call
    const sampleStudents = [
      { id: 1, rollNo: 'CS001', name: 'John Doe', marks: { MTH101: 75, PHY101: 68, CHM101: 35, ENG101: 82, CSE101: 90 } },
      { id: 2, rollNo: 'CS002', name: 'Jane Smith', marks: { MTH101: 88, PHY101: 92, CHM101: 78, ENG101: 85, CSE101: 95 } },
      { id: 3, rollNo: 'CS003', name: 'Bob Wilson', marks: { MTH101: 32, PHY101: 38, CHM101: 28, ENG101: 45, CSE101: 52 } },
      { id: 4, rollNo: 'CS004', name: 'Alice Brown', marks: { MTH101: 65, PHY101: 58, CHM101: 62, ENG101: 70, CSE101: 38 } },
      { id: 5, rollNo: 'CS005', name: 'Charlie Davis', marks: { MTH101: 42, PHY101: 55, CHM101: 48, ENG101: 39, CSE101: 60 } },
      { id: 6, rollNo: 'CS006', name: 'Diana Evans', marks: { MTH101: 95, PHY101: 88, CHM101: 92, ENG101: 90, CSE101: 98 } },
    ];
    
    setMarksData(sampleStudents);
    showNotification(`Loaded ${sampleStudents.length} students for Semester ${semester}`);
  };

  const calculateTotal = (marks) => {
    return Object.values(marks).reduce((sum, mark) => sum + (mark || 0), 0);
  };

  const calculatePercentage = (marks) => {
    const total = calculateTotal(marks);
    const maxTotal = subjects.length * 100;
    return ((total / maxTotal) * 100).toFixed(1);
  };

  const getOverallStatus = (marks) => {
    const failedSubjects = subjects.filter(sub => isFailingMarks(marks[sub.code] || 0, sub.passingMarks));
    return failedSubjects.length === 0 ? 'Pass' : 'Fail';
  };

  const filteredData = marksData.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportData = () => {
    const exportRows = marksData.map(student => {
      const row = { 'Roll No': student.rollNo, 'Name': student.name };
      subjects.forEach(sub => {
        row[sub.name] = student.marks[sub.code] || 0;
      });
      row['Total'] = calculateTotal(student.marks);
      row['Percentage'] = calculatePercentage(student.marks) + '%';
      row['Status'] = getOverallStatus(student.marks);
      return row;
    });
    exportToExcel(exportRows, `marks_semester_${semester}`);
    showNotification('Marks exported successfully');
  };

  return (
    <div>
      <PageHeader title="Marks Evaluation" subtitle="View and edit student marks by semester (fail marks highlighted in red)" />
      
      {/* Controls */}
      <div className="card mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
            <select 
              className="input-field" 
              value={semester} 
              onChange={(e) => setSemester(e.target.value)}
            >
              <option value="">Select Semester</option>
              {[1, 2, 3, 4, 5, 6].map(s => (
                <option key={s} value={s}>Semester {s}</option>
              ))}
            </select>
          </div>
          
          <div className="flex-1 min-w-[250px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Student</label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                className="input-field pl-10" 
                placeholder="Search by name or roll no..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={loadStudentData} 
              className="btn-primary"
            >
              Load Students
            </button>
            <button 
              onClick={handleSave} 
              disabled={!marksData.length} 
              className="btn-primary flex items-center gap-2"
            >
              <FiSave size={18} /> Save
            </button>
            <button 
              onClick={exportData} 
              disabled={!marksData.length} 
              className="btn-secondary flex items-center gap-2"
            >
              <FiDownload size={18} /> Export
            </button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-4 text-sm">
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 bg-green-100 border border-green-300 rounded"></span> Pass (≥40)
        </span>
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 bg-red-100 border border-red-300 rounded"></span> Fail (&lt;40)
        </span>
        <span className="text-gray-500">* Double-click on marks to edit</span>
      </div>

      {/* Marks Table */}
      <div className="card overflow-x-auto">
        {marksData.length > 0 ? (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Roll No</th>
                <th className="px-3 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Student Name</th>
                {subjects.map(sub => (
                  <th key={sub.code} className="px-3 py-3 text-center font-semibold text-gray-600 whitespace-nowrap">
                    <div>{sub.name}</div>
                    <div className="text-xs font-normal text-gray-400">({sub.code})</div>
                  </th>
                ))}
                <th className="px-3 py-3 text-center font-semibold text-gray-600 whitespace-nowrap bg-gray-100">Total</th>
                <th className="px-3 py-3 text-center font-semibold text-gray-600 whitespace-nowrap bg-gray-100">%</th>
                <th className="px-3 py-3 text-center font-semibold text-gray-600 whitespace-nowrap bg-gray-100">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.map((student) => {
                const total = calculateTotal(student.marks);
                const percentage = calculatePercentage(student.marks);
                const status = getOverallStatus(student.marks);
                
                return (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-3 py-3 font-medium text-gray-800">{student.rollNo}</td>
                    <td className="px-3 py-3 text-gray-700">{student.name}</td>
                    
                    {subjects.map(sub => {
                      const marks = student.marks[sub.code] || 0;
                      const isFailing = isFailingMarks(marks, sub.passingMarks);
                      const isEditing = editingCell?.studentId === student.id && editingCell?.subjectCode === sub.code;
                      
                      return (
                        <td 
                          key={sub.code} 
                          className={`px-3 py-3 text-center cursor-pointer transition-colors ${
                            isFailing 
                              ? 'bg-red-100 text-red-700 font-bold' 
                              : 'bg-green-50 text-green-700'
                          }`}
                          onDoubleClick={() => setEditingCell({ studentId: student.id, subjectCode: sub.code })}
                        >
                          {isEditing ? (
                            <input 
                              type="number" 
                              min="0"
                              max={sub.maxMarks}
                              className="w-16 px-2 py-1 border rounded text-center focus:outline-none focus:ring-2 focus:ring-primary-500" 
                              value={marks} 
                              onChange={(e) => handleCellEdit(student.id, sub.code, e.target.value)} 
                              onBlur={() => setEditingCell(null)} 
                              onKeyDown={(e) => e.key === 'Enter' && setEditingCell(null)} 
                              autoFocus 
                            />
                          ) : (
                            <span className={isFailing ? 'underline decoration-2' : ''}>
                              {marks}
                            </span>
                          )}
                        </td>
                      );
                    })}
                    
                    <td className="px-3 py-3 text-center font-bold text-gray-800 bg-gray-50">{total}</td>
                    <td className="px-3 py-3 text-center font-medium text-gray-700 bg-gray-50">{percentage}%</td>
                    <td className="px-3 py-3 text-center bg-gray-50">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        status === 'Pass' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-16 text-gray-500">
            <FiSearch size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg">Select a semester and click "Load Students"</p>
            <p className="text-sm mt-2">Student marks will appear here with subject-wise breakdown</p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {marksData.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="card text-center">
            <div className="text-3xl font-bold text-gray-800">{marksData.length}</div>
            <div className="text-sm text-gray-500">Total Students</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-green-600">
              {marksData.filter(s => getOverallStatus(s.marks) === 'Pass').length}
            </div>
            <div className="text-sm text-gray-500">Passed</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-red-600">
              {marksData.filter(s => getOverallStatus(s.marks) === 'Fail').length}
            </div>
            <div className="text-sm text-gray-500">Failed</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary-600">
              {(marksData.filter(s => getOverallStatus(s.marks) === 'Pass').length / marksData.length * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-500">Pass Rate</div>
          </div>
        </div>
      )}
    </div>
  );
}