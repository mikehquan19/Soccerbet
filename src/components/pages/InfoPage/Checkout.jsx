import { BetInfoCard } from "./InfoPage"
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { clear } from "../../../redux/reducer";
import { useNavigate } from "react-router-dom";
import { soccerappClient } from "../../../provider/api";
import "./Checkout.css"


const CheckOut = () => {
  const userBetList = useSelector(state => state.userBetList)
  const dispatch = useDispatch()
  console.log(userBetList)

  const [userBalance, setUserBalance] = React.useState(null)
  const [usedToConfirm, setUsedToConfirm] = React.useState(false)
  const [confirmedBetList, setConfirmedBetList] = React.useState([])

  const navigate = useNavigate(); 

  useEffect(() => {
    // if the list of user bets is empty, reroute to the main page
    if (userBetList.length === 0) { navigate("/") }

    // get the balance of the user if used to actually check out
    if (!usedToConfirm) {
      soccerappClient.get(`/detail`)
        .then((response) => {
          const userBalance = response.data.balance;
          setUserBalance(userBalance);
        })
        .catch((error) => console.log(error))
    }
  }, [])

  // find the total bet amount 
  let totalBetAmount = 0;
  userBetList.forEach(userBet => totalBetAmount += Number(userBet.bet_amount))

  // categorize the unordered list of user bets 
  const organizeUserBet = () => {
    var userBetObj = { moneyline: [], handicap: [], total: [] };
    for (var i = 0; i < userBetList.length; i++) {
      if (userBetList[i].bet_info.under_or_over != undefined) {
        userBetObj.total.push(userBetList[i]);
      }
      else if (userBetList[i].bet_info.handicap_cover != undefined) {
        userBetObj.handicap.push(userBetList[i]);
      }
      else {
        userBetObj.moneyline.push(userBetList[i]);
      }
    }
    return userBetObj;
  }

  // call the POST API to add the categorized bets 
  const postUserBets = (organizedUserBets) => {
    let postRequestArr = [];
    ["moneyline", "handicap", "total"].map(betType => {
      if (organizedUserBets[betType].length !== 0) {
        postRequestArr.push(soccerappClient.post(`/${betType}_bets`, organizedUserBets[betType]))
      }
    })
    // call the chained API endpoints 
    Promise.all(postRequestArr)
      .then((response) => {
        let returnedBetArr = [];
        for (var i = 0; i < response.length; i++) {
          // notify
          console.log("Status for returning first type of bet: " + response[i].status);
          returnedBetArr = returnedBetArr.concat(response[i].data);
        }
        // set status of confirmation & new array of user bets for confirmation 
        setUsedToConfirm(true);
        setConfirmedBetList(returnedBetArr);
        // clear the user bet list in Redux store 
        dispatch(clear());
      })
      .catch(error => console.log(error));
    return true; 
  }

  // render the page based on confirmation status 
  if (usedToConfirm) {
    return (
      <>
        <div className="checkout-bet-list-wrapper">
          <h2 className="checkout-bet-title">You have successfully placed these bets:</h2>
          {confirmedBetList.map(userBet =>
            <div className="checkout-bet-wrapper" key={userBet.bet_info.id}>
              <BetInfoCard userBet={userBet} usedFor="nontable" />
            </div>
          )}
        </div>
        <button 
          onClick={() => navigate("/userbet")}
          style={{border: "none", borderRadius: "0.5rem", fontSize: "1rem", display: "block", margin: "1rem auto", padding: "0.3rem", backgroundColor: "darkslategrey", color: "skyblue"}}>
          Go To Info</button>
      </>
    )
  }
  else {
    return (
      <div className="checkout-layout">
        <div className="checkout-bet-list-wrapper">
          <h2 className="checkout-bet-title">Your picked bets:</h2>
          {userBetList.map(userBet =>
            <div className="checkout-bet-wrapper" key={userBet.bet_info.id}>
              <BetInfoCard userBet={userBet} usedFor="nontable" />
            </div>
          )}
        </div>
        <div>
          <div className="checkout-bet-list-wrapper">
            <h2 className="checkout-bet-title">Summary</h2>
            <div className="checkout-info-wrapper">
              <div className="checkout-info">
                <div>Balance:</div><div>${userBalance}</div>
              </div>
              <hr style={{ width: "95%" }} />
              <div className="checkout-info"><div>Total bet amount:</div><div>${totalBetAmount}</div></div>
              <div className="checkout-info">
                <div>Fee and taxes (5%):</div><div>${(totalBetAmount * 0.05).toFixed(2)}</div>
              </div>
              <hr style={{ width: "95%" }} />
              <div className="checkout-info" style={{ fontSize: "1.5rem", color: "goldenrod" }}>
                <div>Total:</div><div>${(totalBetAmount * 1.05).toFixed(2)}</div>
              </div>
            </div>
          </div>
          <div className="checkout-button" onClick={async () => {
            const organizedUserBets = organizeUserBet(userBetList);
            postUserBets(organizedUserBets);
          }}>PLACE BET</div>
        </div>
      </div>
    )
  }
}

export default CheckOut; 