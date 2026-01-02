import { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function ExamCalendar({ exams = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // Sample exam data - replace with actual data from props or context
  const sampleExams = exams.length > 0 ? exams : [
    { id: 1, subject: 'Mathematics', date: '2024-01-15', time: '10:00 AM', venue: 'Hall A', type: 'Mid-Term' },
    { id: 2, subject: 'Physics', date: '2024-01-18', time: '2:00 PM', venue: 'Hall B', type: 'Internal' },
    { id: 3, subject: 'Chemistry', date: '2024-01-22', time: '10:00 AM', venue: 'Lab 1', type: 'Practical' },
    { id: 4, subject: 'English', date: '2024-01-25', time: '11:00 AM', venue: 'Hall A', type: 'End-Term' },
    { id: 5, subject: 'Computer Science', date: '2024-01-28', time: '9:00 AM', venue: 'Lab 2', type: 'Practical' },
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  const formatDateKey = (y, m, d) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const getExamsForDate = (dateKey) => sampleExams.filter(exam => exam.date === dateKey);

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  const getTypeColor = (type) => {
    const colors = {
      'Internal': 'bg-blue-500',
      'Mid-Term': 'bg-yellow-500',
      'End-Term': 'bg-red-500',
      'Practical': 'bg-green-500',
      'Viva': 'bg-purple-500'
    };
    return colors[type] || 'bg-gray-500';
  };

  // Generate calendar days
  const calendarDays = [];
  
  // Previous month padding
  for (let i = 0; i < firstDayWeekday; i++) {
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    calendarDays.push({ day: prevMonthLastDay - firstDayWeekday + i + 1, isCurrentMonth: false });
  }
  
  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = formatDateKey(year, month, day);
    calendarDays.push({ day, isCurrentMonth: true, dateKey, exams: getExamsForDate(dateKey) });
  }
  
  // Next month padding
  const remainingDays = 42 - calendarDays.length;
  for (let i = 1; i <= remainingDays; i++) {
    calendarDays.push({ day: i, isCurrentMonth: false });
  }

  const selectedDateExams = selectedDate ? getExamsForDate(selectedDate) : [];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Exam Calendar</h3>
          <button 
            onClick={goToToday}
            className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors"
          >
            Today
          </button>
        </div>
        <div className="flex items-center justify-between">
          <button onClick={prevMonth} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <FiChevronLeft size={20} />
          </button>
          <span className="font-medium">{monthNames[month]} {year}</span>
          <button onClick={nextMonth} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <FiChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-3">
        {/* Day Headers */}
        <div className="grid grid-cols-7 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((item, index) => {
            const hasExams = item.exams && item.exams.length > 0;
            const isSelected = selectedDate === item.dateKey;
            
            return (
              <div
                key={index}
                onClick={() => item.isCurrentMonth && setSelectedDate(item.dateKey)}
                className={`
                  relative aspect-square flex flex-col items-center justify-center rounded-lg text-sm cursor-pointer transition-all
                  ${!item.isCurrentMonth ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-100'}
                  ${isToday(item.day) && item.isCurrentMonth ? 'bg-primary-100 text-primary-700 font-bold' : ''}
                  ${isSelected ? 'ring-2 ring-primary-500 bg-primary-50' : ''}
                  ${hasExams ? 'font-semibold' : ''}
                `}
              >
                <span>{item.day}</span>
                {hasExams && (
                  <div className="flex gap-0.5 mt-0.5">
                    {item.exams.slice(0, 3).map((exam, i) => (
                      <span 
                        key={i} 
                        className={`w-1.5 h-1.5 rounded-full ${getTypeColor(exam.type)}`}
                        title={exam.subject}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t border-gray-100">
          {['Internal', 'Mid-Term', 'End-Term', 'Practical'].map(type => (
            <div key={type} className="flex items-center gap-1.5 text-xs text-gray-600">
              <span className={`w-2 h-2 rounded-full ${getTypeColor(type)}`}></span>
              {type}
            </div>
          ))}
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <h4 className="font-semibold text-gray-800 mb-3">
            {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h4>
          
          {selectedDateExams.length > 0 ? (
            <div className="space-y-2">
              {selectedDateExams.map(exam => (
                <div 
                  key={exam.id} 
                  className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="font-medium text-gray-800">{exam.subject}</h5>
                      <p className="text-sm text-gray-500">{exam.time} • {exam.venue}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs text-white ${getTypeColor(exam.type)}`}>
                      {exam.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">No exams scheduled for this date</p>
          )}
        </div>
      )}
    </div>
  );
}