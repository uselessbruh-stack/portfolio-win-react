import React, { useState, useEffect } from 'react';
import './Calendar.css';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [holidays, setHolidays] = useState([]);
  const [view, setView] = useState('month'); // 'month', 'year'
  const [yearView, setYearView] = useState(new Date().getFullYear());

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Fetch holidays for the current year
  useEffect(() => {
    fetchHolidays(currentDate.getFullYear());
  }, [currentDate]);

  const fetchHolidays = async (year) => {
    try {
      // Using Nager.Date API for Indian public holidays
      // https://date.nager.at/api/v3/publicholidays/{year}/IN
      const response = await fetch(`https://date.nager.at/api/v3/publicholidays/${year}/IN`);
      const data = await response.json();
      setHolidays(data);
    } catch (error) {
      console.error('Failed to fetch holidays:', error);
      // Set some default Indian holidays if API fails
      setHolidays([
        { date: `${year}-01-26`, name: "Republic Day" },
        { date: `${year}-08-15`, name: "Independence Day" },
        { date: `${year}-10-02`, name: "Gandhi Jayanti" },
        { date: `${year}-12-25`, name: "Christmas Day" },
      ]);
    }
  };

  const isHoliday = (date) => {
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return holidays.find(h => h.date === dateStr);
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    // Adjust for Monday start (0=Sun becomes 6, 1=Mon becomes 0, etc.)
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return { firstDay: adjustedFirstDay, daysInMonth };
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevYear = () => {
    if (view === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1));
    } else {
      setYearView(yearView - 12);
    }
  };

  const nextYear = () => {
    if (view === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), 1));
    } else {
      setYearView(yearView + 12);
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
    setView('month');
  };

  const selectMonth = (monthIndex) => {
    setCurrentDate(new Date(yearView, monthIndex, 1));
    setView('month');
  };

  const selectYear = (year) => {
    setYearView(year);
    setCurrentDate(new Date(year, currentDate.getMonth(), 1));
    setView('months');
  };

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear();
  };

  const isSelected = (day) => {
    if (!selectedDate) return false;
    return day === selectedDate.getDate() &&
      currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear();
  };

  const handleDayClick = (day) => {
    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
  };

  const renderMonthView = () => {
    const { firstDay, daysInMonth } = getDaysInMonth(currentDate);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayOfWeek = date.getDay(); // 0=Sun, 6=Sat
      const holiday = isHoliday(date);
      const classes = ['calendar-day'];

      if (isToday(day)) classes.push('today');
      if (isSelected(day)) classes.push('selected');
      if (holiday) classes.push('holiday');
      if (dayOfWeek === 0 || dayOfWeek === 6) classes.push('weekend'); // Sunday or Saturday

      days.push(
        <div
          key={day}
          className={classes.join(' ')}
          onClick={() => handleDayClick(day)}
          title={holiday ? holiday.name : ''}
        >
          <span className="day-number">{day}</span>
          {holiday && <span className="holiday-indicator">●</span>}
        </div>
      );
    }

    return days;
  };

  const renderYearView = () => {
    const years = [];
    const startYear = Math.floor(yearView / 12) * 12;

    for (let i = 0; i < 12; i++) {
      const year = startYear + i;
      const isCurrentYear = year === new Date().getFullYear();

      years.push(
        <div
          key={year}
          className={`year-item ${isCurrentYear ? 'current' : ''}`}
          onClick={() => selectYear(year)}
        >
          {year}
        </div>
      );
    }

    return years;
  };

  const renderMonthGrid = () => {
    return monthNames.map((month, index) => {
      const isCurrentMonth = index === new Date().getMonth() &&
        yearView === new Date().getFullYear();

      return (
        <div
          key={month}
          className={`month-item ${isCurrentMonth ? 'current' : ''}`}
          onClick={() => selectMonth(index)}
        >
          {month}
        </div>
      );
    });
  };

  const getUpcomingHolidays = () => {
    const today = new Date();
    return holidays
      .filter(h => {
        const holidayDate = new Date(h.date);
        return holidayDate >= today;
      })
      .slice(0, 5);
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <div className="calendar-nav">
          <button className="calendar-nav-btn" onClick={prevYear} title="Previous Year">«</button>
          <button className="calendar-nav-btn" onClick={prevMonth} title="Previous Month">‹</button>
          <div className="calendar-title">
            <button
              className="calendar-month-btn"
              onClick={() => setView(view === 'month' ? 'year' : view === 'year' ? 'month' : 'month')}
            >
              {view === 'month'
                ? `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`
                : view === 'year'
                  ? `${Math.floor(yearView / 12) * 12} - ${Math.floor(yearView / 12) * 12 + 11}`
                  : `${currentDate.getFullYear()}`
              }
            </button>
          </div>
          <button className="calendar-nav-btn" onClick={nextMonth} title="Next Month">›</button>
          <button className="calendar-nav-btn" onClick={nextYear} title="Next Year">»</button>
        </div>
        <button className="today-btn" onClick={goToToday}>Today</button>
      </div>

      <div className="calendar-content">
        <div className="calendar-main">
          {view === 'month' ? (
            <>
              <div className="calendar-weekdays">
                {dayNames.map(day => (
                  <div key={day} className="weekday-header">{day}</div>
                ))}
              </div>
              <div className="calendar-grid">
                {renderMonthView()}
              </div>
            </>
          ) : view === 'year' ? (
            <div className="year-grid">
              {renderYearView()}
            </div>
          ) : view === 'months' ? (
            <div className="month-grid">
              {renderMonthGrid()}
            </div>
          ) : null}
        </div>        <div className="calendar-sidebar">
          <div className="selected-date-info">
            <h3>
              {selectedDate
                ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                : 'Select a date'
              }
            </h3>
          </div>

          <div className="upcoming-holidays">
            <h4>Upcoming Holidays</h4>
            <div className="holidays-list">
              {getUpcomingHolidays().length > 0 ? (
                getUpcomingHolidays().map((holiday, index) => (
                  <div key={index} className="holiday-item">
                    <div className="holiday-date">
                      {new Date(holiday.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="holiday-name">{holiday.name}</div>
                  </div>
                ))
              ) : (
                <p className="no-holidays">No upcoming holidays</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
