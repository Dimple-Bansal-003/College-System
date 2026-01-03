import React, { useState } from 'react';
import Card from '../ui/Card';
import Select from '../ui/Select';
import { useApp } from '../../contexts/AppContext';
import { getSampleMarks } from '../../data/sampleData';
import { Eye, Info, GraduationCap } from 'lucide-react';

function ResultsPreview() {
  const [selectedStudent, setSelectedStudent] = useState('');
  const { studentMarks } = useApp();

  const displayMarks = studentMarks.length > 0 ? studentMarks : getSampleMarks();
  const showingSample = studentMarks.length === 0;

  const studentOptions = displayMarks.map((m) => ({ value: m.id, label: `${m.student_name} (${m.student_id})${m.isSample ? ' - Sample' : ''}` }));
  const selectedStudentData = displayMarks.find((m) => m.id === selectedStudent);

  return (
    <div className="space-y-6">
      <Card>
        <Card.Header><Card.Title icon={Eye}>Results Preview</Card.Title></Card.Header>
        <Card.Content>
          <p className="text-gray-500 mb-6">Preview how results will appear to students</p>
          {showingSample && <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 flex items-center gap-2"><Info className="text-amber-600" size={20} /><p className="text-sm text-amber-700">Showing sample students.</p></div>}
          <Select label="Select Student" value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} options={studentOptions} placeholder="Select a student..." className="max-w-md" />
        </Card.Content>
      </Card>
      {selectedStudentData && (
        <Card padding="p-0" className="overflow-hidden">
          <div className="bg-gradient-to-br from-primary to-secondary p-6">
            <div className="flex items-center justify-between">
              <div className="text-white"><div className="flex items-center gap-2 mb-2"><GraduationCap size={28} /><h3 className="text-2xl font-bold">University Examination Result</h3></div><p className="text-blue-200">Academic Year 2024</p></div>
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center"><span className="text-4xl font-bold text-primary">{selectedStudentData.grade}</span></div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div><p className="text-gray-500 text-sm">Student Name</p><p className="text-xl font-semibold">{selectedStudentData.student_name}</p></div>
              <div><p className="text-gray-500 text-sm">Student ID</p><p className="text-xl font-mono">{selectedStudentData.student_id}</p></div>
              <div><p className="text-gray-500 text-sm">Course</p><p className="font-medium">{selectedStudentData.course}</p></div>
              <div><p className="text-gray-500 text-sm">Semester</p><p className="font-medium">{selectedStudentData.semester}</p></div>
            </div>
            <div className="border-t border-gray-100 pt-6">
              <h4 className="font-semibold mb-4">Marks Breakdown</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[1, 2, 3].map((i) => {
                  const fieldName = selectedStudentData[`field${i}_name`];
                  const fieldMarks = selectedStudentData[`field${i}_marks`];
                  const fieldMax = selectedStudentData[`field${i}_max`];
                  if (!fieldName) return null;
                  const colors = ['blue', 'green', 'purple'];
                  const color = colors[(i - 1) % 3];
                  return <div key={i} className={`rounded-xl p-4 text-center ${color === 'blue' ? 'bg-blue-50' : color === 'green' ? 'bg-green-50' : 'bg-purple-50'}`}><p className={`text-3xl font-bold ${color === 'blue' ? 'text-blue-600' : color === 'green' ? 'text-green-600' : 'text-purple-600'}`}>{fieldMarks}</p><p className="text-sm text-gray-500">{fieldName} ({fieldMax})</p></div>;
                })}
                <div className="bg-gray-100 rounded-xl p-4 text-center"><p className="text-3xl font-bold text-gray-800">{selectedStudentData.total_marks}</p><p className="text-sm text-gray-500">Total ({selectedStudentData.total_max || 100})</p></div>
              </div>
              <div className={`flex items-center justify-between p-4 rounded-xl ${selectedStudentData.percentage >= 40 ? 'bg-green-50' : 'bg-red-50'}`}>
                <span className={`font-medium ${selectedStudentData.percentage >= 40 ? 'text-green-700' : 'text-red-700'}`}>Result Status</span>
                <span className={`text-lg font-bold ${selectedStudentData.percentage >= 40 ? 'text-green-600' : 'text-red-600'}`}>{selectedStudentData.percentage >= 40 ? 'PASSED ✓' : 'FAILED ✗'}</span>
              </div>
              <div className="mt-4">
                <div className="flex justify-between mb-2"><span className="text-gray-600">Overall Percentage</span><span className="font-bold text-purple-600">{selectedStudentData.percentage}%</span></div>
                <div className="w-full bg-gray-200 rounded-full h-3"><div className={`h-3 rounded-full ${selectedStudentData.percentage >= 40 ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${selectedStudentData.percentage}%` }} /></div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

export default ResultsPreview;