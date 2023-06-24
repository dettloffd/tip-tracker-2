import React, { useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import StatsEntries from "./StatsDisplay";
import DateRangeSelector from "../../util/DateRangeSelector";

const StatsPage = () => {
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });

  return (
    <>
      {/* Container for the remaining page aside from the sidebar */}
      <Flex w="100%" justifyContent={"center"} bg="white">
        {/* Container of all content */}
        <Flex
          w="90%"
          justifyContent={"center"}
          flexDir="column"
          alignItems={"center"}
          bg="white"
          mt={"3rem"}
        >
          {/* Container for charts  */}
          <Box
            w="95%"
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
            <StatsEntries dateRange={dateRange} />
          </Box>
        </Flex>
      </Flex>
    </>
  );
};

export default StatsPage;
