import React from "react";
import FormattedDate from "./FormattedDate";

function InvestigationOverview({ investigation }) {
  const investigationData = investigation.data.attributes;

  // export the entire function
  return (
    <>
    {/* fragment - only export one thing at a time so i have to wrap everything into one fragment */}
      <div class="card yellow lighten-5">
        <div class="card-content">
          <span class="card-title">Investigation Overview</span>

          <p>{investigation.description}</p>
          <p>
            <b>Location:</b> {investigationData.crime_location}
          </p>
          <p>
            {/* <b>Opened:</b> {investigationData.date_opened} */}
            <b>Opened:</b> {FormattedDate(investigationData.date_opened)}
            {/* FormattedDate is a component defined in FormattedData.js */}
            {/* Month-Day-Year */}
          </p>
          <p>
            <b>Closed:</b> {investigationData.date_closed ? FormattedDate(investigationData.date_closed) : "N/A"}
          </p>
          <p>
            <b>Status:</b>
            {investigationData.solved ? " Solved" : " Unsolved"}
          </p>
          <p>
            <b>Batman Involved:</b>
            {investigationData.batman_involved ? " Yes" : " No"}
          </p>
          <p>
            <b>Initial Description: </b>
            {investigationData.description}
          </p>
        </div>
      </div>
    </>
  );
}


export default InvestigationOverview;