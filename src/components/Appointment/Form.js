import React, { useState } from "react";
import InterviewerList from "components/InterviewerList";
import Button from "components/Button";

export default function Form(props) {
  // Set states for interviewer, student name, and error
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  const [name, setName] = useState(props.name || "");
  const [error, setError] = useState("");

  // Clear name input and set interviewer to null when user clicks on "cancel" to cancel scheduling an interview
  const resetState = () => {
    setInterviewer(null);
    setName("");
  };

  // Reset state upon interview canceling
  const cancel = () => {
    resetState();
    props.onCancel();
  };

  // Ensure user enters a name to schedule an interview
  function validate() {
    if (name === "") {
      setError("Student name cannot be blank");
      return;
    }

    if (interviewer === null) {
      setError("Interviewer cannot be blank");
      return;
    }

    setError("");
    props.onSave(name, interviewer);
  }

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form onSubmit={event => event.preventDefault()} autoComplete="off">
          <input
            className="appointment__create-input text--semi-bold"
            value={name}
            name="name"
            type="text"
            placeholder="Enter Student Name"
            onChange={event => setName(event.target.value)}
            data-testid="student-name-input"
          />
        </form>
        <section className="appointment__validation">{error}</section>
        <InterviewerList
          interviewers={props.interviewers}
          value={interviewer}
          onChange={setInterviewer}
        />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={cancel}>
            Cancel
          </Button>
          <Button confirm onClick={validate}>
            Save
          </Button>
        </section>
      </section>
    </main>
  );
}
