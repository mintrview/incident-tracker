import styled from "styled-components";
import IncidentFilters from "./IncidentFilters";

const IncidentTableContainer = styled.div`
  flex: 1;
`;

const Table = styled.table`
  width: 100%;
  text-align: left;
  border-collapse: collapse;

  th {
    background: #fafdff;
    border-collapse: collapse;
    padding: 5px;
    border: 1px solid #dfe7ec;
    font-weight: bold;
  }

  td {
    padding: 5px;
    border: 1px solid #dfe7ec;
  }
`;

const Header = styled.h2`
  margin-top: 0;
  border-bottom: 1px solid #f0f0f0;
`;

const HighlightedText = ({ text, highlight }) => {
  const strings = text.split(new RegExp(`(${highlight})`, "i"));
  return strings.map((s, i) => {
    // Every other string in the split will be a highlighted segment.
    if ((i + 1) % 2 == 0) {
      return <mark key={i}>{s}</mark>;
    }
    return <span key={i}>{s}</span>;
  });
};

// Set of all incidents rendered as a table.
export default function IncidentTable({ incidents, filters, onFiltersChanged }) {
  return (
    <IncidentTableContainer>
      <Header>Incidents</Header>
      <IncidentFilters filters={filters} onFiltersChanged={onFiltersChanged}></IncidentFilters>
      <Table>
        <thead>
          <tr>
            <th>VIN</th>
            <th>Date</th>
            <th>Notes</th>
            <th>Make</th>
            <th>Model</th>
            <th>Year</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map(({ vin, date, notes, make, model, year }) => (
            <tr key={vin + date}>
              <td>
                <HighlightedText text={vin} highlight={filters.textSearch} />
              </td>
              <td>{new Date(date).toLocaleString()}</td>
              <td>
                <HighlightedText text={notes} highlight={filters.textSearch} />
              </td>
              <td>
                <HighlightedText text={make} highlight={filters.textSearch} />
              </td>
              <td>
                <HighlightedText text={model} highlight={filters.textSearch} />
              </td>
              <td>{year}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </IncidentTableContainer>
  );
}
