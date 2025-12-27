import React from 'react';
import ExamForm from './ExamForm';
import ExamTable from './ExamTable';
import Card from '../ui/Card';
import { useApp } from '../../contexts/AppContext';
import { getSampleExams } from '../../data/sampleData';
import { PlusCircle, Calendar, Info } from 'lucide-react';

function ExamScheduling() {
  const { exams } = useApp();
  const displayExams = exams.length > 0 ? exams : getSampleExams();
  const showingSample = exams.length === 0;

  return (
    <div className="space-y-6">
      <Card><Card.Header><Card.Title icon={PlusCircle}>Schedule New Exam</Card.Title></Card.Header><Card.Content><ExamForm /></Card.Content></Card>
      <Card>
        <Card.Header><Card.Title icon={Calendar}>Scheduled Exams</Card.Title></Card.Header>
        <Card.Content>
          {showingSample && <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 flex items-center gap-2"><Info className="text-amber-600" size={20} /><p className="text-sm text-amber-700">Showing sample data. Add your own exams to replace these.</p></div>}
          <ExamTable exams={displayExams} showingSample={showingSample} />
        </Card.Content>
      </Card>
    </div>
  );
}

export default ExamScheduling;