"use client";
import Layout from "@/components/Layout";
import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { RRule } from 'rrule';
import useFetchUser from "@/lib/hooks/useFetchUser";
import useFetchJobEvents from "@/lib/hooks/useFetchJobEvents";

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
    color: '#FF5733' // Add a color property to the event
  }));
};

// Generate the recurring events
const recurringEvents = generateRecurringEvents();

// const events = [
//   {
//     title: 'All Day Event very long title',
//     allDay: true,
//     start: new Date(2024, 3, 1),
//     end: new Date(2024, 3, 1),
//     color: '#FFD700'
//   },
//   {
//     title: 'Long Event',
//     start: new Date(2024, 3, 7),
//     end: new Date(2024, 3, 10),
//     color: '#DAF7A6'
//   },
//   {
//     title: 'Some Event',
//     start: new Date(2024, 3, 9),
//     end: new Date(2024, 3, 9),
//     color: '#FFC300'
//   },
//   {
//     title: 'Conference',
//     start: new Date(2024, 3, 11),
//     end: new Date(2024, 3, 13),
//     desc: 'Big conference for important people',
//     color: '#C70039'
//   },
//   // Add other events similarly with color property
// ];

const Page = () => {
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());
  const { user, isLoading: userLoading, error: userError } = useFetchUser();
  const { events, loading, error } = useFetchJobEvents(user.workgroup_id);

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

  // Define the eventPropGetter function
  const eventPropGetter = (event) => {
    const backgroundColor = event.color || '#3174ad'; // default color if no color specified
    return { style: { backgroundColor } };
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
          views={['month']}
          view={view}
          onView={handleViewChange}
          date={date}
          onNavigate={handleNavigate}
          onShowMore={(events, date) => console.log(events, date)}
          eventPropGetter={eventPropGetter} // Pass the eventPropGetter function
        />
      </div>
    </Layout>
  );
};

export default Page;
