import React from 'react';
import PaperUploadForm from './PaperUploadForm';
import PaperCard from './PaperCard';
import Card from '../ui/Card';
import { useApp } from '../../contexts/AppContext';
import { getSamplePapers } from '../../data/sampleData';
import { Upload, Info } from 'lucide-react';

function QuestionPapers() {
  const { questionPapers } = useApp();
  const displayPapers = questionPapers.length > 0 ? questionPapers : getSamplePapers();
  const showingSample = questionPapers.length === 0;

  return (
    <div className="space-y-6">
      <Card><Card.Header><Card.Title icon={Upload}>Upload Question Paper</Card.Title></Card.Header><Card.Content><PaperUploadForm /></Card.Content></Card>
      <Card>
        <Card.Header><Card.Title>Uploaded Question Papers</Card.Title></Card.Header>
        <Card.Content>
          {showingSample && <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 flex items-center gap-2"><Info className="text-amber-600" size={20} /><p className="text-sm text-amber-700">Showing sample data.</p></div>}
          {displayPapers.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{displayPapers.map((paper) => <PaperCard key={paper.id} paper={paper} />)}</div> : <p className="text-gray-500 text-center py-12">No papers uploaded.</p>}
        </Card.Content>
      </Card>
    </div>
  );
}

export default QuestionPapers;