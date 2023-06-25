import * as Yup from "yup";

export const userLoginValidationSchema = Yup.object({
  email: Yup.string().email("Valid email required").required("Required"),
  password: Yup.string()
    .min(8, "Too short! Password must contain at least 8 characters")
    .required("Valid password required"),
});

export const userSignupValidationSchema = Yup.object({
//   username: Yup.string()
//     .min(2, "Too short; 2 characters required")
//     .max(50, "Too Long! 50 character maximum.")
//     .required("Valid name required"),
  email: Yup.string().email("Valid email required").required("Required"),
  password: Yup.string()
    .min(8, "Too short! Password must contain at least 8 characters")
    .required("Valid password required"),
});

export const userValidationSchemas = {
  userLoginValidationSchema,
  userSignupValidationSchema,
};