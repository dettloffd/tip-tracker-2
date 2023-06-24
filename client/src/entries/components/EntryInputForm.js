import React, { useContext } from "react";
//
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text,
  FormHelperText,
  useToast,
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import { useMutation, useQueryClient } from "react-query";
import { format, parseISO } from "date-fns";
import { MdClose } from "react-icons/md";
//
import { AuthContext } from "../../auth/AuthContext";
import { addEntry } from "../api/entriesApi";
import { ModalContainer } from "../../UIElements/ModalContainer";
import { useModalHook } from "../../hooks/useModalHook";
import entryValidationSchema from "../../util/entryValidationSchema";

const EntryInputForm = () => {
  const { token } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const toast = useToast();

  const {
    onClose,
    errorAlert,
    toggleErrorAlert,
    returnedError,
    setReturnedError,
  } = useModalHook();

  const { mutate } = useMutation(
    async (newEntryData) => {
      const response = await addEntry(newEntryData);
      return response;
    },
    // response is being returned to the onSuccess and onError functions below
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries();
        let d = new Date(data.data.entry.date);
        let formattedDate = format(
          new Date(d.getTime() + Math.abs(d.getTimezoneOffset() * 60000)),
          "EEEE, yyyy-MM-dd"
        );
        // Since I store date as zeroed ("2022-06-15T00:00:00.000Z"), timezone offset is showing previous day without this
        // https://stackoverflow.com/questions/7556591/is-the-javascript-date-object-always-one-day-off

        toast({
          title: "Success!",
          description: `New entry has been created for ${formattedDate} ! `,
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
      },
      onError: (error) => {
        setReturnedError(error.response.data.message);
        toggleErrorAlert();
      },
    }
  );

  const initialFormState = {
    date: format(parseISO(new Date().toISOString()), "yyyy-MM-dd"),
    tipsTotal: 0,
    numTransactions: 0,
  };

  const onSubmit = (values, { resetForm }) => {
    const newEntry = {
      tipsTotal: values.tipsTotal,
      date: values.date,
      numTransactions: values.numTransactions,
      //creator: userId,
      // creator no longer necessary - userId extracted/set in check-auth
    };
    mutate({ newEntry, token });
    resetForm();
  };

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
          title={"Error Submitting Entry"}
        />
      )}

      <Box
        bg="white"
        p={6}
        borderRadius="lg"
        width={"100%"}
        boxShadow={"lg"}
      >
        <Text fontSize={'lg'} pb={4}>Create New Entry</Text>
        <Formik
          enableReinitialize
          initialValues={initialFormState}
          validationSchema={entryValidationSchema}
          onSubmit={onSubmit}
        >
          {(props) => (
            <Form>
              <Flex direction="column">
                <Field id="date" label="date" type="date" name="date">
                  {({ field, meta }) => (
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
                      <FormLabel
                        fontSize={["sm", "sm", "md", "md", "md"]}
                        htmlFor="tipsTotal"
                      >
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

                      <FormHelperText fontSize={["sm", "sm", "md", "md", "md"]}>
                        Enter the total value of all tips received on this date.
                      </FormHelperText>
                    </FormControl>
                  )}
                </Field>
                <Field name="numTransactions">
                  {({ field, form, meta }) => (
                    <FormControl id="numTransactions">
                      <FormLabel
                        fontSize={["sm", "sm", "md", "md", "md"]}
                        htmlFor="numTransactions"
                      >
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
                      <FormHelperText fontSize={["sm", "sm", "md", "md", "md"]}>
                        Enter the total number of transactions on this date.
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
                  // width="50%"
                  alignSelf="center"
                  mt={4}
                >
                  <Text fontSize={["sm", "sm", "md"]}>Submit Entry</Text>
                </Button>
              </Flex>
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default EntryInputForm;
