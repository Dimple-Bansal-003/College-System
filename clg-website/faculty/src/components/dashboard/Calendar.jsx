import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { useCalendar } from '../../hooks/useCalendar';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function Calendar({ exams }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const { monthName, currentYear, calendarDays, goToPreviousMonth, goToNextMonth } = useCalendar();

  const getExamsOnDate = (dateStr) => exams.filter((exam) => exam.exam_date === dateStr);
  const selectedExams = selectedDate ? getExamsOnDate(selectedDate) : [];

  return (
    <Card>
      <Card.Header>
        <div className="flex items-center justify-between">
          <Card.Title icon={CalendarIcon}>Exam Calendar</Card.Title>
          <div className="flex items-center gap-2">
            <button onClick={goToPreviousMonth} className="p-2 hover:bg-gray-100 rounded-full"><ChevronLeft size={20} /></button>
            <span className="font-semibold min-w-[140px] text-center">{monthName} {currentYear}</span>
            <button onClick={goToNextMonth} className="p-2 hover:bg-gray-100 rounded-full"><ChevronRight size={20} /></button>
          </div>
        </div>
      </Card.Header>
      <Card.Content>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {WEEKDAYS.map((day) => <div key={day} className="text-center text-sm font-semibold text-gray-500 py-2">{day}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((dayData, index) => {
            const dayExams = dayData.dateStr ? getExamsOnDate(dayData.dateStr) : [];
            const hasExams = dayExams.length > 0;
            return (
              <div key={index} onClick={() => hasExams && setSelectedDate(dayData.dateStr)}
                className={`aspect-square flex flex-col items-center justify-start p-1 rounded-lg text-sm transition-all cursor-pointer
                  ${dayData.day === null ? 'bg-gray-50' : ''} ${dayData.isToday ? 'bg-blue-100 ring-2 ring-blue-500 font-bold' : ''}
                  ${hasExams ? 'bg-amber-100 hover:bg-amber-200' : 'hover:bg-gray-100'}`}>
                {dayData.day && (<><span className={dayData.isToday ? 'text-blue-600' : ''}>{dayData.day}</span>
                  {hasExams && <div className="flex gap-0.5 mt-1">{dayExams.slice(0, 3).map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-orange-500" />)}</div>}</>)}
              </div>
            );
          })}
        </div>
        {selectedDate && selectedExams.length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <h4 className="font-semibold mb-3">{selectedDate}</h4>
            <div className="space-y-2">
              {selectedExams.map((exam, index) => (
                <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start justify-between"><p className="font-semibold">{exam.exam_name}</p>{exam.isSample && <Badge variant="sample">Sample</Badge>}</div>
                  <p className="text-sm text-gray-600">{exam.course} | {exam.semester}</p>
                  <p className="text-sm text-gray-500">🕐 {exam.exam_time} | 📍 {exam.room}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card.Content>
    </Card>
  );
}

export default Calendar;