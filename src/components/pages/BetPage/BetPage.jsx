import React from 'react'
import { freeClient } from '../../../provider/api.js'
import MoneylineBet from '../../Bet/MoneylineBet.jsx'
import HandicapBet from '../../Bet/HandicapBet.jsx'
import TotalBet from '../../Bet/TotalBet.jsx'
import Match from '../../Match/Match.jsx'
import { useParams, Link } from 'react-router-dom'
import {useMediaQuery} from 'react-responsive'
import { useSelector, useDispatch } from 'react-redux'
import { addBet } from '../../../redux/reducer.js'
import { HashLink } from 'react-router-hash-link'
import './BetPage.css'

const NonBet = () => {
  return <div className="non-bet">Bets not available yet </div>
}

const BetPage = () => {
  const { matchId } = useParams();

  const [match, setMatch] = React.useState({});
  const [betType, setBetType] = React.useState("Goals");

  const [moneylineInfo, setMoneylineInfo] = React.useState({ "half_time": [], "full_time": [] })
  const [betInfoList, setBetInfoList] = React.useState({ "half_time": [], "full_time": [] })
  const [totalInfo, setTotalInfo] = React.useState({ "half_time": [], "full_time": [] })

  // used for clicking effect
  const [clickedType, setClickedType] = React.useState(null);

  const pageNavTheme = { textDecoration: "none", color: "black" }

  const userBetList = useSelector(state => state.userBetList)
  const dispatch = useDispatch()
  console.log(JSON.stringify(userBetList));

  // scroll to window 
  React.useEffect(() => window.scroll(0, 0), [])

  // this useEffect is used to fetch the match info, called only once
  React.useEffect(() => {
    freeClient.get(`/matches/${matchId}`)
      .then((response) => {
        console.log(`Get info match ${matchId}: ` + response.status);
        const matchInfo = response.data;
        setMatch(matchInfo);
      })
      .catch((error) => console.log(error));
  }, []);

  // this useEffect is used to fetch the info of the bets 
  React.useEffect(() => {
    var betRequestArr = [];
    ["moneyline_bet_info", "handicap_bet_info", "total_bet_info"].forEach(item => {
      betRequestArr.push(freeClient.get(`/match/${matchId}/${item}?bet_obj=${betType}`));
    })
    Promise.all(betRequestArr)
      .then((response) => {
        console.log("Total response status: " + (response[0].status + response[1].status + response[2].status));
        const moneylineBetInfos = response[0].data; // first is moneyline
        const handicapBetInfos = response[1].data;  // second is handicap
        const totalBetInfos = response[2].data;     // third is total objects

        setMoneylineInfo(moneylineBetInfos);
        setBetInfoList(handicapBetInfos);
        setTotalInfo(totalBetInfos);
      })
      .catch((error) => console.log(error));
  }, [betType]);

  const setNavColor = (betType) => {
    if (betType === clickedType) return { backgroundColor: "rgb(228, 223, 223)" }
    return { backgroundColor: "white" }
  }

  const setButtonColor = (argObject) => {
    if (argObject === betType) return { backgroundColor: "darkslategray", color: "skyblue" }
    return { backgroundColor: "white", color: "black" }
  }

  const isSmallDevice = useMediaQuery({query: "(max-width: 700px)"});
  const scrollWithOffset = (el) => {
    const yCoordinate = el.getBoundingClientRect().top + window.scrollY;
    let yOffset = isSmallDevice ? -100 : -50; 
    window.scrollTo({ top: yCoordinate + yOffset, behavior: 'smooth' }); 
  }

  return (
    <>
      <div className="page-navbar">
        <HashLink smooth to="#moneyline-info-list" style={pageNavTheme} scroll={scrollWithOffset}>
          <div onClick={() => setClickedType("moneyline")} style={setNavColor("moneyline")}>3-way moneline</div>
        </HashLink>
        <HashLink smooth to="#handicap-info-list" style={pageNavTheme} scroll={scrollWithOffset}>
          <div onClick={() => setClickedType("handicap")} style={setNavColor("handicap")}>Handicap (Spread)</div>
        </HashLink>
        <HashLink smooth to="#total-object-info-list" style={pageNavTheme} scroll={scrollWithOffset}>
          <div onClick={() => setClickedType("total")} style={setNavColor("total")}>Under/Over</div>
        </HashLink>
      </div>
      <div className="bet-page">
        <div style={{ maxWidth: "900px", margin: "auto" }}>
          <Link to="/" style={{ textDecoration: "none" }}><h2 className="back">Go Back</h2></Link>
          <Match
            key={match.id} league={match.league} date={match.date}
            homeTeam={match.home_team} homeTeamLogo={match.home_team_logo}
            awayTeam={match.away_team} awayTeamLogo={match.away_team_logo}
            status={match.status} />
        </div>

        <div className="bet-type-button-wrapper">
          <button style={setButtonColor("Goals")} onClick={() => setBetType("Goals")}>Goals</button>
          <button style={setButtonColor("Corners")} onClick={() => setBetType("Corners")}>Corners</button>
          <button style={setButtonColor("Cards")} onClick={() => setBetType("Cards")}>Cards</button>
        </div>

        { /* If there are no moneyline bets available for cards */
          betType != "Cards" && (
            <>
              <div id="moneyline-info-list">
                <h2 className="bet-title">3-Way Moneyline Bets</h2>
                {moneylineInfo["half_time"].length != 0 && (<h2 className="time-type">Halftime</h2>)}
                <MoneylineBet
                  betInfo={moneylineInfo["half_time"]} handleClick={(betInfo) => dispatch(addBet(betInfo))}
                  userBetList={userBetList} />

                {moneylineInfo["full_time"].length != 0 && (<h2 className="time-type">Fulltime</h2>)}
                <MoneylineBet
                  betInfo={moneylineInfo["full_time"]} handleClick={(betInfo) => dispatch(addBet(betInfo))}
                  userBetList={userBetList} />

                {(moneylineInfo["half_time"].length === 0 && moneylineInfo["full_time"].length === 0) && <NonBet />}
              </div>
            </>
          )
        }

        <div id="handicap-info-list">
          <h2 className="bet-title">Handicap Bets (Spread)</h2>
          {/* display halftime handicap bet info of the match */}
          {betInfoList["half_time"].length != 0 && (<h2 className="time-type">Halftime</h2>)}
          {betInfoList["half_time"].map(betInfo =>
            <HandicapBet
              key={betInfo.home != null ? betInfo.home.id : betInfo.away.id}
              betInfo={betInfo} handleClick={(betInfo) => dispatch(addBet(betInfo))} userBetList={userBetList} />)}

          {/* display fulltime handicap bet info of the match */}
          {betInfoList["full_time"].length != 0 && (<h2 className="time-type">Fulltime</h2>)}
          {betInfoList["full_time"].map(betInfo =>
            <HandicapBet
              key={betInfo.home != null ? betInfo.home.id : betInfo.away.id}
              betInfo={betInfo} handleClick={(betInfo) => dispatch(addBet(betInfo))} userBetList={userBetList} />)}

          {(betInfoList["half_time"].length === 0 && betInfoList["full_time"].length === 0) && <NonBet />}
        </div>

        <div id="total-object-info-list">
          <h2 className="bet-title">Total {betType} Bets</h2>
          {/* display halftime total bet info of the match */}
          {totalInfo["half_time"].length != 0 && (<h2 className="time-type">Halftime</h2>)}
          {totalInfo["half_time"].map(betInfo =>
            <TotalBet
              key={betInfo.under != null ? betInfo.under.id : betInfo.over.id}
              betInfo={betInfo} handleClick={(betInfo) => dispatch(addBet(betInfo))} userBetList={userBetList} />)}

          {/* display fulltime total bet info of the match */}
          {totalInfo["full_time"].length != 0 && (<h2 className="time-type">Fulltime</h2>)}
          {totalInfo["full_time"].map(betInfo =>
            <TotalBet
              key={betInfo.under != null ? betInfo.under.id : betInfo.over.id}
              betInfo={betInfo} handleClick={(betInfo) => dispatch(addBet(betInfo))} userBetList={userBetList} />)}


          {(totalInfo["half_time"].length === 0 && totalInfo["full_time"].length === 0) && <NonBet />}
        </div>
      </div>
    </>
  )
}


export default BetPage;