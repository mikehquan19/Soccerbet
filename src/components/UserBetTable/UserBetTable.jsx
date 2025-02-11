import React from 'react'
import { BetInfoCard, UserBetContext } from "../pages/InfoPage/InfoPage"
import Form from '../Form/Form'
import { soccerappClient } from '../../provider/api'
import './UserBetTable.css'

const UserBetTableRow = ({ status, handleUpdate }) => {
  const userBet = React.useContext(UserBetContext);

  const [isButtonPresent, setIsButtonPresent] = React.useState(false);
  const [isUpdateFormPresent, setIsUpdateFormPresent] = React.useState(false);
  const [isWithdrawFormPresent, setIsWithdrawFormPresent] = React.useState(false);

  const handleX = () => {
    setIsUpdateFormPresent(false);
    setIsWithdrawFormPresent(false);
    setIsButtonPresent(false);
  }

  return (
    <>
      <tr onClick={() => setIsButtonPresent(!isButtonPresent)}>
        <td style={{ width: "400px" }}><BetInfoCard userBet={userBet} /></td>
        <td style={{ width: "20%", fontSize: "1.2rem" }}>$ {userBet.bet_amount}</td>
        <td style={{ width: "20%" }}>{userBet.payout !== null ? (<span style={{ fontSize: "1.2rem" }}>$ {userBet.payout}</span>) : (<span>Not available yet</span>)}</td>
        <td style={{ width: "20%" }}>
          <div style={{ margin: "0.4rem" }}>Placed {userBet.created_date}</div>
          <div style={{ margin: "0.4rem" }}>{userBet.bet_info.settled_date !== null ?
            <span>Settled {userBet.bet_info.settled_date}</span> : (<span>Not settled yet</span>)}
          </div>
        </td>
      </tr>
      {(status === "Unsettled" && isButtonPresent) &&
        <tr>
          <td colSpan={4}>
            <div className="button-set">
              <button onClick={() => { console.log("update"); setIsUpdateFormPresent(true) }}>Update</button>
              <button onClick={() => { console.log("withdraw"); setIsWithdrawFormPresent(true) }}>Withdraw</button>
            </div>
            {isUpdateFormPresent && <Form usedFor="update" handleX={handleX} handleUpdate={handleUpdate} />}
            {isWithdrawFormPresent && <Form usedFor="withdraw" handleX={handleX} handleUpdate={handleUpdate} />}
          </td>
        </tr>}
    </>
  )
}

// the pagination bar used to switch between pages 
const Pagination = ({ betsPerPage, numBets, handlePagination}) => {
  const [clickedNumber, setClickedNumber] = React.useState(1);
  const [firstIndex, setFirstIndex] = React.useState(0); 
  
  React.useEffect(() => {
    setClickedNumber(firstIndex + 1);
    handlePagination(firstIndex + 1);
  }, [firstIndex])

  const pageNumbers = []; // the array of the numbers in the page
  for (let i = 1; i <= Math.ceil(numBets / betsPerPage); i++) {
    pageNumbers.push(i);
  }

  const filteredNumbers = pageNumbers.slice(firstIndex, firstIndex + 5)

  if (numBets > betsPerPage) {
    return (
      <div className="pagination">
        <button style={{borderLeft: "1px solid black"}} onClick={() => {
          if (firstIndex - 5 > -1) {setFirstIndex(firstIndex - 5)}
        }}>Prev</button>
        {filteredNumbers.map(pageNumber => 
          <button key={pageNumber} onClick={() => {
            setClickedNumber(pageNumber); 
            handlePagination(pageNumber);
          }}
          style={clickedNumber === pageNumber ? {backgroundColor: "skyblue", color: "white"} : {backgroundColor: "white", color: "skyblue"}}>{pageNumber}</button>
        )}
        <button style={{borderRight: "1px solid black"}} onClick={() => {
          if (firstIndex + 5 < pageNumbers.length) {setFirstIndex(firstIndex + 5)}
        }}>Next</button>
      </div>
    );
  }
}

// bet type including: moneyline, handicap, and total 
const UserBetTable = ({ betType = "Moneyline", status, handleUpdateInfo = null }) => {
  const [userBetList, setUserBetList] = React.useState([]);

  // state for paginations 
  const [currentPage, setCurrentPage] = React.useState(1);
  const betsPerPage = 3;

  React.useEffect(() => {
    soccerappClient.get(`/${betType.toLowerCase()}_bets?status=${status}`)
      .then((response) => {
        setUserBetList(response.data);  // list of bets
      })
      .catch((error) => console.log(error));
  }, [])

  // update the bet amount 
  const updateBetAmount = (userBetData, action) => {
    if (action === "update") {
      soccerappClient.put(`/${betType.toLowerCase()}_bets/${userBetData.id}`, userBetData)
        .then((response) => {
          // update the user bet list 
          const newUserBetList = userBetList.map(userBet => {
            if (userBet.id === response.data.id) {
              return response.data;
            }
            return userBet;
          })
          setUserBetList(newUserBetList);
          handleUpdateInfo(); // update the user's balance 
        })
        .catch((error) => console.log(error));
    }
    else if (action === "withdraw") {
      soccerappClient.delete(`/${betType.toLowerCase()}_bets/${userBetData.id}`)
        .then((response) => {
          // delete the bet from the bet list 
          setUserBetList(userBetList.filter(userBet => userBet.id !== userBetData.id));
          handleUpdateInfo();
        })
        .catch((error) => console.log(error));
    }
    else {
      console.log("Inappropriate actions on the table")
    }
  }

  // set the first and last index of the current page 
  const lastBetIndex = currentPage * betsPerPage;
  const firstBetIndex = lastBetIndex - betsPerPage;
  const currentBetList = userBetList.slice(firstBetIndex, lastBetIndex)

  return (
    <>
      <div className="overall-bet-table-wrapper">
        <h3>{status} {betType} Bets</h3>
        <div className="bet-table-wrapper">
          {userBetList.length !== 0 ? (
            <table>
              <thead>
                <tr>{["Bet Info", "Bet Amount", "Payout", "Placed/Settled Date"].map(item => <th key={item}>{item}</th>)}</tr>
              </thead>
              <tbody>
                {currentBetList.map(userBet =>
                  <UserBetContext.Provider value={userBet} key={userBet.id} >
                    <UserBetTableRow status={status} handleUpdate={updateBetAmount} />
                  </UserBetContext.Provider>
                )}
              </tbody>
            </table>
          ) : (
            <div className="no-made-bets-wrapper">You haven't made any bets</div>
          )}
        </div>
      </div>
      <Pagination betsPerPage={betsPerPage} numBets={userBetList.length} 
        handlePagination={(pageNumber) => setCurrentPage(pageNumber)} />
    </>
  )
}

export default UserBetTable;