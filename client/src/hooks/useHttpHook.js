import { useState, useCallback } from "react";
import axios from "axios";

export const useHttpHook = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  //const activeHttpRequests = useRef([]);
  //Piece of data which will not be re initialized when function runs again


  const sendRequest = useCallback(
    //Wrap in usecallback in order to ensure function is not recreated everytime there's a rerender of the page
    async ({url = url, reqMethod = "GET", data = null, headers = {}}) => {
      setIsLoading(true);
      //const abortRequestController = new AbortController();
      //activeHttpRequests.current.push(abortRequestController);

      try {
        const response = await axios({
          method: reqMethod,
          url: url,
          data: data,
          headers: headers,
          //signal: abortRequestController.signal
        });

        setIsLoading(false);
        return response;
        //axios returns in form of: response.data.<VARIABLENAMEHERE>
      } catch (err) {
        console.log(err);
        setErrorMessage(err.response.data.message);
        
        setIsLoading(false);
        throw err;
      }
    },
    []
  );  

  const clearErrorMessage = () => {
    setErrorMessage(null);
  };

  return { sendRequest, isLoading, errorMessage, clearErrorMessage };
};
