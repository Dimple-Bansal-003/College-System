import React from 'react';
import Badge from '../ui/Badge';
import ConfirmDialog from '../ui/ConfirmDialog';
import { useApp } from '../../contexts/AppContext';
import { useToast } from '../../contexts/ToastContext';
import { FileText, Paperclip, AlertTriangle, Trash2 } from 'lucide-react';

function PaperCard({ paper }) {
  const { deleteConfirmId, setDeleteConfirm, deletePaper } = useApp();
  const { showToast } = useToast();

  const handleDelete = () => { deletePaper(paper.id); showToast('Paper deleted'); };
  const getStatusVariant = (status) => { if (status === 'Approved') return 'success'; if (status === 'Under Review') return 'warning'; return 'info'; };

  return (
    <div className={`border-2 rounded-xl p-5 transition-all hover:border-blue-200 ${paper.isSample ? 'border-amber-200 bg-amber-50/30' : 'border-gray-100'}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center"><FileText className="text-blue-600" size={24} /></div>
        <div className="flex items-center gap-2">{paper.isSample && <Badge variant="sample">Sample</Badge>}<Badge variant={getStatusVariant(paper.status)}>{paper.status}</Badge></div>
      </div>
      <h4 className="font-semibold mb-1">{paper.paper_name}</h4>
      <p className="text-sm text-gray-500 mb-2">{paper.course} | {paper.semester}</p>
      {paper.file_name ? <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded mb-2"><Paperclip size={12} /><span className="truncate">{paper.file_name}</span>{paper.file_size && <span className="text-gray-400">({paper.file_size})</span>}</div>
        : <div className="flex items-center gap-2 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded mb-2"><AlertTriangle size={12} /><span>No file attached</span></div>}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">Uploaded: {paper.upload_date}</p>
        {paper.isSample ? <span className="text-gray-400 text-xs">Demo</span> :
          deleteConfirmId === paper.id ? <ConfirmDialog onConfirm={handleDelete} onCancel={() => setDeleteConfirm(null)} /> :
          <button onClick={() => setDeleteConfirm(paper.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>}
      </div>
    </div>
  );
}

export default PaperCard;