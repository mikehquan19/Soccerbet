import './HandicapBet.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFutbol, faFlag, faTablet, faDollarSign } from '@fortawesome/free-solid-svg-icons';

const BetIcon = ({ type }) => {
  if (type === "Goals") {
    return <FontAwesomeIcon icon={faFutbol} />
  } else if (type === "Corners") {
    return <FontAwesomeIcon icon={faFlag} />
  } else {
    return <FontAwesomeIcon icon={faTablet} />
  }
}

const HandicapBet = ({ betInfo, handleClick = (message) => alert(message), userBetList }) => {
  
  // determine the color of the bet button based on if bet is in the list 
  const setColor = (userBetList, individualBetInfo) => {
    if (individualBetInfo === null) 
      return { backgroundColor: "darkslategrey", color: "lightblue" };
    for (var i = 0; i < userBetList.length; i++) {
      if (userBetList[i].bet_info.id === individualBetInfo.id) {
        return { backgroundColor: "lightblue", color: "darkslategrey" };
      }
    }
    return { backgroundColor: "darkslategrey", color: "lightblue" };
  }

  return (
    <div className="handicap-bet-wrapper">
      <div className="home-team-wrapper" style={setColor(userBetList, betInfo.home)} onClick={() => handleClick(betInfo.home)}>
        {betInfo.home != null && ( // Don't show anything if the info of the bet is null
          <>
            <h3 className="bet-team">{betInfo.home.bet_team}</h3>
            <div className="info-wrapper">
              <div className="handicap">
                <div className='icon'><BetIcon type={betInfo.home.bet_object} /></div>
                <h3>{betInfo.home.handicap_cover}</h3>
              </div>
              <div className="odd">
                <div className='icon'><FontAwesomeIcon icon={faDollarSign} /></div>
                <h3>{betInfo.home.odd > 0 ? (<span>+{betInfo.home.odd}</span>) : <span>{betInfo.home.odd}</span>}</h3>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="away-team-wrapper" style={setColor(userBetList, betInfo.away)} onClick={() => handleClick(betInfo.away)}>
        {betInfo.away != null && ( // Don't show anything if the info of the bet is null
          <>
            <h3 className="bet-team">{betInfo.away.bet_team}</h3>
            <div className="info-wrapper">
              <div className="handicap">
                <div className='icon'><BetIcon type={betInfo.away.bet_object} /></div>
                <h3>{betInfo.away.handicap_cover}</h3>
              </div>
              <div className="odd">
                <div className='icon'><FontAwesomeIcon icon={faDollarSign} /></div>
                <h3>{betInfo.away.odd > 0 ? (<span>+{betInfo.away.odd}</span>) : <span>{betInfo.away.odd}</span>}</h3>
              </div>
            </div>
          </>
        )
        }
      </div>
    </div>
  )
}

export default HandicapBet;