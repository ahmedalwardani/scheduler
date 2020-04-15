import React, { useState, useEffect } from "react";
import axios from "axios";

import Appointment from "components/Appointment";
import DayList from "./DayList";

// helpers

import "./Application.scss";

axios.defaults.baseURL = "http://localhost:8001";

const appointments = [
  {
    id: 1,
    time: "12pm"
  },
  {
    id: 2,
    time: "1pm",
    interview: {
      student: "Lydia Miller-Jones",
      interviewer: {
        id: 1,
        name: "Sylvia Palmer",
        avatar: "https://i.imgur.com/LpaY82x.png"
      }
    }
  },
  {
    id: 3,
    time: "2pm",
    interview: {
      student: "Ahmed",
      interviewer: {
        id: 1,
        name: "Sylvia Palmer",
        avatar: "https://i.imgur.com/LpaY82x.png"
      }
    }
  },
  {
    id: 4,
    time: "3pm",
    interview: {
      student: "Ali",
      interviewer: {
        id: 1,
        name: "Sylvia Palmer",
        avatar: "https://i.imgur.com/LpaY82x.png"
      }
    }
  },
  {
    id: 5,
    time: "4pm"
  }
];

export default function Application(props) {
  const [day, setDay] = useState("Monday");
  const [days, setDays] = useState([]);
  useEffect(() => {
    axios
      .get("/api/days")
      .then(response => setDays(response.data))
      .catch(error => console.log(error));
  }, [days]);
  const allAppointments = appointments.map(appointment => (
    <Appointment key={appointment.id} {...appointment} />
  ));
  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={days} day={day} setDay={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {allAppointments}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
