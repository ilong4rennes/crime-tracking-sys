import React from "react";
import PropTypes from "prop-types";
import { get } from "../api";
import InvestigationOverview from "./InvestigationOverview";
import Crimes from "./Crimes";
import CurrentAssignments from "./CurrentAssignments";
import InvestigationNotes from "./InvestigationNotes";
import Suspects from './Suspects';


function Investigation({ investigationId }) {
  const [investigation, setInvestigation] = React.useState();

  // load investigation data
  React.useEffect(() => {
    get(`/v1/investigations/${investigationId}`).then((response) => {
      console.log(response);
      setInvestigation(response);
    });
  }, [investigationId, setInvestigation]);

  if (!investigation) {
    return <>loading...</>;
  }

  const investigationData = investigation.data.attributes;
  // go to this route
  // pass the investigation to other components
  // one call -> get all the data instead of multiple calls

  return (
    <>
      <h4>
        Investigation #{investigation.data.id}: {investigationData.title}
      </h4>

      <div class="row">
        <div class="col s6"> 
          {/* first component */}
          <InvestigationOverview investigation={investigation} />
          {/* JSX component */}
        </div>

        <div class="col s6">
            {/* second component */}
            <Crimes
              crimes={investigationData.crimes}
              investigationId={investigationId}
            />
            {/* also include how to editing and adding crimes */}
            {/* passing in 1. crime objects 2. investigation id */}
          </div>  

        <div className="col s6">
          <CurrentAssignments assignments={investigationData.current_assignments} />
        </div>

        <div className="col s6">
          <InvestigationNotes 
            notes={investigationData.notes} 
            investigationId={investigationId}
            officerId={investigationData.notes.officer}
          />
        </div>

        <div className="col s6">
          <Suspects 
            suspects={investigationData.suspects} 
            investigationId={investigationId} 
          />
        </div>
        
      </div>

    </>
  );
}

// not required but good practice
Investigation.propTypes = {
  investigationId: PropTypes.string.isRequired,
};
export default Investigation;
