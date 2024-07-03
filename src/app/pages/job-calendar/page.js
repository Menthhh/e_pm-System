"use client";
import Layout from "@/components/Layout";
import React, { useEffect, useState } from "react";
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

import Image from "next/image";

moment.locale("en-GB");
const localizer = momentLocalizer(moment);

const Page = () => {
  const router = useRouter();
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());
  const [refresh, setRefresh] = useState(false);
  const [selectedWorkgroup, setSelectedWorkgroup] = useState("");
  const { user, isLoading: userLoading, error: userError } = useFetchUser();
  const { workgroups, isLoading: workgroupLoading, error: workgroupError } = useFetchWorkgroups();
  const { events, loading, error } = useFetchJobEvents(selectedWorkgroup, refresh);
  const [open, setOpen] = useState(false);
  const [eventData, setEventData] = useState({});

  useEffect(() => {
    if (user && user.workgroup_id) {
      setSelectedWorkgroup(user.workgroup_id);
      setRefresh(!refresh);
    }
  }, [user.workgroup_id]);

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

  // Define the dayPropGetter function
  const dayPropGetter = (date) => {
    const isCurrentDate = moment(date).isSame(new Date(), 'day');
    return {
      style: {
        border: isCurrentDate ? '2px solid #bebebe' : undefined,
        backgroundColor: isCurrentDate ? 'white' : undefined,
        boxShadow: isCurrentDate ? '0px 4px 8px rgba(0, 0, 0, 0.2)' : undefined,
        padding: '1em',
      },
    };
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
      } else if (event.status_name === 'new') {
        router.push(`/pages/view-jobs?job_id=${event.job_id}&view=false`);
      } else if (event.status_name === 'ongoing') {
        router.push(`/pages/view-jobs?job_id=${event.job_id}&view=false`);
      } else if (event.status_name === 'waiting for approval') {
        Swal.fire({
          title: 'Checklist is waiting for approval',
          text: 'You cannot view the Checklist in waiting for approval status',
          icon: 'warning',
          confirmButtonText: 'OK'
        });
      } else if (event.status_name === 'renew') {
        router.push(`/pages/job-renew?job_id=${event.job_id}`);
      } else {
        router.push(`/pages/view-jobs?job_id=${event.job_id}&view=true`);
      }
    }
  };

  const handleShowmore = (events, date) => {
    setEventData({ events, date: date.toString() });
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
  };

  const handleChangeWorkgroup = (e) => {
    setSelectedWorkgroup(e);
    setRefresh(!refresh);
  };

  return (
    <Layout className="container flex flex-col left-0 right-0 mx-auto justify-start font-sans mt-2 px-6">
      <div className="flex flex-col items-start gap-4 mb-4 p-4 bg-white ">
        <div className="flex items-center gap-4">
          <Image src="/assets/card-logo/calendar.png" alt="wd logo" width={50} height={50} />
          <h1 className="text-3xl font-bold text-slate-900">ChecklistPM-Calendar</h1>
        </div>
        <h1 className="text-sm font-bold text-secondary flex  items-center">Details on activation dates for all checklists.</h1>
      </div>
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
          <label className="ml-4">
            Workgroup:
            <select
              className="text-sm border border-gray-300 rounded-md p-1 ml-2"
              onChange={(e) => handleChangeWorkgroup(e.target.value)}
            >
              <option value="" disabled>Select workgroups</option>
              <option value="all">All</option>
              {workgroups.map((workgroup) => (
                <option key={workgroup._id} value={workgroup._id} selected={user.workgroup_id === workgroup._id}>
                  {workgroup.WORKGROUP_NAME}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center" title="New: The checklist that has just activated, and no one hasn't edited yet.">
            <span className="w-4 h-4 inline-block mr-2 rounded-full" style={{ backgroundColor: '#0081ff' }}></span>
            <span>New</span>
          </div>
          <div className="flex items-center" title="Ongoing: The checklist is being edited by some checker.">
            <span className="w-4 h-4 inline-block mr-2 rounded-full" style={{ backgroundColor: '#E76E03' }}></span>
            <span>Ongoing</span>
          </div>
          <div className="flex items-center" title="Plan: The checklist hasn't been activated, but it will activate at the time it's set.">
            <span className="w-4 h-4 inline-block mr-2 rounded-full" style={{ backgroundColor: '#D5DBDB' }}></span>
            <span>Plan</span>
          </div>
          <div className="flex items-center" title="Waiting for approval: The checklist has been submitted and is waiting for approval.">
            <span className="w-4 h-4 inline-block mr-2 rounded-full" style={{ backgroundColor: '#FFBB61' }}></span>
            <span>Waiting for approval</span>
          </div>
          <div className="flex items-center" title="Complete: The checklist has been approved.">
            <span className="w-4 h-4 inline-block mr-2 rounded-full" style={{ backgroundColor: '#82E0AA' }}></span>
            <span>Complete</span>
          </div>
          <div className="flex items-center" title="Retake: The checklist has been rejected and needs to be retaken.">
            <span className="w-4 h-4 inline-block mr-2 rounded-full" style={{ backgroundColor: '#FFD700' }}></span>
            <span>Retake</span>
          </div>
          <div className="flex items-center" title="Overdue: The checklist has exceeded the timeout.">
            <span className="w-4 h-4 inline-block mr-2 rounded-full" style={{ backgroundColor: '#ff0000' }}></span>
            <span>Overdue</span>
          </div>
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
          eventPropGetter={eventPropGetter}
          dayPropGetter={dayPropGetter}
          onSelectEvent={handleSelectEvent}
        />
      </div>
      <Modal
        open={open}
        onClose={close}
      >
        <Box
          className="absolute top-1/2 left-1/2 transform -translate-x-1/4 -translate-y-1/2  max-w-3xl w-full max-h-90vh overflow-y-auto p-4 rounded-lg "
          sx={{ outline: 'none' }}
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
