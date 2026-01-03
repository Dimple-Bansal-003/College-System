import React, { useState } from 'react';
import Card from '../ui/Card';
import ReportPreview from './ReportPreview';
import { useApp } from '../../contexts/AppContext';
import { getSampleExams, getSampleMarks } from '../../data/sampleData';
import { getPassRate } from '../../utils/gradeCalculator';
import { FileText, BarChart3, Calendar, Award, ChevronRight, Info } from 'lucide-react';

function Reports() {
  const [selectedReport, setSelectedReport] = useState(null);
  const { exams, studentMarks } = useApp();

  const displayExams = exams.length > 0 ? exams : getSampleExams();
  const displayMarks = studentMarks.length > 0 ? studentMarks : getSampleMarks();
  const showingSample = exams.length === 0 || studentMarks.length === 0;
  const passRate = getPassRate(displayMarks);

  const reportTypes = [
    { id: 'marks', title: 'Marks Report', description: 'Complete marks summary', icon: BarChart3, color: 'blue' },
    { id: 'exam', title: 'Exam Schedule Report', description: 'All scheduled exams', icon: Calendar, color: 'green' },
    { id: 'grade', title: 'Grade Distribution', description: 'Statistical analysis', icon: Award, color: 'purple' },
  ];

  const quickStats = [
    { label: 'Total Exams', value: displayExams.length, color: 'blue' },
    { label: 'Students Evaluated', value: displayMarks.length, color: 'green' },
    { label: 'Pass Rate', value: `${passRate}%`, color: 'purple' },
  ];

  return (
    <div className="space-y-6">
      {showingSample && <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-2"><Info className="text-amber-600" size={20} /><p className="text-sm text-amber-700">Reports use sample data.</p></div>}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><Card.Header><Card.Title icon={FileText}>Generate Reports</Card.Title></Card.Header>
          <Card.Content>
            <div className="space-y-4">
              {reportTypes.map((report) => (
                <button key={report.id} onClick={() => setSelectedReport(report.id)} className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${selectedReport === report.id ? 'bg-blue-50 border-2 border-blue-300' : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'}`}>
                  <div className="flex items-center gap-3"><report.icon className={`${report.color === 'blue' ? 'text-blue-600' : report.color === 'green' ? 'text-green-600' : 'text-purple-600'}`} size={24} /><div className="text-left"><p className="font-medium">{report.title}</p><p className="text-sm text-gray-500">{report.description}</p></div></div>
                  <ChevronRight size={20} />
                </button>
              ))}
            </div>
          </Card.Content>
        </Card>
        <Card><Card.Header><Card.Title>Quick Stats</Card.Title></Card.Header>
          <Card.Content>
            <div className="space-y-4">
              {quickStats.map((stat) => (
                <div key={stat.label} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <span className="text-gray-600">{stat.label}</span>
                  <span className={`text-2xl font-bold ${stat.color === 'blue' ? 'text-blue-600' : stat.color === 'green' ? 'text-green-600' : 'text-purple-600'}`}>{stat.value}</span>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>
      </div>
      <Card><Card.Header><Card.Title>Report Preview</Card.Title></Card.Header><Card.Content><ReportPreview reportType={selectedReport} exams={displayExams} marks={displayMarks} /></Card.Content></Card>
    </div>
  );
}

export default Reports;