import React from 'react';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ProtectedRoute, {LogoutRoute} from './provider/ProtectedRoute.jsx';

import MainPage from './components/pages/MainPage/MainPage.jsx';
import BetPage from './components/pages/BetPage/BetPage.jsx';
import InfoPage from './components/pages/InfoPage/InfoPage.jsx';
import TeamPage from './components/pages/TeamPage/TeamPage.jsx';
import CommentPage from './components/pages/CommentPage/CommentPage.jsx';
import LoginPage from './components/pages/LoginPage/LoginPage.jsx';
import CheckOut from './components/pages/InfoPage/Checkout.jsx';
import BetCart from './components/BetCart/BetCart.jsx';
import './index.css';

const App = () => {
  const [isBetCartPresent, setIsBetCartPresent] = React.useState(true);
  const style = { color: "skyblue", textDecoration: "none" };

  return (
    <>
      {/* The main part page */}
      <div style={{ margin: "3.5rem 0 4rem 0", minHeight:"100%"}}>
          <BrowserRouter>
            {/* Navbar */}
            <div className="navbar-wrapper">
              <div className="app-title">SoccerBet</div>
              <div className="navbar">
                <div><Link to="/" style={style} onClick={() => setIsBetCartPresent(true)}>Main</Link></div>
                <div><Link to="/details" style={style} onClick={() => setIsBetCartPresent(true)}>Details</Link></div>
                <div><Link to="/userbet" style={style} onClick={() => setIsBetCartPresent(true)}>Info</Link></div>
                <div><Link to="/teams" style={style} onClick={() => setIsBetCartPresent(true)}>Comments</Link></div>
                <div><Link to="/logout" style={style}>Log out</Link></div>
              </div>
            </div>
            <Routes>
              {/* Certain pages that require user's credentials will require token */}
              <Route path="/" element={<MainPage matchFinished={false} />} />
              <Route path="/details" element={<MainPage matchFinished={true} />} />
              <Route path="/bet/:matchId" element={<BetPage />} />
              <Route path="/teams" element={<TeamPage />} />
              
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<LoginPage usedFor="register" />} />
              <Route path="/logout" element={<LogoutRoute />} />

              <Route path="/userbet" element={<ProtectedRoute><InfoPage /></ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedRoute><CheckOut /></ProtectedRoute>} />
              <Route path="/comments/:teamId" element={<ProtectedRoute><CommentPage /></ProtectedRoute>} />
            </Routes>
            {/* The bet cart */}
            {isBetCartPresent && <div className="app-wrapper-of-bet-cart"><BetCart handleHideItself={() => setIsBetCartPresent(false)} /></div>}
          </BrowserRouter>
      </div>
    </>
  )
}

export default App;
