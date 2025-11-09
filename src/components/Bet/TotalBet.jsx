import BetIcon from "./BetIcon";

export default function TotalBet({ betInfo, handleClick, userBetList }) {

  // Determine the color of the bet button based on if bet is in the list 
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
      {/* For the "under" part of the bet button */}
      <div 
        className="border-1 border-[goldenrod] p-1 shadow-lg rounded-lg" 
        style={setColor(userBetList, betInfo.under)} 
        onClick={() => handleClick(betInfo.under)}
      >
        {betInfo.under !== null && (
          <>
            <h3 className="text-center text-lg font-medium">
              {betInfo.under.under_or_over}
            </h3>
            <div 
              className="grid grid-cols-[1fr_1fr] text-[goldenrod] font-medium mt-1"
            >
              <div className="flex flex-row justify-center items-center gap-2">
                <div><BetIcon type={betInfo.under.bet_object} /></div>
                <h3>{betInfo.under.target_num_objects}</h3>
              </div>
              <h3 className="text-center">
                {
                  betInfo.under.odd > 0 ? 
                    <span>+{betInfo.under.odd}</span> : 
                    <span>{betInfo.under.odd}</span>
                }
              </h3>
            </div>
          </>
        )}
      </div>
      {/* For the "over" part of the bet button */}
      <div 
        className="border-1 border-[goldenrod] p-1 shadow-lg rounded-lg" 
        style={setColor(userBetList, betInfo.over)} 
        onClick={() => handleClick(betInfo.over)}
      >
        {betInfo.over !== null && (
          <>
            <h3 className="text-center text-lg font-medium">
              {betInfo.over.under_or_over}
            </h3>
            <div 
              className="grid grid-cols-[1fr_1fr] text-[goldenrod] font-medium mt-1"
            >
              <div className="flex flex-row justify-center items-center gap-2">
                <BetIcon type={betInfo.over.bet_object} />
                <h3>{betInfo.over.target_num_objects}</h3>
              </div>
              <h3 className="text-center">
                {
                  betInfo.over.odd > 0 ? 
                    <span>+{betInfo.over.odd}</span> : 
                   <span>{betInfo.over.odd}</span>
                }
              </h3>
            </div>
          </>
        )}
      </div>
    </div>
  )
}