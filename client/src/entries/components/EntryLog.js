import React, { useContext } from "react";
//
import { Flex, List, Text } from "@chakra-ui/react";
import { useQuery } from "react-query";
import MoonLoader from "react-spinners/MoonLoader";
//
import {
  getAllEntriesByUserId,
  getAllEntriesByUserIdBetweenDates,
} from "../api/entriesApi";
import { AuthContext } from "../../auth/AuthContext";
import EntryItem from "./EntryItem";

const EntryLog = ({ numResults, dateRange }) => {
  const { startDate, endDate } = dateRange;
  const { userId } = useContext(AuthContext);

  const dateRangeProvided = dateRange.startDate !== "";
  let theQueryKey;
  let theQueryFn;

  if (dateRangeProvided) {
    theQueryKey = [
      "getAllEntriesByUserIdBetweenDates",
      { userId },
      { startDate, endDate },
    ];
    theQueryFn = getAllEntriesByUserIdBetweenDates;
  } else {
    theQueryKey = ["getAllEntriesByUserId", { userId }];
    theQueryFn = getAllEntriesByUserId;
  }

  const { data, isLoading, isError, error } = useQuery(theQueryKey, theQueryFn);

  if (isLoading) {
    return (
      <Flex width="100%" justify={"center"} p={6}>
        <MoonLoader size={200} color={"#4FD1C5"} loading={true} />
      </Flex>
    );
  }

  if (isError) {
    if (error.response.data.message) {
      return <Text>{error.response.data.message}</Text>;
    } else {
      return <Text>Error has occurred!</Text>;
    }
  }

  if (data.data.entries) {
    let entriesToDisplay = data.data.entries.slice(0, numResults);

    return (
      <>
        {entriesToDisplay.length > 0 ? (
          <Flex justifyContent={"center"}>
            <List flexBasis={"100%"}>
              {entriesToDisplay.map((entry) => (
                <>
                  <EntryItem {...entry} key={entry._id} />
                </>
              ))}
            </List>
          </Flex>
        ) : (
          <Text fontSize="2xl" textAlign={"center"}>
            No entries exist within time period provided
          </Text>
        )}
      </>
    );
  } else {
    return (
      <Text textAlign={"center"}>
        No entries exist within time period provided
      </Text>
    );
  }
};

export default EntryLog;
