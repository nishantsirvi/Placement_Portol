import React from 'react';

const Calendar = ({ events = [], onEventClick }) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.event_date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const today = () => {
    setCurrentDate(new Date());
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getEventColor = (eventType) => {
    const colors = {
      'DRIVE': '#667eea',
      'DEADLINE': '#ef4444',
      'TEST': '#f59e0b',
      'INTERVIEW': '#8b5cf6',
      'RESULT': '#10b981',
      'OTHER': '#6b7280'
    };
    return colors[eventType] || '#6b7280';
  };

  const renderDays = () => {
    const days = [];
    
    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <div key={`empty-${i}`} style={{
          padding: '0.5rem',
          minHeight: '100px',
          background: '#f9fafb'
        }}></div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayEvents = getEventsForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();
      const isPast = date < new Date() && !isToday;

      days.push(
        <div
          key={day}
          style={{
            padding: '0.5rem',
            minHeight: '100px',
            border: '1px solid #e5e7eb',
            background: isToday ? '#f0f4ff' : 'white',
            opacity: isPast ? 0.6 : 1,
            cursor: dayEvents.length > 0 ? 'pointer' : 'default',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            if (dayEvents.length > 0) {
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div style={{
            fontWeight: isToday ? 'bold' : 'normal',
            marginBottom: '0.25rem',
            fontSize: '0.875rem',
            color: isToday ? '#667eea' : '#374151'
          }}>
            {day}
          </div>
          {dayEvents.map((event, idx) => (
            <div
              key={idx}
              onClick={() => onEventClick && onEventClick(event)}
              style={{
                background: getEventColor(event.event_type),
                color: 'white',
                padding: '0.25rem 0.5rem',
                marginBottom: '0.25rem',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: '500',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                cursor: 'pointer'
              }}
              title={event.title}
            >
              {event.title}
            </div>
          ))}
        </div>
      );
    }

    return days;
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    }}>
      {/* Calendar Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
          {monthNames[month]} {year}
        </h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={prevMonth}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.5rem 1rem' }}
          >
            ← Prev
          </button>
          <button
            onClick={today}
            className="btn btn-primary btn-sm"
            style={{ padding: '0.5rem 1rem' }}
          >
            Today
          </button>
          <button
            onClick={nextMonth}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.5rem 1rem' }}
          >
            Next →
          </button>
        </div>
      </div>

      {/* Legend */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        padding: '1rem 1.5rem',
        borderBottom: '1px solid #e5e7eb',
        flexWrap: 'wrap',
        fontSize: '0.75rem'
      }}>
        {[
          { type: 'DRIVE', label: 'Drive' },
          { type: 'DEADLINE', label: 'Deadline' },
          { type: 'TEST', label: 'Test' },
          { type: 'INTERVIEW', label: 'Interview' },
          { type: 'RESULT', label: 'Result' },
          { type: 'OTHER', label: 'Other' }
        ].map(({ type, label }) => (
          <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '2px',
              background: getEventColor(type)
            }}></div>
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* Day Names */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        background: '#f9fafb',
        borderBottom: '1px solid #e5e7eb'
      }}>
        {dayNames.map(day => (
          <div
            key={day}
            style={{
              padding: '0.75rem',
              textAlign: 'center',
              fontWeight: '600',
              fontSize: '0.875rem',
              color: '#6b7280'
            }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)'
      }}>
        {renderDays()}
      </div>
    </div>
  );
};

export default Calendar;
