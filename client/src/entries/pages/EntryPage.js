import React, { useState } from "react";
//
import { Box, Flex } from "@chakra-ui/react";
//
import EntryLog from "../components/EntryLog";
import HeatMap from "../components/HeatMap";
import DateRangeSelector from "../../util/DateRangeSelector";
import useWindowDimensions from "../../hooks/useWindowDimensions";

const EntryPage = ({ numResults }) => {
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const { width } = useWindowDimensions();

  return (
    <>
      {/* Container for the remaining page aside from the sidebar */}
      <Flex w="100%" justifyContent={"center"} bg="white">
        {/* Container of all content */}
        <Flex
          w="80%"
          justifyContent={"center"}
          flexDir="column"
          alignItems={"center"}
          bg="white"
          mt={"6.5rem"}
        >
          <HeatMap
            numDays={width < 760 ? 150 : 365}
            mapwidth="100%"
            mapheight="15rem"
          />

          {/* Container for entries  */}
          <Box
            w="80%"
            bg={"white"}
            m={3}
            boxShadow="lg"
            p={4}
            borderRadius="lg"
          >
            <Flex justifyContent={"center"} p={5}>
              <DateRangeSelector
                setDateRange={setDateRange}
                placeholderMessage={"Select Date Range to Filter"}
              />
            </Flex>
            {/* dateRange prop is initially set to empty strings; only if selected on daterangepicker will it rerender */}
            <EntryLog numResults={numResults} dateRange={dateRange} />
          </Box>
        </Flex>
      </Flex>
    </>
  );
};

export default EntryPage;
