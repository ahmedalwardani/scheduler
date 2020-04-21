import React from "react";
import axios from "axios";

import {
  render,
  cleanup,
  waitForElement,
  fireEvent,
  prettyDOM,
  getByText,
  getAllByTestId,
  getByAltText,
  getByPlaceholderText,
  queryByText,
  queryByAltText
} from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);

    return waitForElement(() => getByText("Monday")).then(() => {
      fireEvent.click(getByText("Tuesday"));
      expect(getByText("Leopold Silvers")).toBeInTheDocument();
    });
  });

  it("loads data, books an interview and reduces the spots remaining for Monday by 1", async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    await waitForElement(() => queryByText(appointment, "Lydia Miller-Jones"));

    const dayToFind = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(dayToFind, "no spots remaining")).toBeInTheDocument();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointmentToFind = getAllByTestId(
      container,
      "appointment"
    ).find(appointment => queryByText(appointment, "Archie Cohen"));

    fireEvent.click(getByAltText(appointmentToFind, "Delete"));
    expect(
      getByText(appointmentToFind, "Delete this interview?")
    ).toBeInTheDocument();
    fireEvent.click(getByText(appointmentToFind, "Confirm"));
    expect(getByText(appointmentToFind, "Deleting")).toBeInTheDocument();
    await waitForElement(() => queryByAltText(appointmentToFind, "Add"));
    const dayToFind = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(dayToFind, "2 spots remaining")).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointmentToFind = getAllByTestId(
      container,
      "appointment"
    ).find(appointment => queryByText(appointment, "Archie Cohen"));

    fireEvent.click(getByAltText(appointmentToFind, "Edit"));

    fireEvent.change(
      getByPlaceholderText(appointmentToFind, /enter student name/i),
      {
        target: { value: "Ahmed" }
      }
    );
    const dayToFind = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    fireEvent.click(getByText(appointmentToFind, "Save"));
    expect(getByText(dayToFind, "1 spot remaining")).toBeInTheDocument();
  });

  it("shows the save error when failing to save an appointment", async () => {
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointmentToFind = getAllByTestId(
      container,
      "appointment"
    ).find(appointment => queryByText(appointment, "Archie Cohen"));
    fireEvent.click(getByAltText(appointmentToFind, "Edit"));

    fireEvent.change(
      getByPlaceholderText(appointmentToFind, /enter student name/i),
      {
        target: { value: "Lydia Miller-Jones" }
      }
    );

    const dayToFind = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    axios.put.mockRejectedValueOnce();
    fireEvent.click(getByText(appointmentToFind, "Save"));
    expect(getByText(dayToFind, "1 spot remaining")).toBeInTheDocument();
    expect(getByText(appointmentToFind, "Saving")).toBeInTheDocument();
    await waitForElement(() => getByText(appointmentToFind, "Error"));
    expect(
      getByText(appointmentToFind, "Could not save appointment")
    ).toBeInTheDocument();

    fireEvent.click(getByAltText(appointmentToFind, "Close"));
    expect(getByText(appointmentToFind, "Archie Cohen")).toBeInTheDocument();
  });

  it("shows the delete error when failing to save an appointment", async () => {
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointmentToFind = getAllByTestId(
      container,
      "appointment"
    ).find(appointment => queryByText(appointment, "Archie Cohen"));

    fireEvent.click(getByAltText(appointmentToFind, "Delete"));
    expect(
      getByText(appointmentToFind, "Delete this interview?")
    ).toBeInTheDocument();
    axios.delete.mockRejectedValueOnce();
    fireEvent.click(getByText(appointmentToFind, "Confirm"));
    expect(getByText(appointmentToFind, "Deleting")).toBeInTheDocument();
    await waitForElement(() => getByText(appointmentToFind, "Error"));
    expect(
      getByText(appointmentToFind, "Could not cancel appointment")
    ).toBeInTheDocument();
    fireEvent.click(getByAltText(appointmentToFind, "Close"));
    expect(getByText(appointmentToFind, "Archie Cohen")).toBeInTheDocument();
  });
});
