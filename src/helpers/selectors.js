export default function getAppointmentsForDay(state, day) {
  if (state.days.length === 0) {
    return [];
  }

  let isFound = false;
  for (let i = 0; i < state.days.length; i++) {
    if (state.days[i].name === day) {
      isFound = true;
      break;
    }
  }
  if (!isFound) return [];

  const dayAppointments = state.days.filter(weekDay => weekDay.name === day)[0]
    .appointments;

  const dayAppointmentsArray = [];
  for (const dayAppointment of dayAppointments) {
    dayAppointmentsArray.push(state.appointments[dayAppointment]);
  }
  return dayAppointmentsArray;
}
