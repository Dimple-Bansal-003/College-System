import { useState } from 'react';
import { FiFileText, FiDownload } from 'react-icons/fi';
import PageHeader from '../common/PageHeader';
import { useApp } from '../../context/AppContext';

export default function ReportGeneration() {
  const { showNotification } = useApp();
  const [reportType, setReportType] = useState('');
  const [semester, setSemester] = useState('');

  const reportTypes = [
    { id: 'student-list', name: 'Student List', desc: 'List of all students by semester' },
    { id: 'marks-report', name: 'Marks Report', desc: 'Subject-wise marks report' },
    { id: 'result-sheet', name: 'Result Sheet', desc: 'Complete result with pass/fail status' },
    { id: 'gracing-report', name: 'Gracing Report', desc: 'Students who received gracing' },
    { id: 'faculty-subjects', name: 'Faculty Subjects', desc: 'Faculty-subject mapping' },
  ];

  const handleGenerate = () => { if (!reportType || !semester) { showNotification('Select report type and semester', 'warning'); return; } showNotification('Report generated! (Demo)'); };

  return (
    <div>
      <PageHeader title="Generate Reports" subtitle="Generate and download various reports" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Report Configuration</h3>
          <div className="mb-4"><label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label><select className="input-field" value={reportType} onChange={(e) => setReportType(e.target.value)}><option value="">Select Report</option>{reportTypes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}</select></div>
          <div className="mb-6"><label className="block text-sm font-medium text-gray-700 mb-1">Semester</label><select className="input-field" value={semester} onChange={(e) => setSemester(e.target.value)}><option value="">Select Semester</option>{[1,2,3,4,5,6].map(s => <option key={s} value={s}>Semester {s}</option>)}</select></div>
          <button onClick={handleGenerate} disabled={!reportType || !semester} className="btn-primary w-full flex items-center justify-center gap-2"><FiDownload /> Generate Report</button>
        </div>
        <div className="lg:col-span-2 card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Available Reports</h3>
          <div className="space-y-3">{reportTypes.map(r => (<div key={r.id} className={`p-4 border rounded-lg cursor-pointer transition-colors ${reportType === r.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:bg-gray-50'}`} onClick={() => setReportType(r.id)}><div className="flex items-center gap-3"><FiFileText className="text-primary-600" size={20} /><div><h4 className="font-medium text-gray-800">{r.name}</h4><p className="text-sm text-gray-500">{r.desc}</p></div></div></div>))}</div>
        </div>
      </div>
    </div>
  );
}