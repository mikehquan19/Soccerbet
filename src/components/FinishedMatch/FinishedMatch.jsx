import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faX } from '@fortawesome/free-solid-svg-icons';


const FinishedMatch = (props) => {
  const [isStatPresent, setIsStatPresent] = React.useState(false); 
  const bgImage = "url(https://i.pinimg.com/736x/8a/52/46/8a524616b4f1c943b40dea88932a1a5f.jpg)"

  const statisticsMap = {
    "HF": "halftimeScore",
    "Penalty": "penalty", 
    "Possession": "posession", 
    "Total shots": "totalShots", 
    "Corners": "corners", 
    "Cards": "cards", 
  };

  return (
    <div className="rounded-xl mx-auto mb-3">
      <div className="bg-[lightslategrey] rounded-t-xl py-1 px-2 flex flex-row justify-between items-center">
        <h3 className="text-white font-semibold">
          {props.date}
        </h3>
        <div className="bg-[skyblue] rounded-xl py-1 px-2 text-[darkblue]">
          <h3 className="font-medium">
            {props.status}
          </h3>
        </div>
      </div>
      <div 
        className="rounded-b-xl shadow-2xl"
        style={{backgroundImage: bgImage}}
      >
        <div className="flex flex-row justify-between items-center p-2">
          <h3 className="text-white font-medium">
            Updated {props.updatedDate}
          </h3>
          <button 
            className="flex items-center justify-center bg-[transparent] border-2 border-white text-lg font-semibold rounded-full h-8 w-8"
            onClick={() => setIsStatPresent(!isStatPresent)}
          >
            {
              isStatPresent ?
                <FontAwesomeIcon icon={faX} style={{color: "white"}} /> : 
                <FontAwesomeIcon icon={faAngleDown} style={{color: "white"}} />
            }
          </button>
        </div>
        <div className="m-auto px-1 py-2 grid grid-cols-[1fr_auto_1fr] text-white">
          <div className="text-lg font-medium">
            <h3>{props.homeTeam}</h3>
            <img 
              src={props.homeTeamLogo} 
              className="h-18 w-auto mx-auto mt-2" 
            />
          </div>
          <div>
            <h3 className="text-center">FT</h3>
            <div className="grid grid-cols-[1fr_auto_1fr] gap-1 text-3xl font-semibold mt-2">
              <h2>{props.fulltimeScore.split("-")[0]}</h2>
              <h2>-</h2>
              <h2>{props.fulltimeScore.split("-")[1]}</h2>
            </div>  
          </div>
          <div className="text-lg font-medium text-right">
            <h3>{props.awayTeam}</h3>
            <img 
              src={props.awayTeamLogo} 
              className="h-18 w-auto mx-auto mt-2" 
            />
          </div>
        </div>

          <div
            className={
              `overflow-hidden transition-all duration-500 ease-in-out ${
                isStatPresent ? 
                  "max-h-250 opacity-100" : 
                  "max-h-0 opacity-0"
              } border-t border-white p-2 text-white`
            }
          >
          {["HF", "Penalty", "Possession", "Total shots", "Corners", "Cards"].map(stat => 
            <div 
              key={stat} 
              className="grid grid-cols-[1fr_1fr_1fr] py-2"
            >
              <h2 className="font-medium text-xl">
                {props[statisticsMap[stat]].split("-")[0]}
              </h2>
              <h3 className="text-center text-lg">
                - {stat} -
              </h3>
              <h2 className="text-right font-medium text-xl">
                {props[statisticsMap[stat]].split("-")[1]}
              </h2>
            </div>
          )}
          </div>
        
      </div>
    </div>
  )
}

export default FinishedMatch;