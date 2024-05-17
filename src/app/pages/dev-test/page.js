"use client";
import Layout from "@/components/Layout";
import React, { useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

moment.locale("en-GB");
const localizer = momentLocalizer(moment);
const events = [
    {
      'title': 'All Day Event very long title',
      'allDay': true,
      'start': new Date(2015, 3, 0),
      'end': new Date(2015, 3, 1)
    },
    {
      'title': 'Long Event',
      'start': new Date(2015, 3, 7),
      'end': new Date(2015, 3, 10)
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
      'start': new Date(2015, 3, 9, 0, 0, 0),
      'end': new Date(2015, 3, 9, 0, 0, 0)
    },
    {
      'title': 'Conference',
      'start': new Date(2015, 3, 11),
      'end': new Date(2015, 3, 13),
      desc: 'Big conference for important people'
    },
    {
      'title': 'Meeting',
      'start': new Date(2015, 3, 12, 10, 30, 0, 0),
      'end': new Date(2015, 3, 12, 12, 30, 0, 0),
      desc: 'Pre-meeting meeting, to prepare for the meeting'
    },
    {
      'title': 'Lunch',
      'start': new Date(2015, 3, 12, 12, 0, 0, 0),
      'end': new Date(2015, 3, 12, 13, 0, 0, 0),
      desc: 'Power lunch'
    },
    {
      'title': 'Meeting',
      'start': new Date(2015, 3, 12, 14, 0, 0, 0),
      'end': new Date(2015, 3, 12, 15, 0, 0, 0)
    },
    {
      'title': 'Happy Hour',
      'start': new Date(2015, 3, 12, 17, 0, 0, 0),
      'end': new Date(2015, 3, 12, 17, 30, 0, 0),
      desc: 'Most important meal of the day'
    },
    {
      'title': 'Dinner',
      'start': new Date(2015, 3, 12, 20, 0, 0, 0),
      'end': new Date(2015, 3, 12, 21, 0, 0, 0)
    },
    {
      'title': 'Birthday Party',
      'start': new Date(2015, 3, 13, 7, 0, 0),
      'end': new Date(2015, 3, 13, 10, 30, 0)
    },
    {
      'title': 'Birthday Party 2',
      'start': new Date(2015, 3, 13, 7, 0, 0),
      'end': new Date(2015, 3, 13, 10, 30, 0)
    },
    {
      'title': 'Birthday Party 3',
      'start': new Date(2015, 3, 13, 7, 0, 0),
      'end': new Date(2015, 3, 13, 10, 30, 0)
    },
    {
      'title': 'Late Night Event',
      'start': new Date(2015, 3, 17, 19, 30, 0),
      'end': new Date(2015, 3, 18, 2, 0, 0)
    },
    {
      'title': 'Multi-day Event',
      'start': new Date(2015, 3, 20, 19, 30, 0),
      'end': new Date(2015, 3, 22, 2, 0, 0)
    }
  ]
  
const Page = () => {
    const [view, setView] = useState('month'); // State to manage current view

    return (
        <Layout className="container flex flex-col left-0 right-0 mx-auto justify-start font-sans mt-2 px-6">
            <div className="flex space-x-2 mb-4">
                <button onClick={() => setView('month')} className="btn">Month View</button>
                <button onClick={() => setView('week')} className="btn">Week View</button>
                <button onClick={() => setView('day')} className="btn">Day View</button>
                <button onClick={() => setView('agenda')} className="btn">Agenda View</button>
            </div>
            <div style={{ height: 700 }}>
                <Calendar
                    localizer={localizer}
                    events={events}
                    step={60}
                    views={['month', 'week', 'day', 'agenda']}
                    view={view}
                    onView={() => {}} 
                    defaultDate={new Date()}
                    onShowMore={(events, date) => console.log(events, date)}
                />
            </div>
        </Layout>
    );
}

export default Page;


