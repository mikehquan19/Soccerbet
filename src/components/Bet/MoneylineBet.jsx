import BetIcon from "./BetIcon";

export default function MoneylineBet({ betInfo, handleClick, userBetList }) {
  const betStyle = "bg-[darkslategrey] text-[skyblue] border-[goldenrod] border-1 p-1 rounded-lg shadow-lg"

  // Determine the color of the bet button based on if bet is in the list 
  function setColor(userBetList, individualBetInfo) {
    if (individualBetInfo === undefined || individualBetInfo === null)
      return { 
        backgroundColor: "darkslategrey", 
        color: "lightblue" 
      };
    for (const userBet of userBetList) {
      if (userBet.bet_info.id === individualBetInfo.id) {
        return { 
          backgroundColor: "lightblue", 
          color: "darkslategrey" 
        };
      }
    }
    return { 
      backgroundColor: "darkslategrey", 
      color: "lightblue" 
    };
  }

  if (betInfo.length > 0) {
    return (
      <div className="w-2/3 m-auto grid grid-cols-[1fr_1fr_1fr] gap-1">
        <div 
          className={betStyle}
          style={setColor(userBetList, betInfo[0])} 
          onClick={() => handleClick(betInfo[0])}
        >
          {betInfo[0] !== undefined && (
            <>
              <div 
                className="text-lg font-medium flex flex-row items-center justify-center gap-2"
              >
                <BetIcon type={betInfo[0].bet_object} />
                <h3>{betInfo[0].bet_team}</h3>
              </div>
              <div className="font-medium flex flex-row justify-center text-[goldenrod] mt-1">
                <h3>
                  {
                    betInfo[0].odd > 0 ? 
                      (<span>+{betInfo[0].odd}</span>) : 
                      (<span>{betInfo[0].odd}</span>)
                  }
                </h3>
              </div>
            </>
          )}
        </div>
        <div className={betStyle} 
          style={setColor(userBetList, betInfo[1])} 
          onClick={() => handleClick(betInfo[1])}
        >
          {betInfo[1] !== undefined ? (
            <>
              <div 
                className="text-lg font-medium flex flex-row items-center justify-center gap-2"
              >
                <BetIcon type={betInfo[1].bet_object} />
                <h3>{betInfo[1].bet_team}</h3>
              </div>
              <div className="font-medium flex flex-row justify-center text-[goldenrod] mt-1">
                <h3>{betInfo[1].odd > 0 ? 
                  (<span>+{betInfo[1].odd}</span>) : 
                  (<span>{betInfo[1].odd}</span>)}
                </h3>
              </div>
            </>
          ) : (
            <div className="text-lg font-medium flex flex-row justify-center gap-2">
              <h3>Unavailable</h3>
            </div>
          )}
        </div>
        <div className={betStyle}
          style={setColor(userBetList, betInfo[2])} 
          onClick={() => handleClick(betInfo[2])}
        >
          {betInfo[2] !== undefined && (
            <>
              <div className="text-lg font-medium flex flex-row items-center justify-center gap-2">
                <BetIcon type={betInfo[2].bet_object} />
                <h3>{betInfo[2].bet_team}</h3>
              </div>
              <div className="font-medium flex flex-row justify-center text-[goldenrod] mt-1">
                <h3>
                  {
                    betInfo[2].odd > 0 ? 
                      (<span>+{betInfo[2].odd}</span>) : 
                      (<span>{betInfo[2].odd}</span>)
                  }
                </h3>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
}