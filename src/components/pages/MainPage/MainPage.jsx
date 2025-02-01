import React from 'react';
import { freeClient } from '../../../provider/api.js';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { HashLink } from 'react-router-hash-link';
import Match from '../../Match/Match.jsx';
import FinishedMatch from '../../Finishedmatch/FinishedMatch.jsx';
import StandingTable from '../../StandingTable/StandingTable.jsx';
import './MainPage.css'

const MainPage = ({ matchFinished }) => {
  const [leagueName, setLeagueName] = React.useState("epl");
  const [finishedMatches, setFinishedMatches] = React.useState([]);
  const [upcomingMatches, setUpcomingMatches] = React.useState({ ucl: [], epl: [], lal: [], bun: [] });

  // used for clicking effect
  const [clickedLeague, setClickedLeague] = React.useState(null);
  React.useEffect(() => {
    setClickedLeague(null);
    window.scroll(0, 0);
  }, [matchFinished])

  const leagueNameMap = { "ucl": "Champions League", "epl": "Premiere League", "lal": "La Liga", "bun": "Bundesliga" }
  const pageNavTheme = { textDecoration: "none", color: "black" }


  // get the not started matches 
  const getMatches = () => {
    // get the upcoming matches 
    if (!matchFinished) {
      // array of requests to call 
      var leagueRequestArr = [];
      ["ucl", "epl", "lal", "bun"].forEach((league) => {
        leagueRequestArr.push(freeClient.get(`/matches?league=${league}&status=NF`));
      })
      Promise.all(leagueRequestArr)
        .then((response) => {
          console.log("Total requests for getting upcoming matches: " + response[0].status);
          setUpcomingMatches({
            ucl: response[0].data, epl: response[1].data, // ucl and epl upcoming matches
            lal: response[2].data, bun: response[3].data, // lal and bun upcoming matches 
          });
        })
        .catch((error) => console.log(error));
    }
    // get the finished matches 
    else {
      freeClient.get(`/matches?league=${leagueName}&status=FN`)
        .then((response) => {
          console.log("Get the finished matches status: " + response.status);
          setFinishedMatches(response.data);
        })
        .catch((error) => console.log(error));
    }
  }
  // call the function whenever change the finished status of the matches
  React.useEffect(getMatches, [matchFinished, leagueName]);

  const setButtonColor = (argLeague) => {
    if (matchFinished) {
      if (argLeague === leagueName) return { backgroundColor: "rgb(228, 223, 223)" }
      return { backgroundColor: "white" }
    } else {
      if (argLeague === clickedLeague) return { backgroundColor: "rgb(228, 223, 223)" }
      return { backgroundColor: "white" }
    }
  }

  const isSmallDevice = useMediaQuery({ query: "(max-width: 700px)" });
  const scrollWithOffset = (el) => {
    const yCoordinate = el.getBoundingClientRect().top + window.scrollY;
    let yOffset = isSmallDevice ? -100 : -50;
    window.scrollTo({ top: yCoordinate + yOffset, behavior: 'smooth' });
  }

  return (
    <div className="main-page">
      { /* Nested loop for map() */
        !matchFinished ? (
          <>
            <div className="page-navbar">
              <HashLink smooth to="/#ucl" style={pageNavTheme} scroll={scrollWithOffset}>
                <div onClick={() => setClickedLeague("ucl")} style={setButtonColor("ucl")}>Champions League</div>
              </HashLink>
              <HashLink smooth to="/#epl" style={pageNavTheme} scroll={scrollWithOffset}>
                <div onClick={() => setClickedLeague("epl")} style={setButtonColor("epl")}>Premiere League</div>
              </HashLink>
              <HashLink smooth to="/#lal" style={pageNavTheme} scroll={scrollWithOffset}>
                <div onClick={() => setClickedLeague("lal")} style={setButtonColor("lal")}>La Liga</div>
              </HashLink>
              <HashLink smooth to="/#bun" style={pageNavTheme} scroll={scrollWithOffset}>
                <div onClick={() => setClickedLeague("bun")} style={setButtonColor("bun")}>Bundesliga</div>
              </HashLink>
            </div>
            <div>
              {["ucl", "epl", "lal", "bun"].map(item =>
                <div id={item} key={item} >
                  {upcomingMatches[item].length !== 0 && <h3 className="league-title">{leagueNameMap[item]} Upcoming Matches</h3>}
                  <div className="match-list-wrapper" >
                    {upcomingMatches[item].map(match =>
                      <Link to={`/bet/${match.match_id}`} key={match.id} style={{ textDecoration: "none" }}>
                        <Match
                          league={match.league} date={match.date} status={match.status}
                          homeTeam={match.home_team} homeTeamLogo={match.home_team_logo}
                          awayTeam={match.away_team} awayTeamLogo={match.away_team_logo} />
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="page-navbar">
              <div onClick={() => setLeagueName("ucl")} style={setButtonColor("ucl")}>Champions League</div>
              <div onClick={() => setLeagueName("epl")} style={setButtonColor("epl")}>Premiere League</div>
              <div onClick={() => setLeagueName("lal")} style={setButtonColor("lal")}>La Liga</div>
              <div onClick={() => setLeagueName("bun")} style={setButtonColor("bun")}>Bundesliga</div>
            </div>
            <div className="finished-layout">
              {/* Display the standing table along with finished matches */}
              <StandingTable leagueName={leagueName} />

              <div>
                <h3 className="finished-matches-title">{leagueName.toUpperCase()} Last Matches' Stat</h3>
                <div className="finished-match-list-wrapper">
                  {finishedMatches.map(match =>
                    <FinishedMatch
                      key={match.id} date={match.date} updatedDate={match.updated_date} status={match.status}
                      homeTeam={match.home_team} homeTeamLogo={match.home_team_logo}
                      awayTeam={match.away_team} awayTeamLogo={match.away_team_logo}
                      fulltimeScore={match.fulltime_score} halftimeScore={match.halftime_score}
                      penalty={match.penalty} posession={match.possesion}
                      totalShots={match.total_shots} corners={match.corners}
                      cards={match.cards} />
                  )}
                  {finishedMatches.length === 0 && (<div className="no-match-wrapper">There are no matches available</div>)}
                </div>
              </div>
            </div>
          </>
        )
      }
    </div>
  )
}

export default MainPage;