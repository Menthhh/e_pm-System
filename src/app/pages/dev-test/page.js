"use client";
import Layout from "@/components/Layout";
import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { RRule } from 'rrule';

moment.locale("en-GB");
const localizer = momentLocalizer(moment);

// Define a function to generate recurring events
const generateRecurringEvents = () => {
  const rule = new RRule({
    freq: RRule.WEEKLY,
    interval: 1,
    byweekday: [RRule.MO, RRule.FR],
    dtstart: new Date(2024, 3, 1),
    until: new Date(2024, 5, 30),
  });

  return rule.all().map(date => ({
    title: 'Recurring Event',
    start: date,
    end: new Date(date.getTime() + 60 * 60 * 1000), // 1 hour duration
    allDay: false,
  }));
};

// Generate the recurring events
const recurringEvents = generateRecurringEvents();

const events = [
  {
    'title': 'All Day Event very long title',
    'allDay': true,
    'start': new Date(2024, 3, 1),
    'end': new Date(2024, 3, 1)
  },
  {
    'title': 'Long Event',
    'start': new Date(2024, 3, 7),
    'end': new Date(2024, 3, 10)
  },
  {
    'title': 'DTS STARTS',
    'start': new Date(2016, 2, 13, 0, 0, 0),
    'end': new Date(2016, 2, 20, 0, 0, 0)
  },
  {
    'title': 'DTS ENDS',
    'start': new Date(2016, 10, 6, 0, 0, 0),
    'end': new Date(2016, 10, 13, 0, 0, 0)
  },
  {
    'title': 'Some Event',
    'start': new Date(2024, 3, 9, 0, 0, 0),
    'end': new Date(2024, 3, 9, 0, 0, 0)
  },
  {
    'title': 'Conference',
    'start': new Date(2024, 3, 11),
    'end': new Date(2024, 3, 13),
    desc: 'Big conference for important people'
  },
  {
    'title': 'Meeting',
    'start': new Date(2024, 3, 12, 10, 30, 0, 0),
    'end': new Date(2024, 3, 12, 12, 30, 0, 0),
    desc: 'Pre-meeting meeting, to prepare for the meeting '
  },
  {
    'title': 'Lunch',
    'start': new Date(2024, 3, 12, 12, 0, 0, 0),
    'end': new Date(2024, 3, 12, 13, 0, 0, 0),
    desc: 'Power lunch'
  },
  {
    'title': 'Meeting',
    'start': new Date(2024, 3, 12, 14, 0, 0, 0),
    'end': new Date(2024, 3, 12, 15, 0, 0, 0)
  },
  {
    'title': 'Happy Hour',
    'start': new Date(2024, 3, 12, 17, 0, 0, 0),
    'end': new Date(2024, 3, 12, 17, 30, 0, 0),
    desc: 'Most important meal of the day'
  },
  {
    'title': 'Dinner',
    'start': new Date(2024, 3, 12, 20, 0, 0, 0),
    'end': new Date(2024, 3, 12, 21, 0, 0, 0)
  },
  {
    'title': 'Birthday Party',
    'start': new Date(2024, 3, 13, 7, 0, 0),
    'end': new Date(2024, 3, 13, 10, 30, 0)
  },
  {
    'title': 'Birthday Party 2',
    'start': new Date(2024, 3, 13, 7, 0, 0),
    'end': new Date(2024, 3, 13, 10, 30, 0)
  },
  {
    'title': 'Birthday Party 3',
    'start': new Date(2024, 3, 13, 7, 0, 0),
    'end': new Date(2024, 3, 13, 10, 30, 0)
  },
  {
    'title': 'Late Night Event',
    'start': new Date(2024, 3, 17, 19, 30, 0),
    'end': new Date(2024, 3, 18, 2, 0, 0)
  },
  {
    'title': 'Multi-day Event',
    'start': new Date(2024, 3, 20, 19, 30, 0),
    'end': new Date(2024, 3, 22, 2, 0, 0)
  }
];

const Page = () => {
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());

  const handleViewChange = (newView) => {
    setView(newView);
  };

  const handleNavigate = (newDate) => {
    setDate(newDate);
  };

  const handleMonthChange = (e) => {
    const newMonth = parseInt(e.target.value);
    const newDate = new Date(date.getFullYear(), newMonth, 1);
    setDate(newDate);
  };

  const handleYearChange = (e) => {
    const newYear = parseInt(e.target.value);
    const newDate = new Date(newYear, date.getMonth(), 1);
    setDate(newDate);
  };

  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value);
    setDate(newDate);
  };

  return (
    <Layout className="container flex flex-col left-0 right-0 mx-auto justify-start font-sans mt-2 px-6">
      <div className="flex justify-between mb-4">
        <div>
          <label>
            Date:
            <input
              type="date"
              value={moment(date).format('YYYY-MM-DD')}
              onChange={handleDateChange}
            />
          </label>
        </div>
      </div>
      <div style={{ height: 700 }}>
        <Calendar
          localizer={localizer}
          events={[...events, ...recurringEvents]}
          step={60}
          views={['month', 'week', 'day', 'agenda']}
          view={view}
          onView={handleViewChange}
          date={date}
          onNavigate={handleNavigate}
          onShowMore={(events, date) => console.log(events, date)}
        />
      </div>
    </Layout>
  );
};

export default Page;
