import React, { useState, useEffect } from "react";
import Head from "next/head";
import IncidentForm from "../components/incidentTracker/IncidentForm";
import IncidentTable from "../components/incidentTracker/IncidentTable";
import { createGlobalStyle } from "styled-components";
import styled from "styled-components";
import moment from "moment";

const Header = styled.header`
  background: #fafdff;
  border-bottom: 1px solid #dfe7ec;
`;

const HeaderContainer = styled.div`
  max-width: 1250px;
  display: block;
  margin: auto;
  padding: 15px;
  box-sizing: border-box;
  color: #54748a;

  h1 {
    margin: 0;
  }
`;

const ContentContainer = styled.div`
  max-width: 1250px;
  display: block;
  margin: auto;
  padding: 15px;
  box-sizing: border-box;
`;

const TrackerContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Open Sans';
    margin: 0;
    min-width: 1000px;
  }
`;

/**
 * Application Home Page
 */
export default function Home() {
  const [incidents, setIncidents] = useState([]);
  const [filters, setFilters] = useState({
    textSearch: "",
  });

  // Initial fetch of incidents.
  useEffect(async () => {
    const request = await fetch("/incident");
    const incidents = await request.json();
    setIncidents(incidents);
  }, []);

  // Adds an incident on the client-side in sorted order.
  const onIncidentAdded = (incident) => {
    incidents.push(incident);
    const parsedDate = moment(incident.date);
    for (let i = incidents.length - 2; i >= 0; i--) {
      if (parsedDate.isSameOrBefore(incidents[i].date)) {
        break;
      }
      const temp = incidents[i];
      incidents[i] = incidents[i + 1];
      incidents[i + 1] = temp;
    }
    setIncidents([...incidents]);
  };

  // Updates filters for the set of incidents.
  const onFiltersChanged = (filterNames, values) => {
    filterNames.forEach((filter, i) => (filters[filter] = values[i]));
    setFilters({ ...filters });
  };

  const filteredIncidents = incidents.filter((incident) => {
    let shouldInclude = true;

    // Apply search text filters.
    if (filters.textSearch) {
      const textSearch = filters.textSearch.toLowerCase();
      shouldInclude =
        shouldInclude &&
        (incident.vin?.toLowerCase().includes(textSearch) ||
          incident.model?.toLowerCase().includes(textSearch) ||
          incident.make?.toLowerCase().includes(textSearch) ||
          incident.notes?.toLowerCase().includes(textSearch));
    }

    // Apply date filters.
    if (filters.startDate) {
      shouldInclude = shouldInclude && filters.startDate.isSameOrBefore(incident.date);
    }
    if (filters.endDate) {
      shouldInclude = shouldInclude && filters.endDate.isSameOrAfter(incident.date);
    }

    return shouldInclude;
  });

  return (
    <>
      <GlobalStyle whiteColor />
      <Head>
        <title>Incident Tracker</title>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans&display=swap" />
      </Head>
      <main>
        <Header>
          <HeaderContainer>
            <h1>Incident Tracker</h1>
          </HeaderContainer>
        </Header>
        <ContentContainer>
          <TrackerContainer>
            <IncidentForm onIncidentAdded={onIncidentAdded} />
            <IncidentTable filters={filters} onFiltersChanged={onFiltersChanged} incidents={filteredIncidents} />
          </TrackerContainer>
        </ContentContainer>
      </main>
    </>
  );
}
