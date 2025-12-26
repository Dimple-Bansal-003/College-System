import React, { useState, useMemo } from 'react';
import Card from '../ui/Card.jsx';
import Badge from '../ui/Badge.jsx';
import Select from '../ui/Select.jsx';
import ConfirmDialog from '../ui/ConfirmDialog.jsx';
import { useApp } from '../../contexts/AppContext.jsx';
import { useToast } from '../../contexts/ToastContext.jsx';
import { getSampleMarks } from '../../data/sampleData';
import { COURSES, SEMESTERS } from '../../utils/constants.jsx';
import { Table, Trash2, Search, Info, Download, Filter } from 'lucide-react';

function StudentMarks() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterSemester, setFilterSemester] = useState('');
  const [sortBy, setSortBy] = useState('student_name');
  const [sortOrder, setSortOrder] = useState('asc');

  const { studentMarks, deleteConfirmId, setDeleteConfirm, deleteMarks } = useApp();
  const { showToast } = useToast();

  // Use sample data if no real data exists
  const displayMarks = studentMarks.length > 0 ? studentMarks : getSampleMarks();
  const showingSample = studentMarks.length === 0;

  // Filter and sort marks
  const filteredMarks = useMemo(() => {
    let result = [...displayMarks];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (m) =>
          m.student_id?.toLowerCase().includes(term) ||
          m.student_name?.toLowerCase().includes(term) ||
          m.course?.toLowerCase().includes(term)
      );
    }

    // Apply course filter
    if (filterCourse) {
      result = result.filter((m) => m.course === filterCourse);
    }

    // Apply semester filter
    if (filterSemester) {
      result = result.filter((m) => m.semester === filterSemester);
    }

    // Apply sorting
    result.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      // Handle numeric sorting for percentage and total_marks
      if (sortBy === 'percentage' || sortBy === 'total_marks') {
        aVal = Number(aVal) || 0;
        bVal = Number(bVal) || 0;
      } else {
        aVal = String(aVal || '').toLowerCase();
        bVal = String(bVal || '').toLowerCase();
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [displayMarks, searchTerm, filterCourse, filterSemester, sortBy, sortOrder]);

  // Get unique field headers from all marks
  const getFieldHeaders = () => {
    const headers = [];
    for (let i = 1; i <= 10; i++) {
      const hasField = displayMarks.some(
        (m) => m[`field${i}_name`] || m[`field${i}_marks`] !== undefined
      );
      if (hasField) {
        // Find a record that has this field to get the name
        const recordWithField = displayMarks.find((m) => m[`field${i}_name`]);
        const name = recordWithField?.[`field${i}_name`] || `Field ${i}`;
        const max = recordWithField?.[`field${i}_max`] || 0;
        headers.push({ index: i, name, max });
      }
    }
    return headers;
  };

  const fieldHeaders = getFieldHeaders();

  // Handle delete action
  const handleDelete = (id) => {
    deleteMarks(id);
    showToast('Student record deleted successfully');
  };

  // Handle sort column click
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Get grade badge variant based on grade
  const getGradeBadgeVariant = (grade) => {
    if (grade === 'A+' || grade === 'A') return 'success';
    if (grade === 'B+' || grade === 'B') return 'info';
    if (grade === 'C' || grade === 'D') return 'warning';
    if (grade === 'F') return 'danger';
    return 'default';
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setFilterCourse('');
    setFilterSemester('');
    setSortBy('student_name');
    setSortOrder('asc');
  };

  // Check if any filters are active
  const hasActiveFilters = searchTerm || filterCourse || filterSemester;

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    if (filteredMarks.length === 0) return null;

    const totalStudents = filteredMarks.length;
    const passed = filteredMarks.filter((m) => m.percentage >= 40).length;
    const avgPercentage = Math.round(
      filteredMarks.reduce((sum, m) => sum + (m.percentage || 0), 0) / totalStudents
    );

    return { totalStudents, passed, failed: totalStudents - passed, avgPercentage };
  }, [filteredMarks]);

  return (
    <div className="space-y-6">
      {/* Filters Card */}
      <Card>
        <Card.Header>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <Card.Title icon={Filter}>Filters & Search</Card.Title>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                className="input-field pl-10"
                placeholder="Search by name, ID, or course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Course Filter */}
            <Select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              options={COURSES}
              placeholder="All Courses"
            />

            {/* Semester Filter */}
            <Select
              value={filterSemester}
              onChange={(e) => setFilterSemester(e.target.value)}
              options={SEMESTERS}
              placeholder="All Semesters"
            />

            {/* Sort By */}
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={[
                { value: 'student_name', label: 'Sort by Name' },
                { value: 'student_id', label: 'Sort by ID' },
                { value: 'percentage', label: 'Sort by Percentage' },
                { value: 'total_marks', label: 'Sort by Total Marks' },
                { value: 'course', label: 'Sort by Course' },
              ]}
              placeholder="Sort By"
            />
          </div>
        </Card.Content>
      </Card>

      {/* Summary Stats */}
      {summaryStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{summaryStats.totalStudents}</p>
            <p className="text-sm text-blue-600/70">Total Students</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{summaryStats.passed}</p>
            <p className="text-sm text-green-600/70">Passed</p>
          </div>
          <div className="bg-red-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{summaryStats.failed}</p>
            <p className="text-sm text-red-600/70">Failed</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">{summaryStats.avgPercentage}%</p>
            <p className="text-sm text-purple-600/70">Average</p>
          </div>
        </div>
      )}

      {/* Main Table Card */}
      <Card>
        <Card.Header>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <Card.Title icon={Table}>
              Student Marks Table
              {filteredMarks.length !== displayMarks.length && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  (Showing {filteredMarks.length} of {displayMarks.length})
                </span>
              )}
            </Card.Title>
            <button
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 bg-gray-100 px-3 py-2 rounded-lg transition-colors"
              onClick={() => showToast('Export feature coming soon!', 'info')}
            >
              <Download size={16} />
              Export
            </button>
          </div>
        </Card.Header>

        <Card.Content>
          {/* Sample Data Notice */}
          {showingSample && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 flex items-center gap-2">
              <Info className="text-amber-600 flex-shrink-0" size={20} />
              <p className="text-sm text-amber-700">
                Showing sample data for demonstration. Add your own student marks via the{' '}
                <strong>Marks Entry</strong> page to replace these.
              </p>
            </div>
          )}

          {/* Table */}
          {filteredMarks.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th
                      className="p-4 font-semibold text-gray-600 rounded-tl-lg cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('student_id')}
                    >
                      <div className="flex items-center gap-1">
                        Student ID
                        {sortBy === 'student_id' && (
                          <span className="text-blue-600">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th
                      className="p-4 font-semibold text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('student_name')}
                    >
                      <div className="flex items-center gap-1">
                        Student Name
                        {sortBy === 'student_name' && (
                          <span className="text-blue-600">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th
                      className="p-4 font-semibold text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('course')}
                    >
                      <div className="flex items-center gap-1">
                        Course
                        {sortBy === 'course' && (
                          <span className="text-blue-600">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th className="p-4 font-semibold text-gray-600">Semester</th>

                    {/* Dynamic Field Headers */}
                    {fieldHeaders.map((header) => (
                      <th
                        key={header.index}
                        className="p-4 font-semibold text-gray-600 text-center"
                      >
                        <div>
                          {header.name}
                          <br />
                          <span className="text-xs font-normal text-gray-400">
                            (Max: {header.max})
                          </span>
                        </div>
                      </th>
                    ))}

                    <th
                      className="p-4 font-semibold text-gray-600 text-center cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('total_marks')}
                    >
                      <div className="flex items-center justify-center gap-1">
                        Total
                        {sortBy === 'total_marks' && (
                          <span className="text-blue-600">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th
                      className="p-4 font-semibold text-gray-600 text-center cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('percentage')}
                    >
                      <div className="flex items-center justify-center gap-1">
                        %
                        {sortBy === 'percentage' && (
                          <span className="text-blue-600">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th className="p-4 font-semibold text-gray-600 text-center">Grade</th>
                    <th className="p-4 font-semibold text-gray-600 text-center">Status</th>
                    <th className="p-4 font-semibold text-gray-600 text-center rounded-tr-lg">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMarks.map((m) => (
                    <tr
                      key={m.id}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        m.isSample ? 'bg-amber-50/50' : ''
                      }`}
                    >
                      <td className="p-4 font-mono text-sm">{m.student_id}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{m.student_name}</span>
                          {m.isSample && (
                            <Badge variant="sample" className="text-xs">
                              Sample
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="info">{m.course}</Badge>
                      </td>
                      <td className="p-4 text-gray-600">{m.semester}</td>

                      {/* Dynamic Field Marks */}
                      {fieldHeaders.map((header) => (
                        <td key={header.index} className="p-4 text-center">
                          <span
                            className={`font-medium ${
                              m[`field${header.index}_marks`] !== undefined
                                ? m[`field${header.index}_marks`] >=
                                  m[`field${header.index}_max`] * 0.4
                                  ? 'text-green-600'
                                  : 'text-red-600'
                                : 'text-gray-400'
                            }`}
                          >
                            {m[`field${header.index}_marks`] !== undefined
                              ? m[`field${header.index}_marks`]
                              : '-'}
                          </span>
                        </td>
                      ))}

                      <td className="p-4 text-center">
                        <span className="font-semibold text-gray-800">
                          {m.total_marks || 0}
                          <span className="text-gray-400 font-normal">
                            /{m.total_max || 100}
                          </span>
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`font-bold text-lg ${
                            m.percentage >= 60
                              ? 'text-green-600'
                              : m.percentage >= 40
                              ? 'text-yellow-600'
                              : 'text-red-600'
                          }`}
                        >
                          {m.percentage || 0}%
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <Badge variant={getGradeBadgeVariant(m.grade)} className="text-sm px-3 py-1">
                          {m.grade}
                        </Badge>
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                            m.percentage >= 40
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {m.percentage >= 40 ? '✓ Pass' : '✗ Fail'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {m.isSample ? (
                          <span className="text-gray-400 text-xs italic">Demo only</span>
                        ) : deleteConfirmId === m.id ? (
                          <ConfirmDialog
                            onConfirm={() => handleDelete(m.id)}
                            onCancel={() => setDeleteConfirm(null)}
                          />
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(m.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                            title="Delete record"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Table className="mx-auto text-gray-300 mb-4" size={64} />
              <p className="text-gray-500 text-lg mb-2">No records found</p>
              <p className="text-gray-400 text-sm">
                {hasActiveFilters
                  ? 'Try adjusting your filters or search term'
                  : 'Go to Marks Entry to add student records'}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </Card.Content>
      </Card>
    </div>
  );
}

export default StudentMarks;