export const authInputTextFields = {
  authSignup: [

    {
      id: "email",
      type: "email",
      label: "User Email",
      helper: "Enter valid email address",
    },
    {
      id: "password",
      type: "password",
      label: "Password",
      helper: "Enter password with 8+ characters",
    }
    // {
    //     id: "username",
    //     type: "string",
    //     label: "Username",
    //     helper: "Enter a valid username",
    //   },
  ],

  authLogin: [
    {
      id: "email",
      type: "email",
      label: "User Email",
      helper: "Enter your registered email address",
    },
    {
      id: "password",
      type: "password",
      label: "Password",
      helper: "Enter password",
    },
  ],
};

export const authSignupTextFields = [
//   {
//     id: "username",
//     type: "string",
//     label: "Username",
//   },
  {
    id: "email",
    type: "email",
    label: "User Email",
  },
  {
    id: "password",
    type: "password",
    label: "Password",
  },
];

export const authLoginTextFields = [
  {
    id: "email",
    type: "email",
    label: "User Email",
  },
  {
    id: "password",
    type: "password",
    label: "Password",
  },
];
