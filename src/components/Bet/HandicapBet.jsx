import BetIcon from "./BetIcon";

export default function HandicapBet({ 
  betInfo, handleClick = (message) => alert(message), userBetList 
}) {
  const betStyle = "border-1 border-[goldenrod] p-1 shadow-lg rounded-lg" 

  // determine the color of the bet button based on if bet is in the list 
  function setColor(userBetList, individualBetInfo) {
    if (individualBetInfo === undefined || individualBetInfo === null) {
      return { 
        backgroundColor: "darkslategrey", 
        color: "lightblue" 
      }
    }
    for (const userBet of userBetList) {
      if (userBet.bet_info.id === individualBetInfo.id) {
        return { 
          backgroundColor: "lightblue", 
          color: "darkslategrey" 
        }
      }
    }
    return { 
      backgroundColor: "darkslategrey", 
      color: "lightblue"
    }
  }

  return (
    <div className="w-2/3 m-auto grid grid-cols-[1fr_1fr] gap-1 mb-1">
      <div 
        className={betStyle}
        style={setColor(userBetList, betInfo.home)} 
        onClick={() => handleClick(betInfo.home)}
      >
        {betInfo.home != null && ( 
          // Don't show anything if the info of the bet is null
          <>
            <h3 className="text-center text-lg font-medium">
              {betInfo.home.bet_team}
            </h3>
            <div 
              className="grid grid-cols-[1fr_1fr] text-[goldenrod] font-medium mt-1"
            >
              <div className="flex flex-row justify-center items-center gap-2">
                <BetIcon type={betInfo.home.bet_object} />
                <h3>{betInfo.home.handicap_cover}</h3>
              </div>
              <div className="text-center">
                <h3>{betInfo.home.odd > 0 ? 
                  (<span>+{betInfo.home.odd}</span>) : 
                  <span>{betInfo.home.odd}</span>}
                </h3>
              </div>
            </div>
          </>
        )}
      </div>
      <div 
        className={betStyle} 
        style={setColor(userBetList, betInfo.away)} 
        onClick={() => handleClick(betInfo.away)}
      >
        {betInfo.away != null && ( // Don't show anything if the info of the bet is null
          <>
            <h3 className="text-center text-lg font-medium">
              {betInfo.away.bet_team}
            </h3>
            <div 
              className="grid grid-cols-[1fr_1fr] text-[goldenrod] font-medium mt-1"
            >
              <div className="flex flex-row justify-center items-center gap-2">
                <BetIcon type={betInfo.away.bet_object} />
                <h3>{betInfo.away.handicap_cover}</h3>
              </div>
              <div className="text-center">
                <h3>{betInfo.away.odd > 0 ? 
                  (<span>+{betInfo.away.odd}</span>) : 
                  <span>{betInfo.away.odd}</span>}
                </h3>
              </div>
            </div>
          </>
        )
        }
      </div>
    </div>
  )
}
