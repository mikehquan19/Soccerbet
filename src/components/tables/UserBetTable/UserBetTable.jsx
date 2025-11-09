import {useState, useContext, useEffect} from 'react'
import { BetInfoCard, UserBetContext } from '@pages/InfoPage/InfoPage'
import Form from '@components/Form/Form'
import { soccerappClient } from '@provider/api'

const UserBetTableRow = ({ status, handleUpdate }) => {
  const userBet = useContext(UserBetContext);

  const [isButtonPresent, setIsButtonPresent] = useState(false);
  const [isUpdateFormPresent, setIsUpdateFormPresent] = useState(false);
  const [isWithdrawFormPresent, setIsWithdrawFormPresent] = useState(false);

  const handleX = () => {
    setIsUpdateFormPresent(false);
    setIsWithdrawFormPresent(false);
    setIsButtonPresent(false);
  }

  return (
    <>
      <tr 
        className='border-1' 
        onClick={() => setIsButtonPresent(!isButtonPresent)}
      >
        <td className='px-2 py-1 border-1'>
          <BetInfoCard userBet={userBet} />
        </td>
        <td className="text-lg text-center border">{userBet.bet_amount} tokens</td>
        <td className="text-center border">
          {userBet.payout !== null ? (
            <span className="text-xl">{userBet.payout} tokens</span>
          ) : (
            <span>Not available yet</span>
          )}
        </td>
        <td className="text-center border">
          <div className="my-1">Placed {userBet.created_date}</div>
          <div className="my-1">
            {userBet.bet_info.settled_date !== null ? (
              <span>Settled {userBet.bet_info.settled_date}</span>
            ) : (
              <span>Not settled yet</span>
            )}
          </div>
        </td>
      </tr>

      {status === "Unsettled" && isButtonPresent && (
        <tr>
          <td colSpan={4}>
            <div className="flex flex-row gap-4 my-1 mx-2">
              <button
                className="p-1 text-lg bg-[peru] text-white rounded border-0"
                onClick={() => setIsUpdateFormPresent(true)}
              >
                Update
              </button>
              <button
                className="p-1 text-lg bg-[peru] text-white rounded border-0"
                onClick={() => setIsWithdrawFormPresent(true)}
              >
                Withdraw
              </button>
            </div>
            {isUpdateFormPresent && 
              <Form usedFor="update" handleX={handleX} handleUpdate={handleUpdate} />
            }
            {isWithdrawFormPresent && 
              <Form usedFor="withdraw" handleX={handleX} handleUpdate={handleUpdate} />
            }
          </td>
        </tr>
      )}
    </>
  )
}

const Pagination = ({ betsPerPage, numBets, handlePagination }) => {
  const [clickedNumber, setClickedNumber] = useState(1);
  const [firstIndex, setFirstIndex] = useState(0);

  useEffect(() => {
    setClickedNumber(firstIndex + 1);
    handlePagination(firstIndex + 1);
  }, [firstIndex]);

  const pageNumbers = Array.from({ length: Math.ceil(numBets / betsPerPage) }, (_, i) => i + 1);
  const filteredNumbers = pageNumbers.slice(firstIndex, firstIndex + 5);

  if (numBets <= betsPerPage) return null;

  return (
    <div className="flex justify-center mt-2 font-medium">
      <button
        className="border-y border-l border-1 px-2 py-1"
        onClick={() => { if (firstIndex - 5 > -1) setFirstIndex(firstIndex - 5); }}
      >
        Prev
      </button>
      {filteredNumbers.map(pageNumber => (
        <button
          key={pageNumber}
          onClick={() => { 
            setClickedNumber(pageNumber); 
            handlePagination(pageNumber); 
          }}
          className={`px-2 py-1 text-md border-1 border-black border-l-1 
            ${clickedNumber === pageNumber ? 
              'bg-[peru] text-white' : 'bg-white text-[peru]'
            }`}
        >
          {pageNumber}
        </button>
      ))}
      <button
        className="border-y border-r border-1 px-2 py-1"
        onClick={() => { if (firstIndex + 5 < pageNumbers.length) setFirstIndex(firstIndex + 5); }}
      >
        Next
      </button>
    </div>
  );
}

const UserBetTable = ({ betType = "Moneyline", status, handleUpdateInfo = null }) => {
  const [userBetList, setUserBetList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const betsPerPage = 3;

  useEffect(() => {
    soccerappClient.get(`/${betType.toLowerCase()}_bets?status=${status}`)
      .then((res) => setUserBetList(res.data))
      .catch((err) => console.log(err));
  }, []);

  const updateBetAmount = (userBetData, action) => {
    if (action === "update") {
      soccerappClient.put(`/${betType.toLowerCase()}_bets/${userBetData.id}`, userBetData)
        .then((res) => {
          setUserBetList(userBetList.map(ub => ub.id === res.data.id ? res.data : ub));
          handleUpdateInfo?.();
        })
        .catch((err) => console.log(err));
    } else if (action === "withdraw") {
      soccerappClient.delete(`/${betType.toLowerCase()}_bets/${userBetData.id}`)
        .then(() => {
          setUserBetList(userBetList.filter(ub => ub.id !== userBetData.id));
          handleUpdateInfo?.();
        })
        .catch((err) => console.log(err));
    }
  }

  const lastBetIndex = currentPage * betsPerPage;
  const firstBetIndex = lastBetIndex - betsPerPage;
  const currentBetList = userBetList.slice(firstBetIndex, lastBetIndex);

  return (
    <div className="mt-6 w-4/5 mx-auto">
      <h3 className="mx-auto mb-1 text-xl font-semibold">
        {status} {betType} Bets
      </h3>
      <div className="overflow-x-auto mx-auto font-medium shadow-lg">
        {userBetList.length > 0 ? (
          <table className="w-full border-collapse border-1">
            <thead>
              <tr className="bg-[darksalmon] text-white text-lg px-2 py-1">
                {["Bet Info", "Bet Amount", "Payout", "Placed/Settled Date"].map(item => (
                  <th 
                    key={item} 
                    className="border border-black p-1"
                  >{item}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentBetList.map(userBet => 
                <UserBetContext.Provider value={userBet} key={userBet.id}>
                  <UserBetTableRow 
                    status={status} 
                    handleUpdate={updateBetAmount} />
                </UserBetContext.Provider>
              )}
            </tbody>
          </table>
        ) : (
          <div className="p-1 text-lg font-semibold text-center bg-[darksalmon] text-white">
            You haven't made any bets
          </div>
        )}
      </div>
      <Pagination 
        betsPerPage={betsPerPage} 
        numBets={userBetList.length} 
        handlePagination={setCurrentPage} 
      />
    </div>
  )
}

export default UserBetTable;
