import React, { useState } from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import ConfirmDialog from '../ui/ConfirmDialog';
import { useApp } from '../../contexts/AppContext';
import { useToast } from '../../contexts/ToastContext';
import { getSampleMarks } from '../../data/sampleData';
import { Table, Trash2, Search, Info } from 'lucide-react';

function StudentMarks() {
  const [searchTerm, setSearchTerm] = useState('');
  const { studentMarks, deleteConfirmId, setDeleteConfirm, deleteMarks } = useApp();
  const { showToast } = useToast();

  const displayMarks = studentMarks.length > 0 ? studentMarks : getSampleMarks();
  const showingSample = studentMarks.length === 0;

  const filteredMarks = displayMarks.filter((m) => m.student_id?.toLowerCase().includes(searchTerm.toLowerCase()) || m.student_name?.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleDelete = (id) => { deleteMarks(id); showToast('Record deleted'); };

  const getGradeBadgeVariant = (grade) => { if (grade === 'A+' || grade === 'A') return 'success'; if (grade === 'F') return 'danger'; return 'info'; };

  return (
    <Card>
      <Card.Header>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <Card.Title icon={Table}>Student Marks Table</Card.Title>
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} /><input type="text" className="input-field pl-10 w-64" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
        </div>
      </Card.Header>
      <Card.Content>
        {showingSample && <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 flex items-center gap-2"><Info className="text-amber-600" size={20} /><p className="text-sm text-amber-700">Showing sample data.</p></div>}
        {filteredMarks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-gray-50 text-left"><th className="p-4 font-semibold text-gray-600">Student ID</th><th className="p-4 font-semibold text-gray-600">Name</th><th className="p-4 font-semibold text-gray-600">Course</th><th className="p-4 font-semibold text-gray-600 text-center">Total</th><th className="p-4 font-semibold text-gray-600 text-center">%</th><th className="p-4 font-semibold text-gray-600 text-center">Grade</th><th className="p-4 font-semibold text-gray-600 text-center">Actions</th></tr></thead>
              <tbody>
                {filteredMarks.map((m) => (
                  <tr key={m.id} className={`border-b border-gray-100 hover:bg-gray-50 ${m.isSample ? 'bg-amber-50/50' : ''}`}>
                    <td className="p-4 font-mono text-sm">{m.student_id}</td>
                    <td className="p-4 font-medium">{m.student_name}{m.isSample && <Badge variant="sample" className="ml-2">Sample</Badge>}</td>
                    <td className="p-4">{m.course}</td>
                    <td className="p-4 text-center font-semibold">{m.total_marks}/{m.total_max || 100}</td>
                    <td className="p-4 text-center font-semibold text-purple-600">{m.percentage}%</td>
                    <td className="p-4 text-center"><Badge variant={getGradeBadgeVariant(m.grade)}>{m.grade}</Badge></td>
                    <td className="p-4 text-center">
                      {m.isSample ? <span className="text-gray-400 text-xs">Demo</span> :
                        deleteConfirmId === m.id ? <ConfirmDialog onConfirm={() => handleDelete(m.id)} onCancel={() => setDeleteConfirm(null)} /> :
                        <button onClick={() => setDeleteConfirm(m.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="text-gray-500 text-center py-12">No marks recorded.</p>}
      </Card.Content>
    </Card>
  );
}

export default StudentMarks;