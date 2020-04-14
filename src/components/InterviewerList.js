import React from "react";
import InterviewerListItem from "./InterviewerListItem";
import "./InterviewerList.scss";

export default function InterviewerList(props) {
  const interviewers = props.interviewers.map(interviewer => (
    <InterviewerListItem
      key={interviewer.id}
      value={interviewer.name}
      avatar={interviewer.avatar}
      selected={interviewer.id === props.value}
      onChange={() => props.onChange(interviewer.id)}
    />
  ));
  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">{interviewers}</ul>
    </section>
  );
}
