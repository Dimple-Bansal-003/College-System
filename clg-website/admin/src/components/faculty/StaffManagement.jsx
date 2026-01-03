import { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import PageHeader from '../common/PageHeader';
import DataGrid from '../common/DataGrid';
import Modal from '../common/Modal';
import ConfirmDialog from '../common/ConfirmDialog';
import { useApp } from '../../context/AppContext';

const initialFormData = { name: '', email: '', phone: '', department: '', role: '' };

export default function StaffManagement() {
  const { showNotification } = useApp();
  const [staff, setStaff] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [isEdit, setIsEdit] = useState(false);

  const departments = ['Administration', 'Accounts', 'Library', 'IT Support', 'Maintenance'];
  const roles = ['Admin Officer', 'Accountant', 'Librarian', 'IT Technician', 'Clerk'];

  const handleOpenModal = (data = null) => {
    if (data) { setFormData(data); setIsEdit(true); } else { setFormData(initialFormData); setIsEdit(false); }
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) { setStaff(prev => prev.map(s => s.id === formData.id ? formData : s)); showNotification('Staff updated'); }
    else { setStaff(prev => [...prev, { ...formData, id: Date.now() }]); showNotification('Staff added'); }
    setModalOpen(false);
  };

  const handleDelete = () => { setStaff(prev => prev.filter(s => s.id !== selectedStaff.id)); showNotification('Staff deleted'); setDeleteDialogOpen(false); };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone', width: '120px' },
    { key: 'department', label: 'Department' },
    { key: 'role', label: 'Role' },
    { key: 'actions', label: 'Actions', width: '100px', render: (row) => (
      <div className="flex gap-2">
        <button onClick={() => handleOpenModal(row)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><FiEdit2 size={16} /></button>
        <button onClick={() => { setSelectedStaff(row); setDeleteDialogOpen(true); }} className="p-1 text-red-600 hover:bg-red-50 rounded"><FiTrash2 size={16} /></button>
      </div>
    )}
  ];

  return (
    <div>
      <PageHeader title="Staff Management" subtitle="Add, edit, and manage staff members" action={<button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2"><FiPlus size={18} /> Add Staff</button>} />
      <div className="card"><DataGrid columns={columns} data={staff} emptyMessage="No staff found. Add staff to see data here." /></div>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={isEdit ? 'Edit Staff' : 'Add Staff'} size="lg">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label><input type="text" className="input-field" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" className="input-field" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label><input type="tel" className="input-field" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Department</label><select className="input-field" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} required><option value="">Select Department</option>{departments.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Role</label><select className="input-field" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} required><option value="">Select Role</option>{roles.map(r => <option key={r} value={r}>{r}</option>)}</select></div>
          </div>
          <div className="flex justify-end gap-3 mt-6"><button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button><button type="submit" className="btn-primary">{isEdit ? 'Update' : 'Add'} Staff</button></div>
        </form>
      </Modal>
      <ConfirmDialog isOpen={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} onConfirm={handleDelete} title="Delete Staff" message={`Are you sure you want to delete ${selectedStaff?.name}?`} />
    </div>
  );
}