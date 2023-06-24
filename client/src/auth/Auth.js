import React, { useState, useContext } from "react";
//
import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Flex,
  Icon,
  Input,
  Text,
} from "@chakra-ui/react";
//
import { AuthContext } from "./AuthContext";
import { userValidationSchemas } from "./userValidationSchema";
import { authInputTextFields } from "./authInputTextFields";
import { authSubmitHandler } from "./api/authApi";
import { useModalHook } from "../hooks/useModalHook";
//
import { ModalContainer } from "../UIElements/ModalContainer";
//
import { MdClose } from "react-icons/md";
import { useQueryClient, useMutation } from "react-query";
import { Formik, Form, Field } from "formik";
import SyncLoader from "react-spinners/SyncLoader";

const Auth = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const auth = useContext(AuthContext);
  const queryClient = useQueryClient();

  const {
    onClose,
    errorAlert,
    toggleErrorAlert,
    returnedError,
    setReturnedError,
  } = useModalHook();

  const { isLoading, mutate } = useMutation(
    async (authData) => {
      const response = await authSubmitHandler(authData);
      if (isLoginMode) {
        auth.login(response.data.existingUser._id, response.data.token);
      } else {
        auth.login(response.data.createdUser._id, response.data.token);
      }
      return response;
      // response is being returned to the onSuccess and onError functions below
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries();
      },
      onError: (error) => {
        setReturnedError(error.response.data.message);
        toggleErrorAlert();
      },
    }
  );

  const onAuthSubmit = (values, { resetForm }) => {
    const userData = {
      email: values.email,
      password: values.password,
      username: values.username,
    };
    mutate({ userData: userData, isLoginMode: isLoginMode });
    resetForm();
  };

  const switchModeHandler = () => {
    setIsLoginMode((currentMode) => !currentMode);
  };

  // FOR DEMO PURPOSES
  const initialFormState = {
    username: "demo",
    email: "demo@demo.com",
    password: "demo1234",
  };

  if (isLoading) {
    return (
      <Flex width="100%" alignItems={"center"} justify={"center"} p={6}>
        <SyncLoader size={25} color={"#4FD1C5"} loading={true} />
      </Flex>
    );
  }

  return (
    <>
      {errorAlert && (
        <ModalContainer
          isOpen={errorAlert}
          setReturnedError={setReturnedError}
          modalContent={
            <Box p={3} textAlign="center">
              <Flex alignItems={"center"} justifyContent={"center"} pb={5}>
                <Icon
                  w={12}
                  h={12}
                  paddingRight={3}
                  as={MdClose}
                  color="red.500"
                />
                <Text fontSize="lg">{returnedError}</Text>
              </Flex>
            </Box>
          }
          onClose={onClose}
          toggleOpenState={toggleErrorAlert}
          title={"Error"}
        />
      )}

      <Flex justifyContent={"center"} alignItems="center" width={"100%"}>
        <Container
          bg="white"
          p={6}
          borderRadius="lg"
          width={"100%"}
          textAlign="center"
          boxShadow={"lg"}
          mb={100}
        >
          <Formik
            enableReinitialize
            initialValues={initialFormState}
            validationSchema={
              userValidationSchemas[
                isLoginMode
                  ? "userLoginValidationSchema"
                  : "userSignupValidationSchema"
              ]
            }
            onSubmit={onAuthSubmit}
          >
            {(props) => (
              <Form height="100%" width="100%">
                <Flex direction={"column"} height="20rem">
                  {authInputTextFields[
                    isLoginMode ? "authLogin" : "authSignup"
                  ].map((inputField) => (
                    <Field
                      name={inputField.id}
                      id={inputField.id}
                      type={inputField.type}
                      label={inputField.label}
                    >
                      {({ field, meta }) => (
                        <FormControl id={inputField.id}>
                          <FormLabel htmlFor={inputField.id}>
                            {inputField.label}
                          </FormLabel>
                          <Input
                            {...field}
                            type={inputField.type}
                            isInvalid={meta.touched && meta.error}
                          ></Input>
                          {!meta.error ? (
                            <FormHelperText>{inputField.helper}</FormHelperText>
                          ) : (
                            <FormHelperText color={"red.300"}>
                              {meta.error}
                            </FormHelperText>
                          )}
                        </FormControl>
                      )}
                    </Field>
                  ))}
                </Flex>
                <Button
                  isDisabled={!props.isValid}
                  colorScheme="teal"
                  size="md"
                  type="submit"
                  variant="solid"
                  color="white"
                  alignSelf="center"
                  mt={4}
                >
                  {isLoginMode ? "Log In" : "Create"}
                </Button>
              </Form>
            )}
          </Formik>
          <Button
            colorScheme="teal"
            size="md"
            type="submit"
            variant="solid"
            color="white"
            alignSelf="center"
            mt={4}
            onClick={switchModeHandler}
          >
            {isLoginMode ? "Click to Create Account" : "Already Have an Account?"}
          </Button>
        </Container>
      </Flex>
    </>
  );
};

export default Auth;
