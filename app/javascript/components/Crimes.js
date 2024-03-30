import React from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { find } from "lodash";
import { get, post } from "../api";

function CrimeEditor({ close, onSave, currentCrimes }) {
  const [options, setOptions] = React.useState([]);
  const [crimeId, setCrimeId] = React.useState();

  React.useEffect(() => {
    get(`/v1/crimes`).then((response) => {
      setOptions(
        response.crimes.map((crime) => {
          const crimeAlreadyExists = !!find(currentCrimes, {
            data: { id: crime.data.id },
          });
          const { name, felony } = crime.data.attributes;
          return {
            value: crime.data.id,
            label: `${name} (${felony ? "felony" : "misdemeanor"})`,
            disabled: crimeAlreadyExists,
          };
          // gray out the crime if it already exists
        })
      );
    });
  }, []);

  return (
    <>
      <Select
        options={options}
        onChange={({ value }) => setCrimeId(value)}
        isOptionDisabled={(option) => option.disabled}
      />
      {/* print out the options */}
      <button onClick={() => onSave(crimeId)} disabled={!crimeId}>
        Save
      </button>{" "}
      <button onClick={close}>Cancel</button>
    </>
    // 就是右上角的框
  );
}

CrimeEditor.propTypes = {
  close: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  currentCrimes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

function Crimes({ crimes, investigationId }) {
  const [editorOpen, setEditorOpen] = React.useState(false);
  const [currentCrimes, setCurrentCrimes] = React.useState(crimes);

  function onSave(crimeId) {
    // on save = create action
    // insert new crime = POST
    // Why is it a post?
    // Using a POST request because it is creating a new resource on the server. 
    // In this case, it is creating a new crime investigation associated with an investigation ID. 
    // The post function is likely a custom function from the ../api module that handles making HTTP POST requests.

    post(`/v1/investigations/${investigationId}/crime_investigations`, {
      crime_investigation: {
        crime_id: crimeId,
      },
    }).then((result) => {
      setEditorOpen(false);
      setCurrentCrimes([result].concat(currentCrimes));
    });
  }

  const content =
    currentCrimes.length === 0 ? (
      <p>This investigation does not yet have crimes associated with it.</p>
    ) : (
      <>
        <ul>
          {currentCrimes.map((crime) => {
            const { name, felony } = crime.data.attributes;
            return (
              <li key={`crime-${crime.data.id}`}>
                <p>
                  - {name} {felony ? "(felony)" : "(misdemeanor)"}
                </p>
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
          <span class="card-title">Crimes</span>
            {content}
            {editorOpen && (
              <CrimeEditor
                close={() => setEditorOpen(false)}
                onSave={onSave}
                currentCrimes={currentCrimes}
              />
            )}
            {/* Crime Editor -- DosageSection.js and DosageEditor in PATS */}
            {!editorOpen && <button onClick={() => setEditorOpen(true)}>Add</button>}
            {/* Add button */}
        </div>
      </div>
    </>
  );
}

Crimes.propTypes = {
  crimes: PropTypes.arrayOf(PropTypes.object).isRequired,
  investigationId: PropTypes.string.isRequired,
};

export default Crimes;