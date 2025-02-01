import React from "react"
import { freeClient } from "../../../provider/api"
import { useNavigate } from "react-router-dom"
import { useMediaQuery } from "react-responsive"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons"
import "./TeamPage.css"

// export this component so that it could be used by CommentPage
export const Team = ({ teamInfo, isSmallDevice }) => {
  const navigate = useNavigate()
  const [isDescriptionPresent, setIsDescriptionPresent] = React.useState(false);

  return (
    <div className="league-team-wrapper">
      <img src={teamInfo.stadium_image} className="img" onClick={() => navigate(`/comments/${teamInfo.id}`)} />
      <div className="league-team-title-wrapper">
        <div><img src={teamInfo.logo} height="30" /></div>
        <div><h2 style={{ margin: "0" }}>{teamInfo.name}</h2></div>
      </div>
      <div className="league-team-info-wrapper">
        <div><strong>Founded</strong> in {teamInfo.founded_year}</div>
        <div><strong>Nickname:</strong> {teamInfo.nickname}</div>
        <div><strong>Home stadium:</strong> {teamInfo.home_stadium}</div>
      </div>
      {!isSmallDevice && (
        <div className="league-team-description-wrapper">{teamInfo.description}</div>
      )}
      {isSmallDevice && (
        <>
          {isDescriptionPresent && 
            <div className="league-team-description-wrapper">{teamInfo.description}</div>
          }
          <div style={{ textAlign: "center", marginTop: "1rem", fontSize: "1.25rem" }}
            onClick={() => { setIsDescriptionPresent(!isDescriptionPresent) }}>
            {isDescriptionPresent ? 
              <FontAwesomeIcon icon={faChevronUp} /> : <FontAwesomeIcon icon={faChevronDown} />
            }
          </div>
        </>
      )}
    </div>
  )
}


const TeamPage = () => {
  const [leagueName, setLeagueName] = React.useState("epl");
  const [teamList, setTeamList] = React.useState([]);
  const isSmallDevice = useMediaQuery({ query: "(max-width: 500px)" });

  React.useEffect(() => {
    freeClient.get(`/teams?league=${leagueName}`)
      .then((response) => {
        console.log(`Status for getting ${leagueName} teams: ${response.status}`)
        setTeamList(response.data);
      })
      .catch((error) => console.log(error));
  }, [leagueName])

  const setButtonColor = (argLeague) => {
    if (argLeague === leagueName) return { backgroundColor: "rgb(228, 223, 223)" }
    return { backgroundColor: "white" }
  }

  return (
    <div className="team-page">
      <div className="page-navbar">
        <div onClick={() => setLeagueName("epl")} style={setButtonColor("epl")}>Premiere League</div>
        <div onClick={() => setLeagueName("lal")} style={setButtonColor("lal")}>La Liga</div>
        <div onClick={() => setLeagueName("bun")} style={setButtonColor("bun")}>Bundesliga</div>
      </div>
      {teamList.map(teamInfo =>
        <Team key={teamInfo.id} teamInfo={teamInfo} isSmallDevice={isSmallDevice} />
      )}
    </div>
  )
}

export default TeamPage;