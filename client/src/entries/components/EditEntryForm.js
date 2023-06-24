import React from "react";
//
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text,
  FormHelperText,
  Icon,
} from "@chakra-ui/react";
//
import { useMutation, useQueryClient } from "react-query";
import { Formik, Form, Field } from "formik";
import { MdCheckCircleOutline } from "react-icons/md";
import SyncLoader from "react-spinners/SyncLoader";
//
import entryValidationSchema from "../../util/entryValidationSchema";
import { editEntry } from "../api/entriesApi";



const EditEntryInputForm = (props) => {
  const queryClient = useQueryClient();
  

  const { isLoading, isSuccess, mutate, isError } = useMutation(
    async (editData) => {
      // editData comes from input to mutate function
      const response = await editEntry(editData);
      return response;
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries();
        console.log(data);
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );

  const initialFormState = {
    date: props.date,
    tipsTotal: props.tipsTotal,
    numTransactions: props.numTransactions,
  };

  const onSubmit = (values, { resetForm }) => {
    const editedEntry = {
      tipsTotal: values.tipsTotal,
      date: values.date,
      numTransactions: values.numTransactions,
      _id: props._id,
    };
    const token = props.token;
    // editedentry and token passed to editEntry api function as object to unpack in api
    mutate({ editedEntry, token });

    resetForm();
  };

  if (isLoading) {
    return (
      <Flex width="100%" justify={"center"} p={6}>
        <SyncLoader size={15} color={"#4FD1C5"} loading={true} />
      </Flex>
    );
  }

  if (isSuccess) {
    return (
      <Box p={3} textAlign="center">
        <Flex alignItems={"center"} justifyContent={"center"} pb={5}>
        <Icon w={12} h={12} as={MdCheckCircleOutline} color="teal.500"  />
        <Text fontSize="2xl">
         Entry has been edited successfully!
        </Text>
        </Flex>
      </Box >
    );
  }

  if (isError) {
    return <Box>Error editing entry</Box>;
  }

  return (
    <>
      {/* <Flex bg="gray.100" align="center" justify="center" h="50vh"> */}
      <Box bg="white" pl={6} pr={6} pb={6} rounded="md">
        <Formik
          enableReinitialize
          initialValues={initialFormState}
          validationSchema={entryValidationSchema}
          onSubmit={onSubmit}
        >
          {(props) => (
            <Form>
              <Flex direction={"column"}>
                <Field id="date" label="date" type="date" name="date">
                  {({ field, form, meta }) => (
                    <FormControl pb={3}>
                      <Input
                        {...field}
                        isInvalid={meta.touched && meta.error}
                        type="date"
                      ></Input>
                    </FormControl>
                  )}
                </Field>

                <Field name="tipsTotal">
                  {({ field, form, meta }) => (
                    <FormControl id="tipsTotal" pb={3}>
                      <FormLabel htmlFor="tipsTotal">
                        Total Tips Received
                      </FormLabel>
                      <NumberInput
                        min={0}
                        id="tipsTotal"
                        {...field}
                        onChange={(val) => form.setFieldValue(field.name, val)}
                        isInvalid={meta && meta.touched && meta.error}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>

                      <FormHelperText>
                        Enter the total number of tips received for one work
                        day.
                      </FormHelperText>

                      <FormErrorMessage>Email is required.</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                <Field name="numTransactions">
                  {({ field, form, meta }) => (
                    <FormControl id="numTransactions">
                      <FormLabel htmlFor="numTransactions">
                        Total Transactions
                      </FormLabel>
                      <NumberInput
                        min={1}
                        id="numTransactions"
                        {...field}
                        onChange={(val) => form.setFieldValue(field.name, val)}
                        isInvalid={meta.touched && meta.error}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <FormHelperText>
                        Enter the total number of transactions for the work day.
                      </FormHelperText>
                    </FormControl>
                  )}
                </Field>

                <Button
                  isDisabled={!props.isValid}
                  colorScheme="teal"
                  size="md"
                  type="submit"
                  variant="solid"
                  color="white"
                  width="50%"
                  alignSelf="center"
                  mt={4}
                >
                  Submit Changes
                </Button>
              </Flex>
            </Form>
          )}
        </Formik>
      </Box>
      {/* </Flex> */}
    </>
  );
};

export default EditEntryInputForm;
