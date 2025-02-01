import "./Match.css"

const Match = (props) => {

  return (
    <div className="overall-match-wrapper">
      <div className="match-title-wrapper">
        <div className="date-wrapper"><h3>{props.date}</h3></div>
        <div className="status-wrapper"><h3>{props.status}</h3></div>
      </div>
      <div className="match-wrapper">
        <div className="team-wrapper home">
          <h3>{props.homeTeam}</h3>
          <img src={props.homeTeamLogo} height="70" />
        </div>
        <div className="team-wrapper vs">
          <h2>VS</h2>
        </div>
        <div className="team-wrapper away">
          <h3>{props.awayTeam}</h3>
          <img src={props.awayTeamLogo} height="70" />
        </div>
      </div>
    </div>
  )
}

export default Match