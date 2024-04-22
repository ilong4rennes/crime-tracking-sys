// This file is written with the help of Copilot 
// Some part of the code is adapted from Crime.js and InvestigationOverview.js

import React from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { find } from "lodash";
import { get, post, put } from "../api";
import FormattedDate from "./FormattedDate";

function SuspectEditor({ close, onSave, currentCriminals }) {
  const [options, setOptions] = React.useState([]);
  const [suspectId, setSuspectId] = React.useState();

  React.useEffect(() => {
    get(`/v1/criminals`).then((response) => {
      setOptions(
        response.criminals.map((criminal) => {
          const criminalAlreadyExists = !!find(currentCriminals, {
            data: { id: criminal.data.id },
          });
          const criminalData = criminal.data.attributes;

          return {
            value: criminal.data.id,
            label: `${criminalData.first_name} ${criminalData.last_name}`,
            disabled: criminalAlreadyExists,
          };
        })
      );
    });
  }, []);


  return (
    <>
      <Select
        options={options}
        onChange={({ value }) => setSuspectId(value)}
        isOptionDisabled={(option) => option.disabled}
      />
      <button onClick={() => onSave(suspectId)} disabled={!suspectId}>
        Save
      </button>{" "}

      <button onClick={close}>Cancel</button>

    </>
  );
}

SuspectEditor.propTypes = {
  close: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
//   onDrop: PropTypes.func.isRequired,
  currentSuspects: PropTypes.arrayOf(PropTypes.object).isRequired,
};

function Suspects({ suspects, investigationId }) {
  const [editorOpen, setEditorOpen] = React.useState(false);
  const [editorDrop, setEditorDrop] = React.useState(false);
  const [currentSuspects, setCurrentSuspects] = React.useState(suspects);
  

  function onSave(criminalId) {
    post(`/v1/investigations/${investigationId}/suspects`, {
      suspect: {
        criminal_id: criminalId,
        investigation_id: investigationId,
        added_on: new Date()
      },
    }).then((result) => {
      setEditorOpen(false);
      setCurrentSuspects([result].concat(currentSuspects));
    });
  }

  function onDrop(suspectId) {
    put(`/v1/drop_suspect/${suspectId}`, {}).then((result) => {
      setEditorDrop(false);
      setCurrentSuspects([result].filter((otherSuspect) => otherSuspect.id !== suspectId));
    });
  }

  const content =
    currentSuspects.length === 0 ? (
      <p>This investigation does not yet have suspects associated with it.</p >
    ) : (
      <>
        <ul>
          {currentSuspects.map((suspect) => {
            const suspectData = suspect.data.attributes;
            const criminalData = suspectData.criminal.data.attributes;
            return (
              <li key={`suspect-${suspect.data.id}`}>
                <p>
                    {criminalData.first_name} {criminalData.last_name} 
                </p >
                <p> - Added: {FormattedDate(suspectData.added_on)} </p>
                <p> - Dropped: {suspectData.dropped_on ? FormattedDate(suspectData.dropped_on) : "N/A"} 
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 
                {suspectData.dropped_on === null && (
                    <button onClick={() => onDrop(suspect.data.id)}>Drop</button>
                )}
                </p>

                <br></br>
              </li>
            );
          })}
        </ul>
      </>
    );

  return (
    <>
      <div class="card yellow lighten-5">
        <div class="card-content">
          <span class="card-title">Suspects</span>
            {content}
            {editorOpen && (
              <SuspectEditor
                close={() => setEditorOpen(false)}
                onSave={onSave}
                currentSuspects={currentSuspects}
              />
            )}
            {!editorOpen && <button onClick={() => setEditorOpen(true)}>Add</button>}
          
        </div>
      </div>
    </>
  );
}

Suspects.propTypes = {
  suspects: PropTypes.arrayOf(PropTypes.object).isRequired,
  investigationId: PropTypes.string.isRequired,
};

export default Suspects;