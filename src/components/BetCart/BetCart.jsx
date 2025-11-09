import React from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX, faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux'
import { clear, deleteBet, setBetAmount } from '@redux/reducer'

const BetCart = ({ handleHideItself }) => {
  const [isCartPresent, setIsCartPresent] = React.useState(false);
  const userBetList = useSelector(state => state.userBetList)
  const dispatch = useDispatch()

  // upper case only the first letter of the word 
  function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
  }

  if (userBetList.length > 0) {
    return (
      <div className="m-auto shadow-xl border-1 rounded-t-2xl fixed bottom-0 left-1/2 -translate-x-1/2 z-10 w-1/2">
        <div
          className="bg-[darkgrey] text-white p-2 flex flex-row items-center justify-between rounded-t-2xl"
        >
          <h1 className="text-xl font-semibold">
            Bet Cart ({userBetList.length}):
          </h1>
          <div
            className="border-2 border-white rounded-full w-8 h-8 flex items-center justify-center p-[0.3rem]"
            onClick={() => setIsCartPresent(!isCartPresent)}
          >
            {isCartPresent ?
              <FontAwesomeIcon icon={faAngleDown} /> :
              <FontAwesomeIcon icon={faAngleUp} />
            }
          </div>
        </div>
        {isCartPresent && (
          <div className="bg-white border-b-2 border-[darkgrey]">
            <div className="p-2 border-b-1 max-h-100 overflow-y-auto">
              {userBetList.map((userBet) =>
                <div
                  key={userBet.bet_info.id}
                  className="mb-2 border-2 rounded-xl p-2"
                >
                  <div className="flex flex-row justify-between">
                    <div className="text-xl font-medium">
                      {userBet.bet_info.match_league}
                    </div>
                    <div onClick={() => dispatch(deleteBet(userBet.bet_info.id))}>
                      <FontAwesomeIcon icon={faX} />
                    </div>
                  </div>
                  <div className="text-xl font-medium text-[goldenrod] mt-2">
                    <div>
                      <span>{userBet.bet_info.match_name}     </span>
                      <span>{userBet.bet_info.match_time}</span>
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-[1fr_1fr_1fr] text-lg font-medium text-center">
                    <h3>
                      {capitalizeFirstLetter(userBet.bet_info.time_type)}
                    </h3>
                    <div>
                      {
                        userBet.bet_info.under_or_over === undefined ?
                          <h3>
                            <span>{userBet.bet_info.handicap_cover} </span>
                            <span>{userBet.bet_info.bet_object}</span>
                          </h3> :
                          <h3>
                            <span>{userBet.bet_info.target_num_objects} </span>
                            <span>{userBet.bet_info.bet_object}</span>
                          </h3>
                      }
                    </div>
                    <h3>
                      {
                        userBet.bet_info.odd > 0 ?
                          <span>+{userBet.bet_info.odd}</span> :
                          <span>{userBet.bet_info.odd}</span>
                      }
                    </h3>
                  </div>
                  <div className="grid grid-cols-[1fr_2fr] items-center text-center mt-2">
                    <h3 className="text-xl font-semibold">
                      {
                        userBet.bet_info.under_or_over === undefined ?
                          userBet.bet_info.bet_team :
                          userBet.bet_info.under_or_over
                      }
                    </h3>
                    <h3>
                      <span className="text-lg">Bet amount: </span>
                      <input
                        className="text-lg border-2 rounded-lg inline-block ml-1 p-1 w-25 appearance-none"
                        type="number"
                        defaultValue={userBet.bet_amount}
                        onChange={(e) => {
                          dispatch(setBetAmount({
                            betInfoId: userBet.bet_info.id,
                            betAmount: e.target.value
                          }));
                        }}
                      />
                    </h3>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-1 text-white text-xl flex flex-row justify-around p-2">
              <button
                onClick={() => dispatch(clear())}
                className="block px-2 py-1 bg-[darkcyan] rounded-lg"
              >Clear Cart</button>
              <button
                className="block px-2 py-1 bg-[darkcyan] rounded-lg"
              >
                <Link
                  to="/checkout"
                  onClick={() => handleHideItself()}
                >Check out</Link>
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

}

export default BetCart;