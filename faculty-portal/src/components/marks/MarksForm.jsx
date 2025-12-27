import React, { useState } from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { useApp } from '../../contexts/AppContext';
import { useToast } from '../../contexts/ToastContext';
import { COURSES, SEMESTERS } from '../../utils/constants';
import { calculateGrade, calculatePercentage } from '../../utils/gradeCalculator';
import { Plus, Save, X } from 'lucide-react';

function MarksForm({ dynamicFields, onAddField, onRemoveField, onReset }) {
  const [formData, setFormData] = useState({ student_id: '', student_name: '', course: '', semester: '' });
  const [fieldMarks, setFieldMarks] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { addMarks, studentMarks } = useApp();
  const { showToast } = useToast();

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleFieldMarksChange = (fieldId, value) => setFieldMarks((prev) => ({ ...prev, [fieldId]: parseInt(value) || 0 }));

  const calculateTotals = () => {
    let totalMarks = 0, totalMax = 0;
    dynamicFields.forEach((field) => { totalMarks += fieldMarks[field.id] || 0; totalMax += field.maxMarks; });
    const percentage = calculatePercentage(totalMarks, totalMax);
    return { totalMarks, totalMax, percentage, grade: calculateGrade(percentage) };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (studentMarks.length >= 999) { showToast('Maximum limit reached', 'error'); return; }
    if (dynamicFields.length === 0) { showToast('Add at least one assessment field', 'error'); return; }
    setIsLoading(true);
    try {
      const { totalMarks, totalMax, percentage, grade } = calculateTotals();
      const marksData = { ...formData, total_marks: totalMarks, total_max: totalMax, percentage, grade };
      dynamicFields.forEach((field, i) => { marksData[`field${i + 1}_name`] = field.name; marksData[`field${i + 1}_marks`] = fieldMarks[field.id] || 0; marksData[`field${i + 1}_max`] = field.maxMarks; });
      addMarks(marksData); showToast('Marks saved successfully');
      setFormData({ student_id: '', student_name: '', course: '', semester: '' }); setFieldMarks({});
    } catch { showToast('Failed to save marks', 'error'); }
    finally { setIsLoading(false); }
  };

  const handleReset = () => { setFormData({ student_id: '', student_name: '', course: '', semester: '' }); setFieldMarks({}); onReset(); };
  const { totalMarks, totalMax, percentage, grade } = calculateTotals();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input label="Student ID" name="student_id" value={formData.student_id} onChange={handleChange} placeholder="e.g., STU2024001" required />
        <Input label="Student Name" name="student_name" value={formData.student_name} onChange={handleChange} placeholder="Full Name" required />
        <Select label="Course" name="course" value={formData.course} onChange={handleChange} options={COURSES} placeholder="Select Course" required />
        <Select label="Semester" name="semester" value={formData.semester} onChange={handleChange} options={SEMESTERS} placeholder="Select Semester" required />
      </div>
      <div className="bg-gray-50 p-6 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold">Assessment Fields</h4>
          <Button type="button" size="sm" onClick={onAddField} disabled={dynamicFields.length >= 10}><Plus size={16} />Add Assessment Field</Button>
        </div>
        {dynamicFields.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {dynamicFields.map((field) => (
              <div key={field.id} className="bg-white border-2 border-gray-200 rounded-xl p-4 relative group">
                <button type="button" onClick={() => onRemoveField(field.id)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><X size={14} /></button>
                <label className="block text-sm font-medium text-gray-700 mb-2">{field.name} (Max {field.maxMarks})</label>
                <input type="number" className="input-field" min="0" max={field.maxMarks} value={fieldMarks[field.id] || ''} onChange={(e) => handleFieldMarksChange(field.id, e.target.value)} placeholder={`0-${field.maxMarks}`} />
              </div>
            ))}
          </div>
        ) : <div className="text-center py-8 text-gray-500"><Plus className="mx-auto text-gray-300 mb-2" size={40} /><p>No assessment fields added yet.</p></div>}
        <div className="flex flex-wrap gap-4 p-4 bg-white rounded-xl border-2 border-gray-200">
          <div className="flex-1 min-w-[120px] text-center"><p className="text-xs text-gray-500 mb-1">Total Marks</p><p className="text-3xl font-bold text-blue-600">{totalMarks}</p><p className="text-xs text-gray-400">out of {totalMax}</p></div>
          <div className="flex-1 min-w-[120px] text-center border-l border-gray-200"><p className="text-xs text-gray-500 mb-1">Percentage</p><p className="text-3xl font-bold text-purple-600">{percentage}%</p></div>
          <div className="flex-1 min-w-[120px] text-center border-l border-gray-200"><p className="text-xs text-gray-500 mb-1">Grade</p><p className="text-3xl font-bold text-green-600">{dynamicFields.length > 0 ? grade : '-'}</p></div>
          <div className="flex-1 min-w-[120px] text-center border-l border-gray-200"><p className="text-xs text-gray-500 mb-1">Status</p><p className={`text-xl font-bold ${dynamicFields.length === 0 || totalMarks === 0 ? 'text-gray-400' : percentage >= 40 ? 'text-green-600' : 'text-red-600'}`}>{dynamicFields.length === 0 || totalMarks === 0 ? '-' : percentage >= 40 ? 'PASS' : 'FAIL'}</p></div>
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={handleReset}>Clear Form</Button>
        <Button type="submit" isLoading={isLoading} disabled={dynamicFields.length === 0}><Save size={16} />Save Marks</Button>
      </div>
    </form>
  );
}

export default MarksForm;