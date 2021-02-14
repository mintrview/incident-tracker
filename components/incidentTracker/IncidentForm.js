import React, { useState } from "react";
import styled from "styled-components";
import Datetime from "react-datetime";
import Loader from "react-loader-spinner";
import { FormContainer } from "../common/Form";
import moment from "moment";
import { PrimaryButton } from "../common/Button";

const IncidentFormNotification = styled.div`
  color: ${(props) => (props.type === "error" ? "#c14c31" : "#4c8649")};
  margin: 10px 0px;
  padding: 8px;
  font-size: 12px;
  text-align: center;
`;

/**
 * Form to submit new incidents.
 */
export default function IncidentForm({ onIncidentAdded }) {
  const [vin, setVin] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDatetime] = useState(moment.now());
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Handler to submit new incidents.
  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/incident", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vin, date, notes }),
      });

      const incident = await response.json();
      if (incident.error) {
        setNotification({ type: "error", text: incident.error });
      } else {
        setNotification({
          type: "info",
          text: `Added incident for VIN ${vin}`,
        });
        onIncidentAdded(incident);
      }
    } catch (ex) {
      setNotification({ type: "error", text: ex.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormContainer onSubmit={onSubmit}>
      <label htmlFor="vin">VIN</label>
      <input id="vin" value={vin} onChange={(e) => setVin(e.target.value)} type="text" required></input>
      <label htmlFor="incident_form_date">Date</label>
      <Datetime
        inputProps={{ id: "incident_form_date" }}
        value={date}
        onChange={setDatetime}
        isValidDate={(selectedDate) => selectedDate.isSameOrBefore(moment.now())}
      />
      <label htmlFor="notes">Notes</label>
      <textarea value={notes} id="notes" onChange={(e) => setNotes(e.target.value)} required></textarea>
      <PrimaryButton disabled={isLoading} type="submit">
        {isLoading ? <Loader type="Puff" color="#fff" height={25} width={25} /> : <span>Add Incident</span>}
      </PrimaryButton>
      {notification ? (
        <IncidentFormNotification type={notification.type}>{notification.text}</IncidentFormNotification>
      ) : null}
    </FormContainer>
  );
}
