import axios from "axios";

function myValidateStatus(status) {
  return status >= 200 && status < 300; // default
}

// validateStatus - essential axios option to ensure react query throws an error AND
// we get the proper response object containing error codes/information back from server
// without it, react query would handle the error but we wouldn't get the object containing
// the error code and error message that was set up on the server 

export const authSubmitHandler = (authData) => {
  const {userData, isLoginMode} = authData;
    if (isLoginMode) {
        const response = axios({
          url: `${process.env.REACT_APP_SERVER_URL}/user/login`,
          method: "POST",
          data: {
            email: userData.email,
            password: userData.password,
          },
          validateStatus: myValidateStatus,
        });
        //only call login if attempt to send request is successful
        //response user ID send from backend; see users
        console.log('response from authApi.js: ', response)
        return response;
      
    } else {
        const response = axios({
          url: `${process.env.REACT_APP_SERVER_URL}/user/signup`,
          method: "POST",
          data: {
            username: userData.username,
            email: userData.email,
            password: userData.password
          },
          validateStatus: myValidateStatus,
        });
        return response;
    }
  };