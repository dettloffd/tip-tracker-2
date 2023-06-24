import { useState, useCallback, useEffect } from "react";

let autoLogoutTimer;

export const useAuthHook = () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();

  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setUserId(uid);
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    // this based on 1hr expiration date set in users-controllers (1000ms * 60seconds * 60 = 1hr)
    // ** If already logged in and token has already begun to expire, expirationDate already exists...
    // if not, create it
    setTokenExpirationDate(tokenExpirationDate);
    // ** The "state" tokenExpirationDate different than the one used in this useEffect
    // the state tokenExpirationDate used to setup logout timer
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
    // only text can be stored in localStorage - use stringify to do so
    // toISOstring so no data is lost when date is stringified
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setTokenExpirationDate(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    // If there is a token and a tokenExpirationDate, determine the amount of time until that 1hr is complete
    // otherwise, clear the timeout
    if (token && tokenExpirationDate) {
      const remaininingTokenTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      // getTime() - put into milliseconds
      autoLogoutTimer = setTimeout(logout, remaininingTokenTime);
    } else {
      clearTimeout(autoLogoutTimer);
      // might have manually clicked logout
    }
  }, [token, logout, tokenExpirationDate]);
  // if token changes.. changes take place to due login or logout
  // can use logout here due to useCallback not recreating the function - no infinite loop

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    // text extracted in JSON format
    //use parse to convert JSON string to javascript object
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
      // if storedData.expiration is in the future.. (therefore token is still valid)..
    ) {
      login(
        storedData.userId,
        storedData.token,
        new Date(storedData.expiration)
      );
      // keep expirationDate the same if one already exists in the future
    }
  }, [login]);
  // can set login as dependency since useCallback on login ensures it's only run once

  return { token, login, logout, userId };
};
