import { useState, useRef } from 'react';
import { FiUpload, FiDownload, FiSave, FiCheck } from 'react-icons/fi';
import PageHeader from '../common/PageHeader';
import { useApp } from '../../context/AppContext';
import { parseExcelFile, exportToExcel, generateUniqueId, generateUsername, generatePassword, formatAcademicYear } from '../../utils/helpers';

export default function StudentManagement() {
  const { showNotification } = useApp();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [enrollmentYear, setEnrollmentYear] = useState('');
  const [semester, setSemester] = useState('');
  const [parsedStudents, setParsedStudents] = useState([]);
  const [saved, setSaved] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!enrollmentYear || !semester) { showNotification('Please select enrollment year and semester first', 'error'); return; }
    setLoading(true); setSaved(false);
    try {
      const data = await parseExcelFile(file);
      const studentsWithCredentials = data.map((row) => {
        const id = generateUniqueId('STU');
        const name = row.name || row.Name || '';
        return { id, rollNo: row.rollNo || row.RollNo || row['Roll No'] || '', name, email: row.email || row.Email || '', phone: row.phone || row.Phone || '', username: generateUsername(name, id), password: generatePassword(), enrollmentYear: parseInt(enrollmentYear), semester: parseInt(semester), academicYear: formatAcademicYear(parseInt(enrollmentYear)), status: 'Active' };
      });
      setParsedStudents(studentsWithCredentials);
      showNotification(`${studentsWithCredentials.length} students parsed successfully`);
    } catch (error) { showNotification('Failed to parse Excel file', 'error'); }
    finally { setLoading(false); }
  };

  const handleSave = () => { setSaved(true); showNotification('Students saved successfully'); };
  const handleDownloadTemplate = () => { exportToExcel([{ rollNo: 'CS001', name: 'John Doe', email: 'john@example.com', phone: '9876543210' }], 'student_template'); showNotification('Template downloaded'); };
  const handleDownloadCredentials = () => { exportToExcel(parsedStudents.map(s => ({ RollNo: s.rollNo, Name: s.name, Username: s.username, Password: s.password })), `credentials_${enrollmentYear}_sem${semester}`); showNotification('Credentials downloaded'); };

  return (
    <div>
      <PageHeader title="Add Students" subtitle="Upload student data using Excel sheet (semester-wise)" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload Configuration</h3>
          <div className="mb-4"><label className="block text-sm font-medium text-gray-700 mb-1">Enrollment Year</label><select className="input-field" value={enrollmentYear} onChange={(e) => setEnrollmentYear(e.target.value)}><option value="">Select Year</option>{years.map(y => <option key={y} value={y}>{y}</option>)}</select></div>
          <div className="mb-6"><label className="block text-sm font-medium text-gray-700 mb-1">Semester</label><select className="input-field" value={semester} onChange={(e) => setSemester(e.target.value)}><option value="">Select Semester</option>{[1,2,3,4,5,6].map(s => <option key={s} value={s}>Semester {s}</option>)}</select></div>
          <input ref={fileInputRef} type="file" accept=".xlsx,.xls" onChange={handleFileUpload} className="hidden" />
          <button onClick={() => fileInputRef.current?.click()} disabled={!enrollmentYear || !semester || loading} className="btn-primary w-full flex items-center justify-center gap-2 mb-3"><FiUpload size={18} /> {loading ? 'Processing...' : 'Upload Excel'}</button>
          <button onClick={handleDownloadTemplate} className="btn-secondary w-full flex items-center justify-center gap-2"><FiDownload size={18} /> Download Template</button>
        </div>
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Student Preview {parsedStudents.length > 0 && <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">{parsedStudents.length} students</span>}</h3>
            {parsedStudents.length > 0 && <div className="flex gap-2"><button onClick={handleDownloadCredentials} className="btn-secondary flex items-center gap-2 text-sm"><FiDownload size={16} /> Credentials</button><button onClick={handleSave} disabled={saved} className={`flex items-center gap-2 text-sm ${saved ? 'bg-green-600 text-white px-4 py-2 rounded-lg' : 'btn-primary'}`}>{saved ? <><FiCheck size={16} /> Saved</> : <><FiSave size={16} /> Save</>}</button></div>}
          </div>
          {parsedStudents.length > 0 ? (
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-sm"><thead className="bg-gray-50 sticky top-0"><tr><th className="px-3 py-2 text-left font-medium text-gray-600">Roll No</th><th className="px-3 py-2 text-left font-medium text-gray-600">Name</th><th className="px-3 py-2 text-left font-medium text-gray-600">Email</th><th className="px-3 py-2 text-left font-medium text-gray-600">Username</th><th className="px-3 py-2 text-left font-medium text-gray-600">Password</th></tr></thead>
              <tbody className="divide-y divide-gray-200">{parsedStudents.map((s) => (<tr key={s.id}><td className="px-3 py-2">{s.rollNo}</td><td className="px-3 py-2">{s.name}</td><td className="px-3 py-2">{s.email}</td><td className="px-3 py-2"><code className="text-xs bg-gray-100 px-1 rounded">{s.username}</code></td><td className="px-3 py-2"><code className="text-xs bg-gray-100 px-1 rounded">{s.password}</code></td></tr>))}</tbody></table>
            </div>
          ) : <div className="text-center py-12 text-gray-500"><FiUpload size={48} className="mx-auto mb-3 text-gray-300" /><p>Upload an Excel file to preview students</p><p className="text-sm">System will generate unique IDs, usernames & passwords</p></div>}
        </div>
      </div>
    </div>
  );
}