import React, { useState } from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { useApp } from '../../contexts/AppContext';
import { useToast } from '../../contexts/ToastContext';
import { COURSES, SEMESTERS } from '../../utils/constants';
import { Plus } from 'lucide-react';

const initialFormState = { exam_name: '', course: '', semester: '', exam_date: '', exam_time: '', room: '' };

function ExamForm() {
  const [formData, setFormData] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const { addExam, exams } = useApp();
  const { showToast } = useToast();

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (exams.length >= 999) { showToast('Maximum limit reached', 'error'); return; }
    setIsLoading(true);
    try { addExam(formData); showToast('Exam scheduled successfully'); setFormData(initialFormState); }
    catch { showToast('Failed to schedule exam', 'error'); }
    finally { setIsLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Input label="Exam Name" name="exam_name" value={formData.exam_name} onChange={handleChange} placeholder="e.g., Mid-Term Examination" required />
        <Select label="Course" name="course" value={formData.course} onChange={handleChange} options={COURSES} placeholder="Select Course" required />
        <Select label="Semester" name="semester" value={formData.semester} onChange={handleChange} options={SEMESTERS} placeholder="Select Semester" required />
        <Input label="Date" name="exam_date" type="date" value={formData.exam_date} onChange={handleChange} required />
        <Input label="Time" name="exam_time" type="time" value={formData.exam_time} onChange={handleChange} required />
        <Input label="Room/Venue" name="room" value={formData.room} onChange={handleChange} placeholder="e.g., Hall A-101" required />
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <Button type="button" variant="secondary" onClick={() => setFormData(initialFormState)}>Clear</Button>
        <Button type="submit" isLoading={isLoading}><Plus size={16} />Schedule Exam</Button>
      </div>
    </form>
  );
}

export default ExamForm;