import React from 'react'
import UserBetTable from '../../UserBetTable/UserBetTable'
import { soccerappClient } from '../../../provider/api'
import './InfoPage.css'

// the main context 
export const UserBetContext = React.createContext();

// bet info card only displays the info of the user's bet, not the wrapper 
export const BetInfoCard = ({ usedFor = "table", userBet }) => {

  // upper case only the first letter of the word 
  const capFirstLetter = (val) => {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
  }

  // if the bet is settled, print the correct outcome of the bet 
  const getAppropriateStatus = (betAmount, payout) => {
    if (betAmount < payout) {
      return "Win";
    } else if (betAmount > payout) {
      return "Lose";
    } else {
      return "Refund";
    }
  }

  var fontSizes = ["0.9rem", "1.1rem", "1rem"];
  if (usedFor === "nontable") { fontSizes = ["1.15rem", "1.2rem", "1.25rem"]; }

  return (
    <div className={`${usedFor}-bet-info-cell`}>
      <div className="cell-child-wrapper ">
        <div style={{ fontSize: fontSizes[0], color: 'yellowgreen' }}>{userBet.bet_info.match_name}</div>
        <div className="main-info-part" style={{ fontSize: fontSizes[1] }}>
          {
            userBet.bet_info.under_or_over !== undefined ? (
              <>
                <span>{userBet.bet_info.under_or_over},</span>
                <span>{userBet.bet_info.target_num_objects} {userBet.bet_info.bet_object} & {capFirstLetter(userBet.bet_info.time_type)},</span>
              </>
            ) : (
              <>
                <span>{userBet.bet_info.bet_team},</span>
                {userBet.bet_info.handicap_cover !== undefined && (<span>{userBet.bet_info.handicap_cover}</span>)}
                <span>{userBet.bet_info.bet_object} & {capFirstLetter(userBet.bet_info.time_type)},</span>
              </>
            )
          }
          <span style={{ color: 'skyblue' }}>@ {userBet.bet_info.odd > 0 ? (<span>+{userBet.bet_info.odd}</span>) : userBet.bet_info.odd}</span>
        </div>
      </div>
      <div className="cell-child-wrapper" style={{ fontSize: fontSizes[2] }}>
        {usedFor === "table" ? (
          <div>{userBet.bet_info.status === "Settled" ?
            getAppropriateStatus(Number(userBet.bet_amount), Number(userBet.payout)) : userBet.bet_info.status}</div>
        ) : (<div>Bet amount: <span style={{ fontSize: "1.75rem" }}>${userBet.bet_amount}</span></div>)}
      </div>
    </div>
  )
}

const InfoPage = () => {
  const [userInfo, setUserInfo] = React.useState({});

  // this function could be passed as props 
  const getUserInfo = () => {
    // get the info of the user 
    soccerappClient.get(`/detail`)
      .then((response) => {
        setUserInfo(response.data);
      })
      .catch((error) => console.log(error))
  }
  React.useEffect(getUserInfo, [])

  return (
    <>
      <div className='personal-info-wrapper'>
        <div style={{ fontSize: "1.5rem", fontWeight: "600" }}>{userInfo.username}</div>
        <div className="detail">
          <div><h4 style={{ margin: "0" }}>First name:</h4> <span>{userInfo.first_name}</span></div>
          <div><h4 style={{ margin: "0" }}>Last name:</h4> <span>{userInfo.last_name}</span></div>
          <div><h4 style={{ margin: "0" }}>Email:</h4> <span>{userInfo.email}</span></div>
          <div><h4 style={{ margin: "0" }}>Balance:</h4> <span style={{ fontSize: "1.5rem" }}>${userInfo.balance}</span></div>
        </div>
      </div>
      <div>
        <UserBetTable status="Unsettled" userInfo={userInfo} handleUpdateInfo={getUserInfo} />
        <UserBetTable status="Unsettled" betType="Handicap" userInfo={userInfo} handleUpdateInfo={getUserInfo} />
        <UserBetTable status="Unsettled" betType="Total" userInfo={userInfo} handleUpdateInfo={getUserInfo} />
      </div>

      

      <div style={{marginTop: "5rem"}}>
        <UserBetTable status="Settled" userInfo={userInfo} />
        <UserBetTable status="Settled" betType="Handicap" />
        <UserBetTable status="Settled" betType="Total" />
      </div>
    </>
  )
}


export default InfoPage;
