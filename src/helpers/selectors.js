export function getAppointmentsForDay(state, day) {
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

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }
  return {
    student: interview.student,
    interviewer: state.interviewers[interview.interviewer]
  };
}

export function getInterviewersForDay(state, day) {
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

  const dayInterviewers = state.days.filter(weekDay => weekDay.name === day)[0]
    .interviewers;

  const dayInterviewersArray = [];
  for (const dayInterviewer of dayInterviewers) {
    dayInterviewersArray.push(state.interviewers[dayInterviewer]);
  }
  return dayInterviewersArray;
}
