import React from "react";
import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import Form from "components/Appointment/Form";
import Saving from "components/Appointment/Saving";
import Deleting from "components/Appointment/Deleting";
import useVisualMode from "../../hooks/useVisualMode";
import Confirm from "./Confirm";

import "./styles.scss";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDITING = "EDITING";

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props
      .bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(err => console.log(err));
  }

  function deleteInterview() {
    transition(DELETING);
    props.cancelInterview(props.id).then(() => transition(EMPTY));
  }

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onCancel={() => back()}
          onSave={save}
          onDelete={deleteInterview}
        />
      )}
      {mode === CONFIRM && (
        <Confirm
          message="Delete this interview?"
          onConfirm={deleteInterview}
          onCancel={back}
        />
      )}
      {mode === EDITING && (
        <Form
          interviewers={props.interviewers}
          onCancel={() => back()}
          onSave={save}
          onDelete={deleteInterview}
          name={props.interview.student}
          interviewer={props.interview.interviewer.id}
        />
      )}
      {mode === SAVING && <Saving />}
      {mode === DELETING && <Deleting />}
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => transition(CONFIRM)}
          onEdit={() => transition(EDITING)}
        />
      )}
    </article>
  );
}
