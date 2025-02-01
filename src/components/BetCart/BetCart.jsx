import './BetCart.css';
import React from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX, faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux'
import { deleteBet, setBetAmount } from '../../redux/reducer.js'

const BetCart = ({handleHideItself}) => {
  const [isCartPresent, setIsCartPresent] = React.useState(false);
  const userBetList = useSelector(state => state.userBetList)
  const dispatch = useDispatch()

  // upper case only the first letter of the word 
  const capitalizeFirstLetter = (val) => {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
  }

  if (userBetList.length > 0) {
    return (
      <>
        <div className="overall-bet-cart-wrapper">
          <div className="bet-cart-title">
            <h1>Bet Cart ({userBetList.length}):</h1>
            <div className="bet-cart-icon" onClick={() => setIsCartPresent(!isCartPresent)}>
              {isCartPresent ? <FontAwesomeIcon icon={faAngleDown} /> : <FontAwesomeIcon icon={faAngleUp} />}
            </div>
          </div>
          {/* The cart will be initially absent */}
          {isCartPresent && (
            <div style={{ backgroundColor: "white", paddingBottom: "0.3rem", border: "0.1rem solid darkgrey", borderTop: "none" }}>
              <div className='bet-cart-wrapper'>
                {
                  userBetList.map(userBet =>
                    <div key={userBet.bet_info.id} className="bet-pick-wrapper">
                      <div className="x-sign" onClick={() => dispatch(deleteBet(userBet.bet_info.id))}><FontAwesomeIcon icon={faX} /></div>
                      <div className="bet-match-name">{userBet.bet_info.match_name}</div>
                      <div className="bet-info-wrapper">
                        <h3>{capitalizeFirstLetter(userBet.bet_info.time_type)}</h3>
                        {
                          userBet.bet_info.under_or_over === undefined ? (
                            <h3>{userBet.bet_info.handicap_cover} {userBet.bet_info.bet_object}</h3>
                          ) : (
                            <h3>{userBet.bet_info.target_num_objects} {userBet.bet_info.bet_object}</h3>
                          )
                        }
                        <h3>{userBet.bet_info.odd > 0 ? (<span>+{userBet.bet_info.odd}</span>) : <span>-{userBet.bet_info.odd}</span>}</h3>
                      </div>
                      <div className="bet-amount-wrapper">
                        <h3>{userBet.bet_info.under_or_over === undefined ? userBet.bet_info.bet_team : userBet.bet_info.under_or_over}</h3>
                        <h3>Bet amount: $<input className="bet-amount-input" type="number" defaultValue={userBet.bet_amount}
                          onChange={(e) => dispatch(setBetAmount({ betInfoId: userBet.bet_info.id, betAmount: e.target.value }))} /></h3>
                      </div>
                    </div>
                  )
                }
              </div>
              <button className="bet-cart-submit">
                <Link to="/checkout" style={{textDecoration: "none", color: "white"}} 
                  onClick={() => handleHideItself()}>
                  Check out
                </Link>
              </button>
            </div>
          )}
        </div>
      </>
    )
  }

}

export default BetCart;