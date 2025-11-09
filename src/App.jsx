import React from 'react';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ProtectedRoute, { LogoutRoute } from './provider/ProtectedRoute.jsx';

import MainPage from './components/pages/MainPage/MainPage.jsx';
import BetPage from './components/pages/BetPage/BetPage.jsx';
import InfoPage from './components/pages/InfoPage/InfoPage.jsx';
import LoginPage from './components/pages/LoginPage/LoginPage.jsx';
import CheckOut from './components/pages/InfoPage/Checkout.jsx';
import BetCart from './components/BetCart/BetCart.jsx';
import './index.css';

const App = () => {
  const [isBetCartPresent, setIsBetCartPresent] = React.useState(true);
  return (
    <>
      {/* The main part page */}
      <div className="min-h-full">
        <BrowserRouter>
          {/* Navbar */}
          <div className="fixed top-0 left-0 h-full w-40 bg-[darkslategrey] z-5 font-medium">
            <div className="text-2xl p-2 text-center text-[skyblue]">
              SoccerBet
            </div>
            <div className="flex flex-col items-center text-xl text-[skyblue] gap-3 m-2">
              <div className="w-[90%] px-2 py-1 rounded-xl hover:bg-[gray]">
                <Link 
                  to="/" 
                  onClick={() => setIsBetCartPresent(true)}
                >Main</Link>
              </div>
              <div className="w-[90%] px-2 py-1 rounded-xl hover:bg-[gray]">
                <Link 
                  to="/details" 
                  onClick={() => setIsBetCartPresent(true)}
                >Standings</Link>
              </div>
              <div className="w-[90%] px-2 py-1 rounded-xl hover:bg-[gray]">
                <Link 
                  to="/userbet"
                  onClick={() => setIsBetCartPresent(true)}
                >Info</Link>
              </div>
              <div className="w-[90%] px-2 py-1 rounded-xl hover:bg-[gray]">
                <Link to="/logout">Log out</Link>
              </div>
            </div>
          </div>
          <div>
            <Routes>
              {/* Certain pages that require user's credentials will require token */}
              <Route
                path="/"
                element={<MainPage matchFinished={false} />}
              />
              <Route
                path="/details"
                element={<MainPage matchFinished={true} />} />
              <Route
                path="/bet/:matchId" element={<BetPage />} />
              <Route
                path="/login" element={<LoginPage />} />
              <Route
                path="/register"
                element={<LoginPage usedFor="register" />} />
              <Route
                path="/logout" element={<LogoutRoute />} />

              <Route
                path="/userbet"
                element={
                  <ProtectedRoute>
                    <InfoPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <CheckOut />
                  </ProtectedRoute>
                }
              />
            </Routes>
            {/* The bet cart */}
            {isBetCartPresent && 
              <div className="app-wrapper-of-bet-cart">
                <BetCart handleHideItself={() => setIsBetCartPresent(false)} />
              </div>
            }
          </div>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App;
