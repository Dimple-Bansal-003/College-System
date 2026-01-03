import { useState } from 'react';
import { FiFilter, FiDownload, FiUser, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import PageHeader from '../common/PageHeader';
import { useApp } from '../../context/AppContext';
import { exportToExcel } from '../../utils/helpers';

export default function ViewStudents() {
  const { showNotification } = useApp();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState('');
  const [expandedStudent, setExpandedStudent] = useState(null);

  const currentYear = new Date().getFullYear();
  const enrollmentYears = [
    { value: currentYear, label: `${currentYear} (1st Year)` },
    { value: currentYear - 1, label: `${currentYear - 1} (2nd Year)` },
    { value: currentYear - 2, label: `${currentYear - 2} (3rd Year)` },
  ];

  const getSemestersForEnrollmentYear = (enrollYear) => {
    const yearsCompleted = currentYear - enrollYear;
    const currentSemester = Math.min((yearsCompleted * 2) + 2, 6);
    return Array.from({ length: currentSemester }, (_, i) => i + 1);
  };

  const fetchStudents = () => {
    if (!selectedYear) {
      showNotification('Please select enrollment year', 'warning');
      return;
    }
    setLoading(true);
    
    // Sample data - replace with actual API call
    setTimeout(() => {
      const sampleStudents = [
        { 
          id: 1, 
          rollNo: 'CS001', 
          name: 'John Doe', 
          email: 'john@example.com', 
          phone: '9876543210',
          enrollmentYear: parseInt(selectedYear),
          semesters: {
            1: { status: 'Completed', sgpa: 8.5, result: 'Pass' },
            2: { status: 'Completed', sgpa: 8.2, result: 'Pass' },
            3: { status: 'Completed', sgpa: 7.9, result: 'Pass' },
            4: { status: 'Current', sgpa: null, result: 'Pending' },
          }
        },
        { 
          id: 2, 
          rollNo: 'CS002', 
          name: 'Jane Smith', 
          email: 'jane@example.com', 
          phone: '9876543211',
          enrollmentYear: parseInt(selectedYear),
          semesters: {
            1: { status: 'Completed', sgpa: 9.2, result: 'Pass' },
            2: { status: 'Completed', sgpa: 9.0, result: 'Pass' },
            3: { status: 'Completed', sgpa: 8.8, result: 'Pass' },
            4: { status: 'Current', sgpa: null, result: 'Pending' },
          }
        },
        { 
          id: 3, 
          rollNo: 'CS003', 
          name: 'Bob Wilson', 
          email: 'bob@example.com', 
          phone: '9876543212',
          enrollmentYear: parseInt(selectedYear),
          semesters: {
            1: { status: 'Completed', sgpa: 6.5, result: 'Pass' },
            2: { status: 'Completed', sgpa: 5.8, result: 'Fail' },
            3: { status: 'Completed', sgpa: 6.2, result: 'Pass' },
            4: { status: 'Current', sgpa: null, result: 'Pending' },
          }
        },
        { 
          id: 4, 
          rollNo: 'CS004', 
          name: 'Alice Brown', 
          email: 'alice@example.com', 
          phone: '9876543213',
          enrollmentYear: parseInt(selectedYear),
          semesters: {
            1: { status: 'Completed', sgpa: 7.8, result: 'Pass' },
            2: { status: 'Completed', sgpa: 8.1, result: 'Pass' },
            3: { status: 'Completed', sgpa: 7.5, result: 'Pass' },
            4: { status: 'Current', sgpa: null, result: 'Pending' },
          }
        },
      ];
      setStudents(sampleStudents);
      setLoading(false);
      showNotification(`Loaded ${sampleStudents.length} students`);
    }, 500);
  };

  const toggleStudentExpand = (studentId) => {
    setExpandedStudent(expandedStudent === studentId ? null : studentId);
  };

  const getResultBadge = (result) => {
    const styles = {
      'Pass': 'bg-green-100 text-green-700',
      'Fail': 'bg-red-100 text-red-700',
      'Pending': 'bg-yellow-100 text-yellow-700',
    };
    return styles[result] || 'bg-gray-100 text-gray-700';
  };

  const getStatusBadge = (status) => {
    const styles = {
      'Completed': 'bg-blue-100 text-blue-700',
      'Current': 'bg-purple-100 text-purple-700',
      'Upcoming': 'bg-gray-100 text-gray-500',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const calculateCGPA = (semesters) => {
    const completedSems = Object.values(semesters).filter(s => s.sgpa !== null);
    if (completedSems.length === 0) return '-';
    const total = completedSems.reduce((sum, s) => sum + s.sgpa, 0);
    return (total / completedSems.length).toFixed(2);
  };

  const handleExport = () => {
    const exportData = students.map(s => ({
      'Roll No': s.rollNo,
      'Name': s.name,
      'Email': s.email,
      'Phone': s.phone,
      'Enrollment Year': s.enrollmentYear,
      'CGPA': calculateCGPA(s.semesters),
    }));
    exportToExcel(exportData, `students_${selectedYear}`);
    showNotification('Students exported');
  };

  const availableSemesters = selectedYear ? getSemestersForEnrollmentYear(parseInt(selectedYear)) : [];

  return (
    <div>
      <PageHeader title="View Students" subtitle="View students by enrollment year with semester-wise details" />
      
      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[250px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment Year</label>
            <select 
              className="input-field" 
              value={selectedYear} 
              onChange={(e) => { setSelectedYear(e.target.value); setStudents([]); setExpandedStudent(null); }}
            >
              <option value="">Select Enrollment Year</option>
              {enrollmentYears.map(y => (
                <option key={y.value} value={y.value}>{y.label}</option>
              ))}
            </select>
          </div>
          
          <div className="flex gap-2">
            <button onClick={fetchStudents} className="btn-primary flex items-center gap-2">
              <FiFilter size={18} /> Load Students
            </button>
            <button 
              onClick={handleExport} 
              disabled={!students.length} 
              className="btn-secondary flex items-center gap-2"
            >
              <FiDownload size={18} /> Export
            </button>
          </div>
        </div>
      </div>

      {/* Semester Legend */}
      {selectedYear && (
        <div className="flex flex-wrap gap-3 mb-4 text-sm">
          <span className="text-gray-600 font-medium">Semesters for {selectedYear} batch:</span>
          {availableSemesters.map(sem => (
            <span key={sem} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full">
              Sem {sem}
            </span>
          ))}
        </div>
      )}

      {/* Students List */}
      <div className="space-y-4">
        {loading ? (
          <div className="card flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : students.length > 0 ? (
          students.map(student => (
            <div key={student.id} className="card p-0 overflow-hidden">
              {/* Student Header */}
              <div 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleStudentExpand(student.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <FiUser className="text-primary-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{student.name}</h3>
                    <p className="text-sm text-gray-500">{student.rollNo} • {student.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <div className="text-sm text-gray-500">CGPA</div>
                    <div className="font-bold text-primary-600">{calculateCGPA(student.semesters)}</div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <div className="text-sm text-gray-500">Phone</div>
                    <div className="font-medium text-gray-700">{student.phone}</div>
                  </div>
                  {expandedStudent === student.id ? (
                    <FiChevronDown className="text-gray-400" size={20} />
                  ) : (
                    <FiChevronRight className="text-gray-400" size={20} />
                  )}
                </div>
              </div>
              
              {/* Semester Details (Expanded) */}
              {expandedStudent === student.id && (
                <div className="border-t border-gray-200 bg-gray-50 p-4">
                  <h4 className="font-medium text-gray-700 mb-3">Semester-wise Performance</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {availableSemesters.map(sem => {
                      const semData = student.semesters[sem] || { status: 'Upcoming', sgpa: null, result: 'Pending' };
                      return (
                        <div 
                          key={sem} 
                          className={`p-3 rounded-lg border ${
                            semData.status === 'Current' 
                              ? 'border-purple-300 bg-purple-50' 
                              : semData.status === 'Completed'
                                ? 'border-gray-200 bg-white'
                                : 'border-gray-200 bg-gray-100'
                          }`}
                        >
                          <div className="text-xs font-medium text-gray-500 mb-1">Semester {sem}</div>
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadge(semData.status)}`}>
                              {semData.status}
                            </span>
                          </div>
                          {semData.sgpa !== null ? (
                            <>
                              <div className="text-xl font-bold text-gray-800">{semData.sgpa}</div>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${getResultBadge(semData.result)}`}>
                                {semData.result}
                              </span>
                            </>
                          ) : (
                            <div className="text-sm text-gray-400">-</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="card text-center py-12 text-gray-500">
            <FiUser size={48} className="mx-auto mb-4 text-gray-300" />
            <p>Select enrollment year and click "Load Students"</p>
            <p className="text-sm mt-2">Student details with semester-wise results will appear here</p>
          </div>
        )}
      </div>

      {/* Summary */}
      {students.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="card text-center">
            <div className="text-3xl font-bold text-gray-800">{students.length}</div>
            <div className="text-sm text-gray-500">Total Students</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-green-600">
              {students.filter(s => !Object.values(s.semesters).some(sem => sem.result === 'Fail')).length}
            </div>
            <div className="text-sm text-gray-500">All Clear</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-red-600">
              {students.filter(s => Object.values(s.semesters).some(sem => sem.result === 'Fail')).length}
            </div>
            <div className="text-sm text-gray-500">With Backlogs</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary-600">{availableSemesters.length}</div>
            <div className="text-sm text-gray-500">Semesters</div>
          </div>
        </div>
      )}
    </div>
  );
}