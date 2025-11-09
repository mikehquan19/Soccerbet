import "./Form.css"
import { BetInfoCard, UserBetContext } from "@pages/InfoPage/InfoPage";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";


export default function Form({usedFor="update", handleX, handleUpdate}) {
  const userBet = React.useContext(UserBetContext);
  const [newBetAmount, setNewBetAmount] = React.useState(0.0);

  React.useEffect(() => {
    if (usedFor === "withdraw") {
      // multiply 1.05 to account for extra fees 
      setNewBetAmount(userBet.bet_amount)
    }
  }, [])

  const handleSubmit = () => {
    handleUpdate({...userBet, bet_amount: newBetAmount}, usedFor); 
    handleX(); 
  }

  return (
    <div className="update-form">
      <div className="x-icon" onClick={() => handleX()}><FontAwesomeIcon icon={faX} /></div>
      {/* The info of the bet to take action on */}
      <div className="form-bet-info-wrapper"><BetInfoCard usedFor="nontable" userBet={userBet} /></div>
      {/* The bet amount to be updated  */}
      <div className="update-amount-wrapper">
        {usedFor === "update" ? (
          <>
            <div>
              The bet amount to update to:
              <input 
                className="border-1 bet-amount-input" 
                type="number" 
                onChange={(e) => setNewBetAmount(Number(e.target.value))}
              /> tokens
            </div>
            <div className="updated-total-wrapper">
              {/* Show the total amount that will be added or taken from user's balance */}
              <div>
                <span>Total </span>
                <span style={{fontSize: "1.3rem"}}>(+ fees)</span>:
              </div>
              <div>{((newBetAmount - userBet.bet_amount) * 1.05).toFixed(2)} tokens</div>
            </div>
            <button 
              className="form-button" 
              onClick={() => handleSubmit()}
            >
              Submit
            </button>
          </>
          ) : (
          <>
            <div>
              Are you sure you want to withdraw this bet ?
            </div>
            <div className="updated-total-wrapper">
              {/* Show the total amount that will be added or taken from user's balance */}
              <div>
                <span>Total </span>
                <span style={{fontSize: "1.25rem"}}>(+ fees)</span>:
              </div>
              <div>${(-1 * newBetAmount * 1.05).toFixed(2)}</div>
            </div>
            <button className="form-button" onClick={() => handleSubmit()}>Yes</button>
          </>
        )}
      </div>
    </div>
  )
}