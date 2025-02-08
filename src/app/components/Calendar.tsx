'use client'
import React, { useState,useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import { DateClickArg } from "@fullcalendar/interaction";
import { EventClickArg } from '@fullcalendar/core';
import { motion } from "framer-motion";

const Calendar = () => {
    const[events,setEvents] = useState([
        {id:"1",title: "Team Meeting",start: "2025-01-20T10:00:00",end:"2025-01-20T11:00:00"},
        {id:"2",title:"Doctors Appointment",start:"2025-01-21T14:00:00"},
        // {id:"3",title:"Public Holidays",start:"2025-01-25",allDay:true},
    ])

    const handleDateClick = (info: DateClickArg): void => {
        const title = prompt("Enter event title:");
        if (title) {
          setEvents((prevEvents) => [
            ...prevEvents,
            { id: Date.now().toString(), title, start: info.dateStr, allDay: info.allDay },
          ]);
        }
      };

    const handleEventClick=(info:EventClickArg)=>{
        const eventId=info.event.id;
        const eventTitle=info.event.title;
        if(window.confirm(`Do you want to delete the event "${eventTitle}"?`)){
            setEvents((prevEvents)=>prevEvents.filter((events)=>events.id !== eventId))
        }

    }
   

    const fetchHolidays = async () => {
      try {
        const response = await fetch("https://date.nager.at/api/v3/PublicHolidays/2025/US");
        const data = await response.json();
  
        const holidayEvents = data.map((holiday: { date: string; localName: string }) => ({
          id: holiday.date,
          title: holiday.localName,
          start: holiday.date,
          allDay: true
        }));
  
        setEvents((prevEvents) => [...prevEvents, ...holidayEvents]); // Merge with existing events
      } catch (error) {
        console.error("Error fetching holidays:", error);
      }
    };

    useEffect(() => {
      fetchHolidays();
    }, []);

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
        <motion.div
        className='w-full max-w-xl bg-white text-gray-800 rounded-md shadow-md p-2'
        initial={{opacity:0,scale:0.8}}
        animate={{opacity:1,scale:1}}
        exit={{opacity:0,scale:0.8}}
        transition={{duration:0.5}}
        >
      <FullCalendar
        plugins={[dayGridPlugin,timeGridPlugin,interactionPlugin,listPlugin]}
        initialView='dayGridMonth'
        headerToolbar={{
            left:"prev,next today",
            center:"title",
            right:"dayGridMonth,timeGridWeek,timeGridDay,listWeek"
        }}
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        editable={true}
        selectable={true}
      />
      </motion.div>
    </div>
  )
}

export default Calendar
