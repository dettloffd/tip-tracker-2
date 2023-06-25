import axios from "axios";

function myValidateStatus(status) {
  return status >= 200 && status < 300; // default
}

export const fetchChartDataBetweenDates = async ({ queryKey }) => {
  const [_key, {userId}, { startDate, endDate, statVar, timeVar }] = queryKey;

  try{
    const response = await axios({
      method: "GET",
      url: `${process.env.REACT_APP_SERVER_URL}/stats/user/${userId}/avgBetweenDates/?startDate=${startDate}&endDate=${endDate}&statVar=${statVar}&timeVar=${timeVar}`,
      data: null,
      headers: {},
    });
    return response;
  } catch (err){
    throw err;
  }
};

export const fetchChartDataNoDates = async ({ queryKey }) => {
  const [_key, {userId}, { statVar, timeVar }] = queryKey;

  try{
    const response = await axios({
      method: "GET",
      url: `${process.env.REACT_APP_SERVER_URL}/stats/user/${userId}/avg/?statVar=${statVar}&timeVar=${timeVar}`,
      data: null,
      validateStatus: myValidateStatus,
      headers: {},
    });
    return response;

  } catch (err){
    throw err;
  }
};