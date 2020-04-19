import { useState, useEffect } from "react";
import axios from "axios";
import lodash from "lodash";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day });

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointmentsToEdit = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.put(`/api/appointments/${id}`, { interview }).then(() => {
      const daysToLoop = lodash.cloneDeep(state.days);

      const dayOfAppointment = state.day;
      const currentInterview = state.appointments[id].interview;

      for (const day in daysToLoop) {
        if (daysToLoop[day].name === dayOfAppointment && !currentInterview) {
          daysToLoop[day].spots -= 1;
        }
      }
      setState({
        ...state,
        appointments: appointmentsToEdit,
        days: daysToLoop
      });
    });
  }

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    const appointmentsToEdit = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.delete(`/api/appointments/${id}`).then(() => {
      const daysToLoop = lodash.cloneDeep(state.days);

      const dayOfAppointment = state.day;
      for (const day in daysToLoop) {
        if (daysToLoop[day].name === dayOfAppointment) {
          daysToLoop[day].spots += 1;
        }
      }
      setState({
        ...state,
        appointments: appointmentsToEdit,
        days: daysToLoop
      });
    });
  }

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then(all => {
      setState(prev => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data
      }));
    });
  }, []);
  return { state, setDay, bookInterview, cancelInterview };
}
