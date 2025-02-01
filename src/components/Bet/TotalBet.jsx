import './TotalBet.css';
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

const TotalBet = ({ betInfo, handleClick, userBetList }) => {

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
    <div className="total-bet-wrapper">
      {/* For the "under" part of the bet button */}
      <div className="under-wrapper" style={setColor(userBetList, betInfo.under)} onClick={() => handleClick(betInfo.under)}>
        {betInfo.under !== null && (
          <>
            <div className="under-or-over"><h3>{betInfo.under.under_or_over}</h3></div>
            <div className="total-info-wrapper">
              <div className="number-objects">
                <div className='icon'><BetIcon type={betInfo.under.bet_object} /></div>
                <h3>{betInfo.under.target_num_objects}</h3>
              </div>
              <div className="total-objects-odd">
                <div className='icon'><FontAwesomeIcon icon={faDollarSign} /></div>
                <h3>{betInfo.under.odd > 0 ? (<span>+{betInfo.under.odd}</span>) : <span>{betInfo.under.odd}</span>}</h3>
              </div>
            </div>
          </>
        )}
      </div>
      {/* For the "over" part of the bet button */}
      <div className="over-wrapper" style={setColor(userBetList, betInfo.over)} onClick={() => handleClick(betInfo.over)}>
        {betInfo.over !== null && (
          <>
            <div className="under-or-over"><h3>{betInfo.over.under_or_over}</h3></div>
            <div className="total-info-wrapper">
              <div className="number-objects">
                <div className='icon'><BetIcon type={betInfo.over.bet_object} /></div>
                <h3>{betInfo.over.target_num_objects}</h3>
              </div>
              <div className="total-objects-odd">
                <div className='icon'><FontAwesomeIcon icon={faDollarSign} /></div>
                <h3>{betInfo.over.odd > 0 ? (<span>+{betInfo.over.odd}</span>) : <span>{betInfo.over.odd}</span>}</h3>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default TotalBet;