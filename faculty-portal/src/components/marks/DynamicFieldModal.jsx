import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useToast } from '../../contexts/ToastContext';

function DynamicFieldModal({ isOpen, onClose, onAdd, currentFieldCount }) {
  const [fieldName, setFieldName] = useState('');
  const [maxMarks, setMaxMarks] = useState('');
  const { showToast } = useToast();

  const handleSubmit = () => {
    if (!fieldName.trim()) { showToast('Enter a field name', 'error'); return; }
    const marks = parseInt(maxMarks);
    if (!marks || marks <= 0) { showToast('Max marks must be at least 1', 'error'); return; }
    if (currentFieldCount >= 10) { showToast('Maximum 10 fields allowed', 'error'); return; }
    onAdd({ name: fieldName.trim(), maxMarks: marks });
    showToast(`${fieldName} field added`);
    setFieldName(''); setMaxMarks(''); onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Assessment Field">
      <div className="space-y-4">
        <Input label="Field Name" value={fieldName} onChange={(e) => setFieldName(e.target.value)} placeholder="e.g., Internal, Assignment" />
        <div><Input label="Maximum Marks" type="number" value={maxMarks} onChange={(e) => setMaxMarks(e.target.value)} min="1" max="500" placeholder="e.g., 50" /><p className="text-xs text-gray-500 mt-1">Set the maximum marks for this field</p></div>
        <div className="flex gap-3 pt-4">
          <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button onClick={handleSubmit} className="flex-1">Add Field</Button>
        </div>
      </div>
    </Modal>
  );
}

export default DynamicFieldModal;