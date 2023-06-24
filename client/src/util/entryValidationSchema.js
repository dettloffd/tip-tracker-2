import * as Yup from 'yup';

export const entryValidationSchema = Yup.object({
  
    date: Yup.date().required("Valid date required"),
    numTransactions: Yup.number().positive("Please enter positive integer value").integer("Please enter positive integer value").required("Please enter positive integer value"),
    tipsTotal: Yup.number("Please enter positive value").positive("Please enter positive value").required("Please enter positive value"),
  },
  );

  export default entryValidationSchema;