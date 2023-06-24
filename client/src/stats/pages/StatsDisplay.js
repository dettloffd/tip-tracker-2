import { Flex } from "@chakra-ui/react";
//
import { chartFieldsArray } from "../chartFieldsArray";
import ChartConstructor from "../components/ChartConstructor";

const StatsEntries = ({ dateRange }) => {
  return (
    <>
      {/* This is the container for the column of charts - child of this item is the container of the chart */}
      <Flex direction={"column"} align={"center"}>
        {chartFieldsArray.map((chart) => (
          <ChartConstructor
            key={chart.chartTitle}
            {...chart}
            dateRange={dateRange}
          />
        ))}
      </Flex>
    </>
  );
};

export default StatsEntries;
