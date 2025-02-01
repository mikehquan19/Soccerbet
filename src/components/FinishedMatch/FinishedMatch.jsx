import React from "react";
import "./FinishedMatch.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faX } from '@fortawesome/free-solid-svg-icons';


const FinishedMatch = (props) => {
  const [isStatPresent, setIsStatPresent] = React.useState(false); 

  const statisticsMap = {
    "HF": "halftimeScore",
    "Penalty": "penalty", 
    "Possession": "posession", 
    "Total shots": "totalShots", 
    "Corners": "corners", 
    "Cards": "cards", 
  };

  return (
    <div className="overall-score-wrapper">
      <div className="score-title-wrapper">
        <div className="date-wrapper"><h3>{props.date}</h3></div>
        <div className="status-wrapper"><h3>{props.status}</h3></div>
      </div>
      <div className="background-score-wrapper"> {/* just to apply background image */}
        <div className="updated-date-wrapper">
          <h3>Updated {props.updatedDate}</h3>
          <button 
            onClick={() => setIsStatPresent(!isStatPresent)}>
            {isStatPresent ? (<FontAwesomeIcon icon={faX} style={{color: "white"}} />) : (<FontAwesomeIcon icon={faAngleDown} style={{color: "white"}} />)}
          </button>
        </div>
        <div className="match-score-wrapper">
          <div className="score-team-wrapper home">
            <h3>{props.homeTeam}</h3>
            <img src={props.homeTeamLogo} height="70" />
          </div>
          <div className="score-team-wrapper">
            <h3>FT</h3>
            <div className="score-wrapper">
              <h2>{props.fulltimeScore.split("-")[0]}</h2>
              <h2>-</h2>
              <h2>{props.fulltimeScore.split("-")[1]}</h2>
            </div>  
          </div>
          <div className="score-team-wrapper away">
            <h3>{props.awayTeam}</h3>
            <img src={props.awayTeamLogo} height="70" />
          </div>
        </div>

        {isStatPresent && 
          <div className="stat-list-wrapper">
          {["HF", "Penalty", "Possession", "Total shots", "Corners", "Cards"].map(stat => 
            <div key={stat} className="stat-wrapper">
              <h2 className="home-stat">{props[statisticsMap[stat]].split("-")[0]}</h2>
              <h3>- {stat} -</h3>
              <h2 className="away-stat">{props[statisticsMap[stat]].split("-")[1]}</h2>
            </div>
          )}
          </div>
        }
      </div>
    </div>
  )
}

export default FinishedMatch;