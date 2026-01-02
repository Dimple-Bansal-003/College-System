import { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiUserPlus, FiUsers } from 'react-icons/fi';
import PageHeader from '../common/PageHeader';
import DataGrid from '../common/DataGrid';
import Modal from '../common/Modal';
import ConfirmDialog from '../common/ConfirmDialog';
import { useApp } from '../../context/AppContext';

export default function SubjectAssignment() {
  const { showNotification } = useApp();
  const [subjects, setSubjects] = useState([]);
  const [faculty] = useState([
    { id: 1, name: 'Dr. John Smith', department: 'Computer Science', designation: 'Professor' },
    { id: 2, name: 'Prof. Jane Doe', department: 'Mathematics', designation: 'Associate Professor' },
    { id: 3, name: 'Dr. Bob Wilson', department: 'Physics', designation: 'Assistant Professor' },
    { id: 4, name: 'Dr. Alice Brown', department: 'Chemistry', designation: 'Professor' },
    { id: 5, name: 'Prof. Charlie Davis', department: 'English', designation: 'Lecturer' },
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState([]);
  const [formData, setFormData] = useState({ 
    name: '', 
    code: '', 
    semester: '', 
    credits: '', 
    maxMarks: 100, 
    passingMarks: 40,
    facultyId: ''
  });
  const [isEdit, setIsEdit] = useState(false);

  const handleOpenModal = (data = null) => {
    if (data) {
      setFormData(data);
      setIsEdit(true);
    } else {
      setFormData({ name: '', code: '', semester: '', credits: '', maxMarks: 100, passingMarks: 40, facultyId: '' });
      setIsEdit(false);
    }
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const assignedFaculty = faculty.find(f => f.id === parseInt(formData.facultyId));
    const subjectData = {
      ...formData,
      assignedFaculty: assignedFaculty ? [assignedFaculty] : []
    };

    if (isEdit) {
      setSubjects(prev => prev.map(s => s.id === formData.id ? subjectData : s));
      showNotification('Subject updated');
    } else {
      setSubjects(prev => [...prev, { ...subjectData, id: Date.now() }]);
      showNotification('Subject added');
    }
    setModalOpen(false);
  };

  const handleOpenAssignModal = (subject) => {
    setSelectedSubject(subject);
    setSelectedFaculty(subject.assignedFaculty || []);
    setAssignModalOpen(true);
  };

  const handleAssignFaculty = () => {
    setSubjects(prev => prev.map(s => 
      s.id === selectedSubject.id 
        ? { ...s, assignedFaculty: selectedFaculty }
        : s
    ));
    showNotification('Faculty assigned');
    setAssignModalOpen(false);
  };

  const toggleFaculty = (f) => {
    setSelectedFaculty(prev => 
      prev.find(x => x.id === f.id) 
        ? prev.filter(x => x.id !== f.id) 
        : [...prev, f]
    );
  };

  const handleDelete = () => {
    setSubjects(prev => prev.filter(s => s.id !== selectedSubject.id));
    showNotification('Subject deleted');
    setDeleteDialogOpen(false);
  };

  const columns = [
    { key: 'code', label: 'Code', width: '80px' },
    { key: 'name', label: 'Subject Name' },
    { 
      key: 'semester', 
      label: 'Semester', 
      width: '80px', 
      render: (r) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
          Sem {r.semester}
        </span>
      )
    },
    { key: 'credits', label: 'Credits', width: '70px' },
    { key: 'maxMarks', label: 'Max Marks', width: '80px' },
    { 
      key: 'assignedFaculty', 
      label: 'Assigned Faculty', 
      render: (r) => {
        if (r.assignedFaculty?.length > 0) {
          return (
            <div className="flex flex-wrap gap-1">
              {r.assignedFaculty.map(f => (
                <span 
                  key={f.id} 
                  className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs"
                >
                  <FiUsers size={12} />
                  {f.name}
                </span>
              ))}
            </div>
          );
        }
        return <span className="text-gray-400 italic">Not assigned</span>;
      }
    },
    { 
      key: 'actions', 
      label: 'Actions', 
      width: '120px', 
      render: (r) => (
        <div className="flex gap-1">
          <button 
            onClick={() => handleOpenAssignModal(r)} 
            className="p-1.5 text-green-600 hover:bg-green-50 rounded" 
            title="Assign Faculty"
          >
            <FiUserPlus size={16} />
          </button>
          <button 
            onClick={() => handleOpenModal(r)} 
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
            title="Edit Subject"
          >
            <FiEdit2 size={16} />
          </button>
          <button 
            onClick={() => { setSelectedSubject(r); setDeleteDialogOpen(true); }} 
            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
            title="Delete Subject"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div>
      <PageHeader 
        title="Subject Assignment" 
        subtitle="Manage subjects and assign faculty members (supports multiple faculty per subject)" 
        action={
          <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
            <FiPlus size={18} /> Add Subject
          </button>
        } 
      />
      
      <div className="card">
        <DataGrid 
          columns={columns} 
          data={subjects} 
          emptyMessage="No subjects added. Click 'Add Subject' to create one." 
        />
      </div>

      {/* Add/Edit Subject Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={isEdit ? 'Edit Subject' : 'Add Subject'} size="lg">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject Code *</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="e.g., CSE101"
                value={formData.code} 
                onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})} 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Semester *</label>
              <select 
                className="input-field" 
                value={formData.semester} 
                onChange={(e) => setFormData({...formData, semester: e.target.value})} 
                required
              >
                <option value="">Select Semester</option>
                {[1, 2, 3, 4, 5, 6].map(s => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name *</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="e.g., Data Structures"
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Credits *</label>
              <input 
                type="number" 
                className="input-field" 
                placeholder="e.g., 4"
                min="1"
                max="10"
                value={formData.credits} 
                onChange={(e) => setFormData({...formData, credits: e.target.value})} 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Marks *</label>
              <input 
                type="number" 
                className="input-field" 
                value={formData.maxMarks} 
                onChange={(e) => setFormData({...formData, maxMarks: e.target.value})} 
                required 
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Assign Faculty</label>
              <select 
                className="input-field" 
                value={formData.facultyId} 
                onChange={(e) => setFormData({...formData, facultyId: e.target.value})}
              >
                <option value="">Select Faculty (Optional)</option>
                {faculty.map(f => (
                  <option key={f.id} value={f.id}>
                    {f.name} - {f.department} ({f.designation})
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                You can assign additional faculty later using the assign button
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {isEdit ? 'Update' : 'Add'} Subject
            </button>
          </div>
        </form>
      </Modal>

      {/* Assign Multiple Faculty Modal */}
      <Modal 
        isOpen={assignModalOpen} 
        onClose={() => setAssignModalOpen(false)} 
        title={`Assign Faculty to ${selectedSubject?.name}`}
        size="md"
      >
        <p className="text-sm text-gray-500 mb-4">
          Select one or more faculty members to teach this subject.
        </p>
        <div className="space-y-2 max-h-80 overflow-y-auto mb-6">
          {faculty.map(f => (
            <label 
              key={f.id} 
              className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                selectedFaculty.find(x => x.id === f.id) 
                  ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' 
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <input 
                type="checkbox" 
                checked={!!selectedFaculty.find(x => x.id === f.id)} 
                onChange={() => toggleFaculty(f)} 
                className="mr-3 w-4 h-4 text-primary-600 rounded focus:ring-primary-500" 
              />
              <div className="flex-1">
                <div className="font-medium text-gray-800">{f.name}</div>
                <div className="text-sm text-gray-500">{f.department} • {f.designation}</div>
              </div>
            </label>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {selectedFaculty.length} faculty selected
          </span>
          <div className="flex gap-3">
            <button onClick={() => setAssignModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button onClick={handleAssignFaculty} className="btn-primary">
              Assign Faculty
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog 
        isOpen={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)} 
        onConfirm={handleDelete} 
        title="Delete Subject" 
        message={`Are you sure you want to delete "${selectedSubject?.name}"? This action cannot be undone.`} 
      />
    </div>
  );
}