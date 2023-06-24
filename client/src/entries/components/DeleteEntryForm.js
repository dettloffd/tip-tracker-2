import React from "react";
//
import { useQueryClient, useMutation } from "react-query";
import { Box, Button, Flex, Icon, Text } from "@chakra-ui/react";
import { MdCheckCircleOutline } from "react-icons/md";
import SyncLoader from "react-spinners/SyncLoader";
//
import { deleteEntry } from "../api/entriesApi";

const DeleteEntryForm = ({ _id, token }) => {
  const queryClient = useQueryClient();
  const { isLoading, isSuccess, mutate, isError } = useMutation(
    async (deletionData) => {
      // deletionData comes from input to mutate function
      const response = await deleteEntry(deletionData);
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

  const handleDelete = () => {
    mutate({ _id, token });
    // id of deleted entry and token passed to deleteEntry api function as object to unpack in api
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
          <Icon w={12} h={12} as={MdCheckCircleOutline} color="teal.500" />
          <Text fontSize="2xl">Entry has been deleted successfully!</Text>
        </Flex>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box p={3} textAlign="center">
        <Flex alignItems={"center"} justifyContent={"center"} pb={5}>
          <Icon w={12} h={12} as={MdCheckCircleOutline} color="teal.500" />
          <Text fontSize="2xl">Entry has been deleted successfully!</Text>
        </Flex>
      </Box>
    );
  }

  return (
    <>
      <Box p={4}>
        <Flex direction={"column"}>
          <Text pb={6} fontSize="lg">
            Are you sure? You cannot undo this action once completed.
          </Text>
          <Button
            variant="solid"
            colorScheme={"red"}
            width={"40%"}
            alignSelf="flex-end"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Flex>
      </Box>
    </>
  );
};

export default DeleteEntryForm;
