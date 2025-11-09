import { freeClient } from '@provider/api';
import { useState, useEffect } from "react";

function StandingTable({ leagueName = 'epl' }) {
  const [standings, setStandings] = useState([]);

  const colHeaders = ["Rank", "Team", "Points", "Matches", "Wins", "Losses", "Draws"];
  const tdStyle = "text-center text-lg font-medium bg-[antiquewhite] px-2 py-1 border-t-[0.1rem] first:sticky first:left-0";

  useEffect(() => {
    leagueName = leagueName === "ucl" ? "epl" : leagueName;
    freeClient.get(`/standings?league=${leagueName}`)
      .then((response) => {
        console.log(`Get info standings of ${leagueName}: ` + response.status);
        const leagueStandings = response.data;
        setStandings(leagueStandings);
      })
      .catch((error) => console.log(error));
  }, [leagueName]);

  return (
    <div>
      <div className="overflow-x-scroll whitespace-nowrap mt-1 mx-auto border-1 rounded-xl overscroll-none">
        <table className="border-collapse w-full">
          {/* The heading of the table  */}
          <thead>
            <tr className="sticky top-0 z-1">
              {colHeaders.map(field =>
                <th
                  key={field}
                  className="text-center text-xl text-[white] bg-[darkcyan] p-2 first:sticky first:left-0"
                >{field}</th>
              )}
            </tr>
          </thead>
          <tbody>
            {standings.map(standing =>
              <tr key={standing.rank}>
                <td className={tdStyle}>{standing.rank}</td>
                <td className={tdStyle}>
                  <div className="overflow-x-auto flex flex-row gap-3 justify-center items-center">
                    <div className="flex">
                      <img src={standing.logo} className="h-10 w-auto" />
                    </div>
                    <div className="flex w-[8rem]">
                      {standing.team}
                    </div>
                  </div>
                </td>
                <td className={tdStyle}>{standing.points}</td>
                <td className={tdStyle}>{standing.num_watches}</td>
                <td className={tdStyle}>{standing.num_wins}</td>
                <td className={tdStyle}>{standing.num_loses}</td>
                <td className={tdStyle}>{standing.num_draws}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StandingTable;