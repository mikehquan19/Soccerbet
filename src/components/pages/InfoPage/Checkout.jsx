import { BetInfoCard } from './InfoPage'
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { clear } from "@redux/reducer"
import { useNavigate } from "react-router-dom"
import { soccerappClient } from "@provider/api"

const CheckOut = () => {
  const userBetList = useSelector(state => state.userBetList)
  const dispatch = useDispatch()
  const [userBalance, setUserBalance] = React.useState(null)
  const [usedToConfirm, setUsedToConfirm] = React.useState(false)
  const [confirmedBetList, setConfirmedBetList] = React.useState([])

  const navigate = useNavigate(); 

  useEffect(() => {
    if (userBetList.length === 0) navigate("/")

    if (!usedToConfirm) {
      soccerappClient.get(`/detail`)
        .then((response) => setUserBalance(response.data.balance))
        .catch((error) => console.log(error))
    }
  }, [])

  let totalBetAmount = 0
  userBetList.forEach(userBet => totalBetAmount += Number(userBet.bet_amount))

  const organizeUserBet = () => {
    const userBetObj = { moneyline: [], handicap: [], total: [] }
    userBetList.forEach(bet => {
      if (bet.bet_info.under_or_over !== undefined) userBetObj.total.push(bet)
      else if (bet.bet_info.handicap_cover !== undefined) userBetObj.handicap.push(bet)
      else userBetObj.moneyline.push(bet)
    })
    return userBetObj
  }

  const postUserBets = (organizedUserBets) => {
    let postRequestArr = [];
    ["moneyline", "handicap", "total"].map(betType => {
      if (organizedUserBets[betType].length !== 0) {
        postRequestArr.push(soccerappClient.post(`/${betType}_bets`, organizedUserBets[betType]))
      }
    })

    Promise.all(postRequestArr)
      .then((response) => {
        let returnedBetArr = []
        response.forEach(res => {
          console.log("Status for returning first type of bet:", res.status)
          returnedBetArr = returnedBetArr.concat(res.data)
        })
        setUsedToConfirm(true)
        setConfirmedBetList(returnedBetArr)
        dispatch(clear())
      })
      .catch(error => console.log(error))
    return true
  }

  if (usedToConfirm) {
    return (
      <div className="ml-40">
        <div className="w-4/5 mx-auto mt-4">
          <h2 className="font-medium bg-[darkslategrey] text-sky-400 text-xl p-2 rounded-t-lg">
            You have successfully placed these bets:
          </h2>
          <div className="border-1 rounded-b-lg">
            {confirmedBetList.map(userBet => (
              <div
                key={userBet.bet_info.id}
                className="my-4 mx-2 p-4 border-2 rounded-lg font-medium"
              >
                <BetInfoCard userBet={userBet} usedFor="nontable" />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => navigate("/userbet")}
          className="block mx-auto mt-4 border-none rounded-md text-lg font-medium bg-[darkslategrey] text-sky-400 px-3 py-1"
        >
          Go To Info
        </button>
      </div>
    )
  } else {
    return (
      <div className="ml-40">
        <div className="w-9/10 mx-auto grid grid-cols-[2fr_1fr] gap-4 mt-10">
          <div className="w-full mx-auto border-1 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold bg-[darkslategrey] text-sky-400 p-2 rounded-t-lg">
              Your picked bets:
            </h2>
            {userBetList.map(userBet => (
              <div
                key={userBet.bet_info.id}
                className="my-4 mx-2 p-2 border-2 rounded-xl font-medium"
              >
                <BetInfoCard userBet={userBet} usedFor="nontable" />
              </div>
            ))}
          </div>

          {/* Summary Section */}
          <div>
            <div className="w-full mx-auto border-black pb-2 rounded-xl shadow-lg">
              <h2 className="font-semibold bg-[darkslategrey] text-sky-400 text-xl p-2 rounded-t-xl">
                Summary
              </h2>

              <div className="font-medium text-xl">
                <div className="flex justify-between w-9/10 mx-auto my-2">
                  <div>Balance:</div>
                  <div>{userBalance} tokens</div>
                </div>
                <hr className="w-9/10 mx-auto" />
                <div className="flex justify-between w-9/10 mx-auto my-2">
                  <div>Total bet amount:</div>
                  <div>{totalBetAmount} tokens</div>
                </div>
                <div className="flex justify-between w-9/10 mx-auto my-2">
                  <div>Fee (5%):</div>
                  <div>{(totalBetAmount * 0.05).toFixed(2)} tokens</div>
                </div>
                <hr className="w-9/10 mx-auto" />
                <div className="flex justify-between w-9/10 mx-auto my-2 text-[goldenrod] text-2xl">
                  <div>Total:</div>
                  <div>{(totalBetAmount * 1.05).toFixed(2)} tokens</div>
                </div>
              </div>
            </div>

            <div
              className="font-semibold text-xl bg-[darkslategray] text-white mt-4 py-2 shadow-lg text-center rounded-lg cursor-pointer hover:bg-[darkslateblue] transition-all"
              onClick={() => {
                const organizedUserBets = organizeUserBet(userBetList)
                postUserBets(organizedUserBets)
              }}
            >
              PLACE BET
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default CheckOut
