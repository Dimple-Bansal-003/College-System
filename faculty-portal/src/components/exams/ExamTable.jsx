import React from 'react';
import Badge from '../ui/Badge';
import ConfirmDialog from '../ui/ConfirmDialog';
import { useApp } from '../../contexts/AppContext';
import { useToast } from '../../contexts/ToastContext';
import { Trash2 } from 'lucide-react';

function ExamTable({ exams, showingSample }) {
  const { deleteConfirmId, setDeleteConfirm, deleteExam } = useApp();
  const { showToast } = useToast();

  const handleDelete = (id) => { deleteExam(id); showToast('Exam deleted successfully'); };

  if (exams.length === 0) return <p className="text-gray-500 text-center py-12">No exams scheduled.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead><tr className="bg-gray-50 text-left">
          <th className="p-4 font-semibold text-gray-600 rounded-tl-lg">Exam Name</th>
          <th className="p-4 font-semibold text-gray-600">Course</th>
          <th className="p-4 font-semibold text-gray-600">Semester</th>
          <th className="p-4 font-semibold text-gray-600">Date</th>
          <th className="p-4 font-semibold text-gray-600">Time</th>
          <th className="p-4 font-semibold text-gray-600">Room</th>
          <th className="p-4 font-semibold text-gray-600 rounded-tr-lg">Actions</th>
        </tr></thead>
        <tbody>
          {exams.map((exam) => (
            <tr key={exam.id} className={`border-b border-gray-100 hover:bg-gray-50 ${exam.isSample ? 'bg-amber-50/50' : ''}`}>
              <td className="p-4 font-medium">{exam.exam_name}{exam.isSample && <Badge variant="sample" className="ml-2">Sample</Badge>}</td>
              <td className="p-4">{exam.course}</td>
              <td className="p-4">{exam.semester}</td>
              <td className="p-4">{exam.exam_date}</td>
              <td className="p-4">{exam.exam_time}</td>
              <td className="p-4">{exam.room}</td>
              <td className="p-4">
                {exam.isSample ? <span className="text-gray-400 text-xs">Demo</span> :
                  deleteConfirmId === exam.id ? <ConfirmDialog onConfirm={() => handleDelete(exam.id)} onCancel={() => setDeleteConfirm(null)} /> :
                  <button onClick={() => setDeleteConfirm(exam.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ExamTable;