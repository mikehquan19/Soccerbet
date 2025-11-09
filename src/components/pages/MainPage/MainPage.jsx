import { useState, useEffect } from 'react';
import { freeClient } from '@provider/api';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { HashLink } from 'react-router-hash-link';
import Match from '@components/Match/Match';
import FinishedMatch from '@components/Finishedmatch/FinishedMatch';
import StandingTable from '@tables/StandingTable/StandingTable';

export default function MainPage({ matchFinished }) {
  const [leagueName, setLeagueName] = useState("epl");
  const [finishedMatches, setFinishedMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState({
    ucl: [], epl: [], lal: [], 
    bun: [], ser: [], lea: []
  });
  const isSmallDevice = useMediaQuery({ query: "(max-width: 700px)" });

  const leagueNameMap = {
    "ucl": "Champions League",
    "epl": "Premiere League",
    "lal": "La Liga",
    "bun": "Bundesliga",
    "ser": "Serie A",
    "lea": "League 1"
  }

  /**
   * Fetch the list of matches from the backend
   */
  function getMatches() {
    if (!matchFinished) {
      // Get the upcoming matches 
      const matchesRequests = []; // array of requests to call 
      Object.keys(leagueNameMap).forEach((league) => {
        matchesRequests.push(freeClient.get(`/matches?league=${league}&status=NF`));
      })
      Promise.all(matchesRequests)
        .then((response) => {
          setUpcomingMatches({
            ucl: response[0].data, epl: response[1].data,
            lal: response[2].data, bun: response[3].data,
            ser: response[4].data, lea: response[5].data,
          });
        })
        .catch((error) => console.log(error));
    } else {
      // Get the finished matches
      freeClient.get(`/matches?league=${leagueName}&status=FN`)
        .then((response) => {
          setFinishedMatches(response.data);
        })
        .catch((error) => console.log(error));
    }
  }

  function scrollWithOffset(e) {
    const y = e.getBoundingClientRect().top + window.scrollY;
    const yOffset = isSmallDevice ? -100 : -50;
    window.scrollTo({
      top: y + yOffset,
      behavior: 'smooth'
    });
  }

  // Used for clicking effect
  useEffect(() => { window.scroll(0, 0) }, [matchFinished])
  // Call the function whenever change the finished status of the matches
  useEffect(getMatches, [matchFinished, leagueName]);

  if (!matchFinished) {
    return (
      <div className="ml-40 mb-15">
        <div className="bg-[darkcyan] w-full fixed top-0 flex flex-row gap-2 p-2 z-3">
          {Object.keys(leagueNameMap).map(league =>
            <HashLink
              key={league}
              className="py-1 px-2 text-[white] text-lg rounded-xl font-medium hover:bg-[gray]"
              smooth to={"/#" + league}
              scroll={scrollWithOffset}
            >
              {leagueNameMap[league]}
            </HashLink>
          )}
        </div>
        <div className="mt-9">
          <div className="col-span-2">
            {Object.keys(leagueNameMap).map(item =>
              <div id={item} key={item}>
                <div className="sticky top-13 bg-[skyblue] p-2 w-full text-xl font-semibold">
                  {leagueNameMap[item]} Upcoming Games
                </div>
                {upcomingMatches[item].length === 0 &&
                  <div className={
                    `text-2xl text-center text-[gray] font-semibold ${item === 'ucl' ? "mt-8" : "mt-4"}`
                  }>
                    Upcoming games will be updated soon
                  </div>
                }
                <div className={
                  `px-2 mx-auto ${item === 'ucl' ? "" : "mt-4"} mb-4 grid grid-cols-2 gap-4`
                } >
                  {upcomingMatches[item].map(match =>
                    <Link key={match.id} to={`/bet/${match.match_id}`}>
                      <Match
                        league={match.league}
                        date={match.date}
                        status={match.status}
                        homeTeam={match.home_team}
                        homeTeamLogo={match.home_team_logo}
                        awayTeam={match.away_team}
                        awayTeamLogo={match.away_team_logo}
                      />
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className="ml-40 mb-15">
        <div className="bg-[darkcyan] w-full fixed top-0 flex flex-row gap-2 p-2 z-3">
          {Object.keys(leagueNameMap).map((league) =>
            <div
              key={league}
              className="py-1 px-2 text-[white] text-lg rounded-xl font-medium hover:bg-[gray]"
              onClick={() => setLeagueName(league)}
            >
              {leagueNameMap[league]}
            </div>
          )}
        </div>
        <div className="mt-14 px-4 py-2 mb-4 grid grid-cols-3 auto-rows-fr gap-2">
          <div className="col-span-2">
            <StandingTable leagueName={leagueName} />
          </div>

          <div className="bg-[darkgray] p-2 rounded-xl">
            <h3 className="text-xl font-semibold py-2 text-white">
              {leagueNameMap[leagueName]} Finished Matches' Stat
            </h3>
            <div className="mt-2 h-230 overflow-y-auto">
              {finishedMatches.map(match =>
                <FinishedMatch
                  key={match.id}
                  date={match.date}
                  updatedDate={match.updated_date}
                  status={match.status}
                  homeTeam={match.home_team} 
                  homeTeamLogo={match.home_team_logo}
                  awayTeam={match.away_team} 
                  awayTeamLogo={match.away_team_logo}
                  fulltimeScore={match.fulltime_score}
                  halftimeScore={match.halftime_score}
                  penalty={match.penalty} 
                  posession={match.possesion}
                  totalShots={match.total_shots}
                  corners={match.corners} 
                  cards={match.cards}
                />
              )}
              {finishedMatches.length === 0 && (
                <div className="text-center text-white text-2xl mt-4">
                  There are no matches available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}