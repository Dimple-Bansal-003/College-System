import React, { useState } from 'react';
import MarksForm from './MarksForm';
import DynamicFieldModal from './DynamicFieldModal';
import Card from '../ui/Card';
import { Edit3, Info } from 'lucide-react';

function MarksEntry() {
  const [dynamicFields, setDynamicFields] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addField = (field) => {
    if (dynamicFields.length >= 10) return;
    setDynamicFields((prev) => [...prev, { id: `field${prev.length + 1}`, name: field.name, maxMarks: field.maxMarks }]);
  };

  const removeField = (fieldId) => setDynamicFields((prev) => prev.filter((f) => f.id !== fieldId).map((f, i) => ({ ...f, id: `field${i + 1}` })));
  const resetFields = () => setDynamicFields([]);

  return (
    <div className="space-y-6">
      <Card>
        <Card.Header><Card.Title icon={Edit3}>Enter Student Marks</Card.Title></Card.Header>
        <Card.Content>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
            <div><p className="text-sm text-blue-800 font-medium">Flexible Marks Distribution</p><p className="text-xs text-blue-600 mt-1">Click "Add Assessment Field" to create custom components.</p></div>
          </div>
          <MarksForm dynamicFields={dynamicFields} onAddField={() => setIsModalOpen(true)} onRemoveField={removeField} onReset={resetFields} />
        </Card.Content>
      </Card>
      <DynamicFieldModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={addField} currentFieldCount={dynamicFields.length} />
    </div>
  );
}

export default MarksEntry;