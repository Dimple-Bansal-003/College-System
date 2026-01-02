import { useState, useRef } from 'react';
import { FiUpload, FiDownload, FiSave } from 'react-icons/fi';
import PageHeader from '../common/PageHeader';
import { useApp } from '../../context/AppContext';
import { parseExcelFile, exportToExcel } from '../../utils/helpers';

export default function ExamTimetable() {
  const { showNotification } = useApp();
  const fileInputRef = useRef(null);
  const [semester, setSemester] = useState('');
  const [subject, setSubject] = useState('');
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !semester || !examType) { showNotification('Select semester and exam type first', 'error'); return; }
    setLoading(true);
    try {
      const data = await parseExcelFile(file);
      setTimetable(data.map((r, i) => ({ id: i+1, date: r.Date || r.date, day: r.Day || r.day, subject: r.Subject || r.subject, code: r['Subject Code'] || r.code, time: r.Time || r.time, venue: r.Venue || r.venue })));
      showNotification('Timetable uploaded');
    } catch { showNotification('Upload failed', 'error'); }
    setLoading(false);
  };

  const handleDownloadTemplate = () => { exportToExcel([{ Date: '01-01-2024', Day: 'Monday', Subject: 'Mathematics', 'Subject Code': 'MTH101', Time: '10:00 AM - 1:00 PM', Venue: 'Hall A' }], 'timetable_template'); showNotification('Template downloaded'); };

  return (
    <div>
      <PageHeader title="Upload Exam Timetable" subtitle="Upload timetables via Excel" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Configuration</h3>
          <div className="mb-4"><label className="block text-sm font-medium text-gray-700 mb-1">Semester</label><select className="input-field" value={semester} onChange={(e) => setSemester(e.target.value)}><option value="">Select</option>{[1,2,3,4,5,6].map(s => <option key={s} value={s}>Sem {s}</option>)}</select></div>
          <div className="mb-6"><label className="block text-sm font-medium text-gray-700 mb-1">Subject</label><select className="input-field" value={subject} onChange={(e) => setSubject(e.target.value)}><option value="">Select</option>{['Java', 'Python', 'OS'].map(t => <option key={t} value={t}>{t}</option>)}</select></div>
          <input ref={fileInputRef} type="file" accept=".xlsx,.xls" onChange={handleUpload} className="hidden" />
          <button onClick={() => fileInputRef.current?.click()} disabled={!semester || !examType || loading} className="btn-primary w-full flex items-center justify-center gap-2 mb-3"><FiUpload /> {loading ? 'Uploading...' : 'Upload Timetable'}</button>
          <button onClick={handleDownloadTemplate} className="btn-secondary w-full flex items-center justify-center gap-2"><FiDownload /> Download Template</button>
        </div>
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold text-gray-800">Preview</h3>{timetable.length > 0 && <button onClick={() => showNotification('Saved!')} className="btn-primary flex items-center gap-2"><FiSave /> Save</button>}</div>
          {timetable.length > 0 ? (
            <div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-primary-600 text-white"><tr><th className="px-3 py-2 text-left">Date</th><th className="px-3 py-2 text-left">Day</th><th className="px-3 py-2 text-left">Subject</th><th className="px-3 py-2 text-left">Code</th><th className="px-3 py-2 text-left">Time</th><th className="px-3 py-2 text-left">Venue</th></tr></thead><tbody className="divide-y">{timetable.map(r => (<tr key={r.id}><td className="px-3 py-2">{r.date}</td><td className="px-3 py-2">{r.day}</td><td className="px-3 py-2">{r.subject}</td><td className="px-3 py-2">{r.code}</td><td className="px-3 py-2">{r.time}</td><td className="px-3 py-2">{r.venue}</td></tr>))}</tbody></table></div>
          ) : <div className="text-center py-12 text-gray-500">Upload an Excel file to preview timetable</div>}
        </div>
      </div>
    </div>
  );
}