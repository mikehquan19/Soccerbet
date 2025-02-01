import './StandingTable.css';
import {freeClient } from '../../provider/api';
import React from "react";

const StandingTable = ({ leagueName = 'epl' }) => {

  const [standings, setStandings] = React.useState([]);

  React.useEffect(() => {
    if (leagueName === "ucl") { leagueName = "epl" }
    freeClient.get(`/standings?league=${leagueName}`)
      .then((response) => {
        console.log(`Get info standings of ${leagueName}: ` + response.status);
        const leagueStandings = response.data;
        setStandings(leagueStandings);
      })
      .catch((error) => console.log(error));
  }, [leagueName])

  return (
    <div>
      <h3 className="standing-title">{leagueName.toUpperCase()} Standings</h3>
      <div className="table-wrapper">
        <table>
          {/* The heading of the table  */}
          <thead>
            <tr className="title-row">
              {["Rank", "Team", "Points", "Matches", "Wins", "Losses", "Draws"].map(field =>
                <th key={field}>{field}</th>)}
            </tr>
          </thead>
          <tbody>
            {
              standings.map(standing =>
                <tr key={standing.rank}>
                  <td>{standing.rank}</td>
                  <td>
                    <div className="team-info-cell">
                      <div><img src={standing.logo} height="30" /></div>
                      <div className="team-name" style={{ width: "150px" }}>{standing.team}</div>
                    </div>
                  </td>
                  <td style={{ width: "11%" }}>{standing.points}</td>
                  <td style={{ width: "11%" }}>{standing.num_watches}</td>
                  <td style={{ width: "11%" }}>{standing.num_wins}</td>
                  <td style={{ width: "11%" }}>{standing.num_loses}</td>
                  <td style={{ width: "11%" }}>{standing.num_draws}</td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StandingTable;