import { useState, useEffect } from 'react'
import { freeClient } from '@provider/api'
import MoneylineBet from '@components/Bet/MoneylineBet'
import HandicapBet from '@components/Bet/HandicapBet'
import TotalBet from '@components/Bet/TotalBet'
import Match from '@components/Match/Match'
import { useParams, Link } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import { useSelector, useDispatch } from 'react-redux'
import { addBet } from '@redux/reducer'
import { HashLink } from 'react-router-hash-link'

function NonBet() {
  return <div 
    className="shadow-lg w-2/3 bg-[darkslategray] mt-2 mx-auto py-4 text-center text-lg text-[skyblue] font-semibold border-[goldrenrod] bolder-2 rounded-lg"
  >
    Bets not available yet
  </div>
}

export default function BetPage() {
  const { matchId } = useParams()
  const [match, setMatch] = useState({})
  const [betType, setBetType] = useState("Goals")

  const [moneylineInfo, setMoneylineInfo] = useState({ half_time: [], full_time: [] })
  const [handicapInfo, setHandicapInfo] = useState({ half_time: [], full_time: [] })
  const [totalObjsInfo, setTotalObjsInfo] = useState({ half_time: [], full_time: [] })

  const userBetList = useSelector(state => state.userBetList)
  const isSmallDevice = useMediaQuery({ query: "(max-width: 700px)" })
  const dispatch = useDispatch()

  const betTitle = "w-2/3 m-auto text-xl font-semibold mt-4"

  // scroll to window 
  useEffect(() => window.scroll(0, 0), [])

  // this useEffect is used to fetch the match info, called only once
  useEffect(() => {
    freeClient.get(`/matches/${matchId}`)
      .then((response) => {
        setMatch(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    const betRequests = [];
    ["moneyline_bet_info", "handicap_bet_info", "total_bet_info"].forEach((item) => {
      betRequests.push(
        freeClient.get(`/match/${matchId}/${item}?bet_object=${betType}`)
      );
    })
    Promise.all(betRequests)
      .then((response) => {
        setMoneylineInfo(response[0].data);
        setHandicapInfo(response[1].data);
        setTotalObjsInfo(response[2].data);
      })
      .catch((error) => console.log(error));
  }, [betType]);

  function setButtonColor(betObject) {
    if (betObject === betType) {
      return {
        backgroundColor: "darkslategray", color: "skyblue"
      };
    }
    return {
      backgroundColor: "white", color: "black"
    }
  }

  function scrollWithOffset(e) {
    const yCoordinate = e.getBoundingClientRect().top + window.scrollY;
    const yOffset = isSmallDevice ? -100 : -50;
    window.scrollTo({
      top: yCoordinate + yOffset,
      behavior: 'smooth'
    });
  }

  return (
    <div className="ml-40 mb-15">
      <div className="bg-[darkcyan] w-full fixed top-0 flex flex-row gap-2 p-2 z-3">
        {["moneyline", "handicap", "total-object"].map(betType =>
          <HashLink
            className="py-1 px-2 text-[white] text-lg rounded-xl font-medium hover:bg-[gray]"
            smooth to={`#${betType}-info-list`}
            scroll={scrollWithOffset}
          >
            <div>
              {betType === "total-object" ?
                "Under/Over" :
                betType[0].toLocaleUpperCase() + betType.slice(1)}
            </div>
          </HashLink>
        )}
      </div>
      <div className="mt-15">
        <div className="w-2/3 m-auto">
          <Link to="/">
            <h2 className="font-semibold text-xl hover:text-[skyblue] mb-2">Go Back</h2>
          </Link>
          <Match
            key={match.id}
            league={match.league}
            date={match.date}
            homeTeam={match.home_team} homeTeamLogo={match.home_team_logo}
            awayTeam={match.away_team} awayTeamLogo={match.away_team_logo}
            status={match.status} 
          />
        </div>

        <div className="flex flex-row gap-3 mt-4 justify-center">
          {["Goals", "Corners", "Cards"].map(betObject =>
            <button
              className="px-2 py-1 rounded-lg text-lg text-semibold shadow-md"
              style={setButtonColor(betObject)}
              onClick={() => setBetType(betObject)}
            >{betObject}</button>
          )}
        </div>

        <div id="moneyline-info-list">
          <h2 className={betTitle}>3-Way Moneyline Bets</h2>
          {moneylineInfo.half_time.length != 0 &&
            <h2 className="w-2/3 my-2 mx-auto font-medium text-lg">Halftime</h2>
          }
          <MoneylineBet
            betInfo={moneylineInfo.half_time}
            handleClick={(betInfo) => dispatch(addBet(betInfo))}
            userBetList={userBetList}
          />

          {moneylineInfo["full_time"].length != 0 &&
            <h2 className="w-2/3 my-2 mx-auto font-medium text-lg">Fulltime</h2>
          }
          <MoneylineBet
            betInfo={moneylineInfo.full_time}
            handleClick={(betInfo) => dispatch(addBet(betInfo))}
            userBetList={userBetList}
          />

          {(moneylineInfo.full_time.length === 0 &&
            moneylineInfo.half_time.length === 0) &&
            <NonBet />
          }
        </div>

        <div id="handicap-info-list">
          <h2 className={betTitle}>Handicap Bets (Spread)</h2>
          {/* display halftime handicap bet info of the match */}
          {handicapInfo.half_time.length != 0 && (
            <h2 className="w-2/3 my-2 mx-auto font-medium text-lg">Halftime</h2>
          )}
          {handicapInfo.half_time.map(betInfo =>
            <HandicapBet
              key={betInfo.home != null ? betInfo.home.id : betInfo.away.id}
              betInfo={betInfo}
              handleClick={(betInfo) => dispatch(addBet(betInfo))}
              userBetList={userBetList}
            />)
          }

          {/* display fulltime handicap bet info of the match */}
          {handicapInfo.full_time.length != 0 && 
            <h2 className="w-2/3 my-2 mx-auto font-medium text-lg">Fulltime</h2>
          }
          {handicapInfo.full_time.map(betInfo =>
            <HandicapBet
              key={
                betInfo.home != null ? 
                  betInfo.home.id : 
                  betInfo.away.id
              }
              betInfo={betInfo} handleClick={(betInfo) => dispatch(addBet(betInfo))}
              userBetList={userBetList}
            />)
          }

          {(handicapInfo.half_time.length === 0 && 
            handicapInfo.full_time.length === 0) &&
            <NonBet />
          }
        </div>

        <div id="total-object-info-list">
          <h2 className={betTitle}>Total {betType} Bets</h2>
          {/* display halftime total bet info of the match */}
          {totalObjsInfo.half_time.length != 0 && 
            <h2 className="w-2/3 my-2 mx-auto font-medium text-lg">Halftime</h2>
          }
          {totalObjsInfo.half_time.map(betInfo =>
            <TotalBet
              key={betInfo.under != null ? betInfo.under.id : betInfo.over.id}
              betInfo={betInfo}
              handleClick={(betInfo) => dispatch(addBet(betInfo))}
              userBetList={userBetList}
            />)
          }

          {/* display fulltime total bet info of the match */}
          {totalObjsInfo.full_time.length != 0 && 
            <h2 className="w-2/3 my-2 mx-auto font-medium text-lg">Fulltime</h2>
          }
          {totalObjsInfo.full_time.map(betInfo =>
            <TotalBet
              key={betInfo.under != null ? betInfo.under.id : betInfo.over.id}
              betInfo={betInfo}
              handleClick={(betInfo) => dispatch(addBet(betInfo))}
              userBetList={userBetList}
            />)
          }

          {(totalObjsInfo.half_time.length === 0 && 
            totalObjsInfo.full_time.length === 0) &&
            <NonBet />
          }
        </div>
      </div>
    </div>
  )
}