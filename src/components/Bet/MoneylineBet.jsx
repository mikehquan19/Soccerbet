import './MoneylineBet.css';
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

const MoneylineBet = ({ betInfo, handleClick, userBetList }) => {
  // determine the color of the bet button based on if bet is in the list 
  const setColor = (userBetList, individualBetInfo) => {
    if (individualBetInfo === undefined || individualBetInfo === null)
      return { backgroundColor: "darkslategrey", color: "lightblue" };
    for (var i = 0; i < userBetList.length; i++) {
      if (userBetList[i].bet_info.id === individualBetInfo.id) {
        return { backgroundColor: "lightblue", color: "darkslategrey" };
      }
    }
    return { backgroundColor: "darkslategrey", color: "lightblue" };
  }

  if (betInfo.length > 0) {
    return (
      <div className="moneyline-bet-wrapper">
        <div className="moneyline-team-wrapper" style={setColor(userBetList, betInfo[0])} onClick={() => handleClick(betInfo[0])}>
          {betInfo[0] !== undefined && (
            <>
              <div className="moneyline-bet-team">
                <div className='icon'><BetIcon type={betInfo[0].bet_object} /></div>
                <h3>{betInfo[0].bet_team}</h3>
              </div>
              <div className="moneyline-odd">
                <div className='icon'><FontAwesomeIcon icon={faDollarSign} /></div>
                <h3>{betInfo[0].odd > 0 ? (<span>+{betInfo[0].odd}</span>) : (<span>{betInfo[0].odd}</span>)}</h3>
              </div>
            </>
          )}
        </div>
        <div className="moneyline-team-wrapper" style={setColor(userBetList, betInfo[1])} onClick={() => handleClick(betInfo[1])}>
          {betInfo[1] !== undefined ? (
            <>
              <div className="moneyline-bet-team">
                <div className='icon'><BetIcon type={betInfo[1].bet_object} /></div>
                <h3>{betInfo[1].bet_team}</h3>
              </div>
              <div className="moneyline-odd">
                <div className='icon'><FontAwesomeIcon icon={faDollarSign} /></div>
                <h3>{betInfo[1].odd > 0 ? (<span>+{betInfo[1].odd}</span>) : (<span>{betInfo[1].odd}</span>)}</h3>
              </div>
            </>
          ) : (
            <div className="moneyline-bet-team"><h3>Unavailable</h3></div>
          )}
        </div>
        <div className="moneyline-team-wrapper" style={setColor(userBetList, betInfo[2])} onClick={() => handleClick(betInfo[2])}>
          {betInfo[2] !== undefined && (
            <>
              <div className="moneyline-bet-team">
                <div className='icon'><BetIcon type={betInfo[2].bet_object} /></div>
                <h3>{betInfo[2].bet_team}</h3>
              </div>
              <div className="moneyline-odd">
                <div className='icon'><FontAwesomeIcon icon={faDollarSign} /></div>
                <h3>{betInfo[2].odd > 0 ? (<span>+{betInfo[2].odd}</span>) : (<span>{betInfo[2].odd}</span>)}</h3>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }
  return (<></>)
}

export default MoneylineBet;