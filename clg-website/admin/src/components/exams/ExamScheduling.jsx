import { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import PageHeader from '../common/PageHeader';
import DataGrid from '../common/DataGrid';
import Modal from '../common/Modal';
import ConfirmDialog from '../common/ConfirmDialog';
import { useApp } from '../../context/AppContext';

export default function ExamScheduling() {
  const { showNotification } = useApp();
  const [exams, setExams] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [formData, setFormData] = useState({ subject: '', semester: '', date: '', startTime: '', endTime: '', venue: '', examType: '', maxMarks: '' });
  const [isEdit, setIsEdit] = useState(false);

  const examTypes = ['Internal', 'Mid-Term', 'End-Term', 'Practical', 'Viva'];
  const venues = ['Hall A', 'Hall B', 'Lab 1', 'Lab 2', 'Auditorium'];

  const handleSubmit = (e) => { e.preventDefault(); if (isEdit) { setExams(prev => prev.map(ex => ex.id === formData.id ? formData : ex)); showNotification('Exam updated'); } else { setExams(prev => [...prev, { ...formData, id: Date.now() }]); showNotification('Exam scheduled'); } setModalOpen(false); };

  const columns = [
    { key: 'subject', label: 'Subject' },
    { key: 'semester', label: 'Sem', width: '60px', render: (r) => <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Sem {r.semester}</span> },
    { key: 'date', label: 'Date', width: '100px' },
    { key: 'startTime', label: 'Start', width: '80px' },
    { key: 'endTime', label: 'End', width: '80px' },
    { key: 'venue', label: 'Venue' },
    { key: 'examType', label: 'Type', render: (r) => <span className={`px-2 py-1 rounded text-xs ${r.examType === 'End-Term' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>{r.examType}</span> },
    { key: 'actions', label: 'Actions', width: '100px', render: (r) => (
      <div className="flex gap-1">
        <button onClick={() => { setFormData(r); setIsEdit(true); setModalOpen(true); }} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><FiEdit2 size={16} /></button>
        <button onClick={() => { setSelectedExam(r); setDeleteDialogOpen(true); }} className="p-1 text-red-600 hover:bg-red-50 rounded"><FiTrash2 size={16} /></button>
      </div>
    )}
  ];

  return (
    <div>
      <PageHeader title="Exam Scheduling" subtitle="Schedule and manage examinations" action={<button onClick={() => { setFormData({ subject: '', semester: '', date: '', startTime: '', endTime: '', venue: '', examType: '', maxMarks: '' }); setIsEdit(false); setModalOpen(true); }} className="btn-primary flex items-center gap-2"><FiPlus size={18} /> Schedule Exam</button>} />
      <div className="card"><DataGrid columns={columns} data={exams} emptyMessage="No exams scheduled." /></div>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={isEdit ? 'Edit Exam' : 'Schedule Exam'} size="lg">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Subject</label><input type="text" className="input-field" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} required /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Semester</label><select className="input-field" value={formData.semester} onChange={(e) => setFormData({...formData, semester: e.target.value})} required><option value="">Select</option>{[1,2,3,4,5,6].map(s => <option key={s} value={s}>Sem {s}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Date</label><input type="date" className="input-field" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label><select className="input-field" value={formData.examType} onChange={(e) => setFormData({...formData, examType: e.target.value})} required><option value="">Select</option>{examTypes.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label><input type="time" className="input-field" value={formData.startTime} onChange={(e) => setFormData({...formData, startTime: e.target.value})} required /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">End Time</label><input type="time" className="input-field" value={formData.endTime} onChange={(e) => setFormData({...formData, endTime: e.target.value})} required /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Venue</label><select className="input-field" value={formData.venue} onChange={(e) => setFormData({...formData, venue: e.target.value})} required><option value="">Select</option>{venues.map(v => <option key={v} value={v}>{v}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Max Marks</label><input type="number" className="input-field" value={formData.maxMarks} onChange={(e) => setFormData({...formData, maxMarks: e.target.value})} required /></div>
          </div>
          <div className="flex justify-end gap-3 mt-6"><button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button><button type="submit" className="btn-primary">{isEdit ? 'Update' : 'Schedule'}</button></div>
        </form>
      </Modal>
      <ConfirmDialog isOpen={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} onConfirm={() => { setExams(prev => prev.filter(e => e.id !== selectedExam.id)); showNotification('Exam deleted'); setDeleteDialogOpen(false); }} title="Delete Exam" message={`Delete ${selectedExam?.subject} exam?`} />
    </div>
  );
}