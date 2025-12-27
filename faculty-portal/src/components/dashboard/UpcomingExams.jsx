import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarClock, Calendar, Clock, MapPin, Plus } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

function UpcomingExams({ exams }) {
  const navigate = useNavigate();
  const upcomingExams = exams.slice(0, 5);

  return (
    <Card>
      <Card.Header><Card.Title icon={CalendarClock}>Upcoming Exams</Card.Title></Card.Header>
      <Card.Content>
        <div className="space-y-3">
          {upcomingExams.map((exam, index) => (
            <div key={index} className={`p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors ${exam.isSample ? 'border-l-4 border-amber-400' : ''}`}>
              <div className="flex items-start justify-between"><p className="font-medium text-sm">{exam.exam_name}</p>{exam.isSample && <Badge variant="sample">Sample</Badge>}</div>
              <p className="text-xs text-gray-500">{exam.course} • {exam.semester}</p>
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-600"><Calendar size={12} />{exam.exam_date}<Clock size={12} className="ml-2" />{exam.exam_time}</div>
              <div className="flex items-center gap-2 text-xs text-gray-600"><MapPin size={12} />{exam.room}</div>
            </div>
          ))}
        </div>
        <Button variant="secondary" className="w-full mt-4" onClick={() => navigate('/scheduling')}><Plus size={16} />Add New Exam</Button>
      </Card.Content>
    </Card>
  );
}

export default UpcomingExams;