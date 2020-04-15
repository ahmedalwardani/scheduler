import React, { useState, useEffect } from "react";
import axios from "axios";

import Appointment from "components/Appointment";
import getAppointmentsForDay from "helpers/selectors";
import DayList from "./DayList";

// helpers

import "./Application.scss";

axios.defaults.baseURL = "http://localhost:8001";

export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  });

  const appointments = getAppointmentsForDay(state, state.day);

  const setDay = day => setState({ ...state, day });

  useEffect(() => {
    Promise.all([axios.get("/api/days"), axios.get("/api/appointments")]).then(
      all => {
        console.log("all results", all);
        setState({ ...state, days: all[0].data, appointments: all[1].data });
      }
    );
    /* eslint-disable */
  }, []);
  /* eslint-enable */

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
          <DayList days={state.days} day={state.day} setDay={setDay} />
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
