"use client";
import Layout from "@/components/Layout";
import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { RRule } from 'rrule';
import useFetchUser from "@/lib/hooks/useFetchUser";
import useFetchJobEvents from "@/lib/hooks/useFetchJobEvents";
import { useRouter } from 'next/navigation';
import Swal from "sweetalert2";

moment.locale("en-GB");
const localizer = momentLocalizer(moment);

// Define a function to generate recurring events
// const generateRecurringEvents = () => {
//   const rule = new RRule({
//     freq: RRule.WEEKLY,
//     interval: 1,
//     byweekday: [RRule.MO, RRule.FR],
//     dtstart: new Date(2024, 3, 1),
//     until: new Date(2024, 5, 30),
//   });

//   return rule.all().map(date => ({
//     title: 'Recurring Event',
//     start: date,
//     end: new Date(date.getTime() + 60 * 60 * 1000), // 1 hour duration
//     allDay: false,
//     color: '#FF5733', // Add a color property to the event
//     url: '/job/' + date.getTime() // Example URL, you might need to adjust this
//   }));
// };

const Page = () => {
  const router = useRouter()
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

  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value);
    setDate(newDate);
  };

  // Define the eventPropGetter function
  const eventPropGetter = (event) => {
    const backgroundColor = event.color || '#3174ad'; // default color if no color specified
    return { style: { backgroundColor } };
  };

  // Define the onSelectEvent function
  const handleSelectEvent = (event) => {
    if (router) {
      if (event.status_name === 'plan') {
        Swal.fire({
          title: 'Job is in plan status',
          text: 'You can not view the job in plan status',
          icon: 'warning',
          confirmButtonText: 'OK'
        });
      } else if (event.status_name === 'complete') {
        router.push(`/pages/view-jobs?job_id=${event.job_id}&views=true`);
      } else if (event.status_name === 'overdue') {
        Swal.fire({
          title: 'Job is overdue',
          text: 'You can not view the job in overdue status',
          icon: 'warning',
          confirmButtonText: 'OK'
        });
      } else {
        router.push(`/pages/view-jobs?job_id=${event.job_id}&views=true`);
      }
    }
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
      <div style={{ height: 800 }}>
        <Calendar
          localizer={localizer}
          events={[...events]}
          step={60}
          views={['month']}
          view={view}
          onView={handleViewChange}
          date={date}
          onNavigate={handleNavigate}
          onShowMore={(events, date) => console.log(events, date)}
          eventPropGetter={eventPropGetter} // Pass the eventPropGetter function
          onSelectEvent={handleSelectEvent} // Pass the onSelectEvent function
        />
      </div>
    </Layout>
  );
};

export default Page;
