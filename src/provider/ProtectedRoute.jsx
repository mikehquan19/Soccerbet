import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { REFRESH_TOKEN, ACCESS_TOKEN, soccerappClient } from './api';

export const LogoutRoute = () => {
  React.useEffect(() => {
    // blacklist the refresh tokens to they can't be used 
    const blacklistRefreshToken = async () => {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN);
      try {
        const response = await soccerappClient.post("/logout", { "refresh": refreshToken })
        console.log("Log out request: " + response.status)
        localStorage.clear();
      }
      catch (error) {
        console.log(error)
      }
    }
    blacklistRefreshToken();
  }, []);

  // renavigate the login page 
  return <Navigate to="/login" />
}

export const TeamContext = React.createContext();

const ProtectedRoute = ({ children }) => {
  const { teamId } = useParams();
  // determine whether the user is logged in 
  const [isAuthorized, setIsAuthorized] = React.useState(null);

  // function to log the error in the console depending on the type of error 
  const handleError = (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
    console.log(error.config);
  }


  // refresh the token if the access token expired
  const refreshToken = async () => {
    // the refresh token to be submitted alongside request
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    const data = { refresh: refreshToken };
    try {
      const response = await soccerappClient.post("/login/refresh", data);
      if (response.status === 200) {
        // if request successful, reset the access token, user is authorized
        localStorage.setItem(ACCESS_TOKEN, response.data.access);
        setIsAuthorized(true);
      }
      else { // otherwise, user not authorized
        setIsAuthorized(false);
      }
    }
    catch (error) { // if there is error, user not authorized
      handleError(error);
      setIsAuthorized(false);
    }
  }

  // call processAuth to see if the user is authorized 
  React.useEffect(() => {
    // process the access token to see if user is authorized
    const processAuth = async () => {
      const accessToken = localStorage.getItem(ACCESS_TOKEN);
      if (!accessToken) { // if access token nonexistent, user not authorized 
        setIsAuthorized(false);
      }
      else { // otherwise, decode the token and check if it expired
        const decodedAccessToken = jwtDecode(accessToken);
        const tokenExpirationTime = decodedAccessToken.exp;

        if (tokenExpirationTime < Date.now() / 1000) {
          await refreshToken(); // if token expires, try refreshing the token
        }
        else {
          setIsAuthorized(true); // otherwise, user is authorized 
        }
      }
    }
    processAuth();
  }, []);

  // conditional rendering depending on if the user is authorized 
  if (isAuthorized === null) {
    return <div>Loading...</div>
  }

  // if the user is authorized, routed to main pages (chilren)
  // otherwise, redirect back to the login page
  return (
    <TeamContext.Provider value={teamId}>
      {isAuthorized ? children : <Navigate to="/login" />}
    </TeamContext.Provider>
  )
}

export default ProtectedRoute; 