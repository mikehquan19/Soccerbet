import { createContext, useEffect, useState } from 'react'
import UserBetTable from '@tables/UserBetTable/UserBetTable'
import { soccerappClient } from '@provider/api'

// Main context
export const UserBetContext = createContext();

export const BetInfoCard = ({ usedFor = "table", userBet }) => {
  const capitalize = val =>
    String(val).charAt(0).toUpperCase() + String(val).slice(1)

  const getAppropriateStatus = (betAmount, payout) => {
    if (betAmount < payout) return "Win"
    if (betAmount > payout) return "Lose"
    return "Refund"
  }

  return (
    <div className={`text-lg ${usedFor === "table" ? "flex justify-between" : ""}`}>
      {/* First child wrapper */}
      <div>
        <div className="text-xl my-1">
          {userBet.bet_info.match_league}
        </div>
        <div className="text-xl text-[yellowgreen] my-1">
          <span>{userBet.bet_info.match_name}, </span>
          <span>{userBet.bet_info.match_time}</span>
        </div>
        <div className="flex flex-wrap gap-1 text-lg">
          {userBet.bet_info.under_or_over !== undefined ? (
            <>
              <span>{userBet.bet_info.under_or_over},</span>
              <span>{userBet.bet_info.target_num_objects} </span>
              <span>{userBet.bet_info.bet_object} & </span>
              <span>{capitalize(userBet.bet_info.time_type)},</span>
            </>
          ) : (
            <>
              <span>{userBet.bet_info.bet_team},</span>
              {userBet.bet_info.handicap_cover && <span>{userBet.bet_info.handicap_cover}</span>}
              <span>{userBet.bet_info.bet_object} & {capitalize(userBet.bet_info.time_type)},</span>
            </>
          )}
          <span className="text-sky-400">
            @ {userBet.bet_info.odd > 0 ? `+${userBet.bet_info.odd}` : userBet.bet_info.odd}
          </span>
        </div>
      </div>

      {/* Second child wrapper */}
      <div className={
        `${
          usedFor === "nontable" ? "text-right" : "flex flex-row items-center"
        } text-lg`
      }>
        {usedFor === "table" ? (
          <div className="bg-[peru] text-white text-sm shadow-lg rounded p-1">
            {userBet.bet_info.status === "Settled"
              ? getAppropriateStatus(Number(userBet.bet_amount), Number(userBet.payout))
              : userBet.bet_info.status}
          </div>
        ) : (
          <div>
            <span>Bet amount: </span>
            <span className="text-3xl">{userBet.bet_amount} tokens</span>
          </div>
        )}
      </div>
    </div>
  )
}

const InfoPage = () => {
  const [userInfo, setUserInfo] = useState({})

  const getUserInfo = () => {
    soccerappClient.get(`/detail`)
      .then(res => setUserInfo(res.data))
      .catch(err => console.log(err))
  }

  useEffect(getUserInfo, [])

  return (
    <div className="ml-40 mt-4">
      <div className="mx-auto rounded-xl font-normal w-4/5">
        <div className="text-4xl font-semibold">{userInfo.username}</div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <h4 className="text-md">First name:</h4>
            <span className="text-xl font-medium">{userInfo.first_name}</span>
          </div>
          <div>
            <h4 className="text-md">Last name:</h4>
            <span className="text-xl font-medium">{userInfo.last_name}</span>
          </div>
          <div>
            <h4 className="text-md">Email:</h4>
            <span className="text-xl font-medium">{userInfo.email}</span>
          </div>
          <div>
            <h4 className="text-md">Balance:</h4>
            <span className="text-xl font-medium">{userInfo.balance} Tokens</span>
          </div>
        </div>
      </div>

      {/* Unsettled bets */}
      <div className="mt-8 space-y-4">
        <UserBetTable 
          status="Unsettled" 
          userInfo={userInfo} 
          handleUpdateInfo={getUserInfo} 
        />
        <UserBetTable 
          status="Unsettled"
          betType="Handicap" 
          userInfo={userInfo} 
          handleUpdateInfo={getUserInfo} 
        />
        <UserBetTable 
          status="Unsettled" 
          betType="Total" 
          userInfo={userInfo} 
          handleUpdateInfo={getUserInfo} 
        />
      </div>

      {/* Settled bets */}
      <div className="mt-20 space-y-4">
        <UserBetTable status="Settled" userInfo={userInfo} />
        <UserBetTable status="Settled" betType="Handicap" />
        <UserBetTable status="Settled" betType="Total" />
      </div>
    </div>
  )
}

export default InfoPage
