"use client";
import Layout from "@/components/Layout";
import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

import useFetchUser from "@/lib/hooks/useFetchUser";
import useFetchJobEvents from "@/lib/hooks/useFetchJobEvents";
import { useRouter } from 'next/navigation';
import Swal from "sweetalert2";

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import ShowmoreData from "@/app/pages/job-calendar/ShowmoreData";
import useFetchWorkgroups from "@/lib/hooks/useFetchWorkgroups";


moment.locale("en-GB");
const localizer = momentLocalizer(moment);

const Page = () => {
  const router = useRouter()
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());
  const [refresh, setRefresh] = useState(false)
  const [selectedWorkgroup, setSelectedWorkgroup] = useState("all")
  const { user, isLoading: userLoading, error: userError } = useFetchUser();
  const { workgroups, isLoading: workgroupLoading, error: workgroupError } = useFetchWorkgroups();
  const { events, loading, error } = useFetchJobEvents(selectedWorkgroup, refresh);
  const [open, setOpen] = useState(false)
  const [eventData, setEventData] = useState({})

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
    const backgroundColor = event.color || '#3174ad';
    return { style: { backgroundColor } };
  };

  // Define the onSelectEvent function
  const handleSelectEvent = (event) => {
    if (router) {
      if (event.status_name === 'plan') {
        Swal.fire({
          title: 'Checklist is in plan status',
          text: 'You cannot view the Checklist in plan status',
          icon: 'warning',
          confirmButtonText: 'OK'
        });
      } else if (event.status_name === 'complete') {
        router.push(`/pages/view-jobs?job_id=${event.job_id}&view=true`);
      } else if (event.status_name === 'overdue') {
        Swal.fire({
          title: 'Checklist is overdue',
          text: 'You cannot view the Checklist in overdue status',
          icon: 'warning',
          confirmButtonText: 'OK'
        });
      }
      else if (event.status_name === 'new') {
        router.push(`/pages/view-jobs?job_id=${event.job_id}&view=false`);
      }
      else if (event.status_name === 'ongoing') {
        router.push(`/pages/view-jobs?job_id=${event.job_id}&view=false`);
      }
      else {
        router.push(`/pages/view-jobs?job_id=${event.job_id}&view=true`);
      }
    }
  };

  const handleShowmore = (events, date) => {
    setEventData({ events, date: date.toString() });
    console.log(events, date);
    setOpen(true)
  }

  const close = () => {
    setOpen(false)
  }

  const handleChangeWorkgroup = (e) => {
    setSelectedWorkgroup(e)
    setRefresh(!refresh)
  }

  return (
    <Layout className="container flex flex-col left-0 right-0 mx-auto justify-start font-sans mt-2 px-6">
      <div className="flex justify-between mb-4">
        <div className="flex ">
          <label>
            Date:
            <input
              type="date"
              className="text-sm border border-gray-300 rounded-md p-1 ml-2"
              value={moment(date).format('YYYY-MM-DD')}
              onChange={handleDateChange}
            />
          </label>
          <select 
          className="text-sm border border-gray-300 rounded-md p-1 ml-2"
          onChange={(e) => handleChangeWorkgroup(e.target.value)}
          >
            <option value="" disabled>Select workgroups</option>
            <option value="all">All</option>
            {
              workgroups.map((workgroup) => (
                <option key={workgroup._id} value={workgroup._id}>{workgroup.WORKGROUP_NAME}</option>
              ))
            }
          </select>
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
          onShowMore={(events, date) => handleShowmore(events, date)}
          eventPropGetter={eventPropGetter} // Pass the eventPropGetter function
          onSelectEvent={handleSelectEvent} // Pass the onSelectEvent function
        />
      </div>
      <Modal
        open={open}
        onClose={close}
      >
        <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-3xl max-h-90vh ipadmini:w-1/2 overflow-y-auto p-4 rounded-lg "
          sx={{
            outline: 'none',
          }}
        >
          <ShowmoreData
            data={eventData}
            close={close}
          />
        </Box>
      </Modal>
    </Layout>
  );
};

export default Page;
