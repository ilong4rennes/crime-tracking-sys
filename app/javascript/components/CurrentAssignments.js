// This file is written with the help of Copilot 
// Some part of the code is adapted from Crime.js and InvestigationOverview.js

import React from 'react';
import PropTypes from 'prop-types';
import FormattedDate from "./FormattedDate";
import Select from "react-select";
import { find } from "lodash";
import { get, post } from "../api";

function CurrentAssignments({ assignments }) {
  // The content to be rendered
  const [currentAssignments, setCurrentAssignments] = React.useState(assignments);

  const content = currentAssignments.length === 0 ? (
    <p>No current assignments associated with it.</p>
  ) : (
    <ul>
      {currentAssignments.map((assignment) => {
        // const { id, officer_rank, officer_name, start_date } = assignment;
        const assignmentData = assignment.data.attributes;
        const officerData = assignmentData.officer.data.attributes;
        return (
          <li key={`assignment-${assignment.data.id}`}>
            <p>
              - {officerData.rank} {officerData.first_name} {officerData.last_name} (as of: {FormattedDate(assignmentData.start_date)})
            </p>
          </li>
        );
      })}
    </ul>
  );

  // Render the assignments or a message if there are none
  return (
    <div class="card yellow lighten-5">
      <div class="card-content">
        <span class="card-title">Current Assignments</span>
        {content}
      </div>
    </div>
  );
}

CurrentAssignments.propTypes = {
  assignments: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default CurrentAssignments;

