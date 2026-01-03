import { useState } from 'react';
import { FiInfo, FiSave } from 'react-icons/fi';
import PageHeader from '../common/PageHeader';
import { useApp } from '../../context/AppContext';

export default function GracingMarks() {
  const { showNotification } = useApp();
  const [semester, setSemester] = useState('');
  const [gracingPercentage, setGracingPercentage] = useState(5);

  const handleApply = () => { if (!semester) { showNotification('Please select a semester', 'warning'); return; } showNotification('Gracing applied successfully'); };

  return (
    <div>
      <PageHeader title="Gracing Marks" subtitle="Configure and apply gracing percentage to internal marks" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Gracing Configuration</h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"><div className="flex gap-2"><FiInfo className="text-blue-600 mt-0.5" /><p className="text-sm text-blue-700">Gracing percentage is divided equally among all subjects and applied to internal marks only.</p></div></div>
          <div className="mb-4"><label className="block text-sm font-medium text-gray-700 mb-1">Semester</label><select className="input-field" value={semester} onChange={(e) => setSemester(e.target.value)}><option value="">Select Semester</option>{[1,2,3,4,5,6].map(s => <option key={s} value={s}>Semester {s}</option>)}</select></div>
          <div className="mb-6"><label className="block text-sm font-medium text-gray-700 mb-2">Gracing Percentage: <strong>{gracingPercentage}%</strong></label><input type="range" min="0" max="15" step="0.5" value={gracingPercentage} onChange={(e) => setGracingPercentage(parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" /><div className="flex justify-between text-xs text-gray-500 mt-1"><span>0%</span><span>5%</span><span>10%</span><span>15%</span></div></div>
          <button onClick={handleApply} disabled={!semester} className="btn-primary w-full flex items-center justify-center gap-2"><FiSave size={18} /> Apply Gracing</button>
        </div>
        <div className="lg:col-span-2 card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Gracing Rules</h3>
          <ul className="space-y-3 text-gray-600">{['Gracing is applied to internal marks only', 'Percentage is divided equally among all subjects', 'Grace marks cannot exceed the subject\'s maximum marks', 'Only students within gracing range will benefit', 'Applied grace marks are shown separately in reports'].map((rule, i) => <li key={i} className="flex items-start gap-2"><span className="w-2 h-2 bg-primary-600 rounded-full mt-2"></span><span>{rule}</span></li>)}</ul>
          <div className="mt-6 p-4 bg-gray-50 rounded-lg"><h4 className="font-medium text-gray-800 mb-2">Example:</h4><p className="text-sm text-gray-600">If gracing is 5% and there are 5 subjects, each subject gets 1% gracing. For a subject with 100 max marks, the grace would be 1 mark maximum.</p></div>
        </div>
      </div>
    </div>
  );
}