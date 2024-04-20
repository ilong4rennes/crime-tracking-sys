import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { post } from "../api";
import FormattedDate from "./FormattedDate";

function NewNoteEditor({ onSave, onCancel }) {
  const [noteContent, setNoteContent] = useState('');

  return (
    <>
      <textarea
        value={noteContent}
        onChange={(e) => setNoteContent(e.target.value)}
        placeholder="Enter note content"
      />
      {/* <button onClick={() => onSave(noteContent)}>Save</button> */}
      <button onClick={() => onSave(noteContent)} disabled={!noteContent}>
        Save
      </button>
      <button onClick={onCancel}>Cancel</button>
    </>
  );
}

function InvestigationNotes({ notes, investigationId, officerId }) {
  const [editorOpen, setEditorOpen] = useState(false);
  const [currentNotes, setCurrentNotes] = useState(notes);

//   function onSave(content) {
//     console.log('Attempting to save note:', content); // Add this log
//     post(`/v1/investigations/${investigationId}/notes`, {
//       note: {
//         content: content,
//       }
//     }).then((result) => {
//       console.log('Note saved:', result); // Add this log
//       setEditorOpen(false);
//       setCurrentNotes([result].concat(currentNotes));
//     }).catch(error => {
//       console.error("Error saving note:", error);
//     });
//   }

    function onSave(content) {
        console.log('Attempting to save note:', content); // Add this log
        post(`/v1/investigations/${investigationId}/notes`, {
            investigation_note: {
                content: content, // Key updated to match the backend's expected params
                officer_id: officerId,
            },
        })
        
        .then((result) => {
        console.log('Note saved:', result); // Add this log
        setEditorOpen(false);
        // Assuming the newNote is the note object itself, not wrapped in a data property
        setCurrentNotes([result].concat(currentNotes));
        });
    }
  

  const content = currentNotes.length === 0 ? (
    <p>No notes associated with this investigation.</p>
  ) : (
    <ul>
      {currentNotes.map((note) => {
        const noteData = note.data.attributes;
        const officerData = noteData.officer.data.attributes;
        return (
          <li key={`note-${note.data.id}`}>
            <p>{FormattedDate(noteData.date)}: {noteData.content} </p>
            <p>- {officerData.first_name} {officerData.last_name}</p>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className="card yellow lighten-5">
      <div className="card-content">
        <span className="card-title">Investigation Notes</span>
        {content}
        {editorOpen && (
          <NewNoteEditor
            onSave={onSave}
            onCancel={() => setEditorOpen(false)}
          />
        )}
        {!editorOpen && <button onClick={() => setEditorOpen(true)}>Add</button>}
      </div>
    </div>
  );
}

NewNoteEditor.propTypes = {
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

InvestigationNotes.propTypes = {
  notes: PropTypes.arrayOf(PropTypes.object).isRequired,
  investigationId: PropTypes.string.isRequired,
  officerId: PropTypes.number,
};

export default InvestigationNotes;
