import React, { useContext, useEffect, useState } from "react";
//
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import NoDataToDisplay from "highcharts/modules/no-data-to-display";
import SyncLoader from "react-spinners/SyncLoader";
import { MdOutlineTrendingDown, MdOutlineTrendingUp } from "react-icons/md";
import { Box, Divider, Flex, Icon, Text } from "@chakra-ui/react";
import { format, parseISO } from "date-fns";
import { useQuery } from "react-query";
//
import useChartConstructorHook from "../../hooks/useChartConstructorHook";
import useHighLowStatsHook from "../../hooks/useHighLowStatsHook";
import {
  fetchChartDataBetweenDates,
  fetchChartDataNoDates,
} from "../api/statsApi";
import { AuthContext } from "../../auth/AuthContext";
//
const ChartConstructor = ({
  dateRange: { startDate, endDate },
  yKey,
  xKey,
  chartType,
  chartTitle,
}) => {
  const [chartData, setChartData] = useState({ categories: [], yValues: [] });
  const [highAndLowValues, setHighAndLowValues] = useState({
    topValue: {
      x: "",
      y: "",
    },
    bottomValue: {
      x: "",
      y: "",
    },
  });

  // necessary import in order for noData module to work correctly
  NoDataToDisplay(Highcharts);

  const { userId } = useContext(AuthContext);

  const dateRangeProvided = startDate !== "";
  let theQueryKey;
  let theQueryFn;

  if (dateRangeProvided) {
    theQueryKey = [
      `fetchChartDataBetweenDates_${xKey}_${yKey}`,
      { userId },
      { startDate, endDate, statVar: yKey, timeVar: xKey },
    ];
    theQueryFn = fetchChartDataBetweenDates;
  } else {
    theQueryKey = [
      `fetchChartDataNoDates_${xKey}_${yKey}`,
      { userId },
      { statVar: yKey, timeVar: xKey },
    ];
    theQueryFn = fetchChartDataNoDates;
  }

  const { data, isLoading, isError, error } = useQuery(
    theQueryKey,
    theQueryFn,
    {
      onSuccess: (data) => {
        if (data.data.count === 0) {
          // set x and y axis to empty arrays
          // this will inform highcharts that there is no data triggering a noData message
          let chartData = { xAxis: [], yAxis: [] };
          setChartData({
            categories: chartData.xAxis,
            yValues: chartData.yAxis,
          });
          setHighAndLowValues({
            topValue: { x: null, y: null },
            bottomValue: { x: null, y: null },
          });
        } else {
          let values = extractHighAndLowValues(data);
          let chartData = constructAxis(data);
          setChartData({
            categories: chartData.xAxis,
            yValues: chartData.yAxis,
          });
          //Much more succint but less explicit version of above..
          // setChartData({
          //   categories: constructAxis(chartResponse).xAxis,
          //   yValues: constructAxis(chartResponse).yAxis,
          // });

          setHighAndLowValues({
            topValue: { x: values.topValue.x, y: values.topValue.y },
            bottomValue: { x: values.bottomValue.x, y: values.bottomValue.y },
          });
        }
      },
    }
  );

  const { constructAxis } = useChartConstructorHook(xKey, yKey);
  const { extractHighAndLowValues } = useHighLowStatsHook(xKey, yKey);

  if (isError) {
    return <Text>{error.response.data.message}</Text>;
  }

  if (isLoading) {
    return (
      <Flex width="100%" justify={"center"} p={6}>
        <SyncLoader size={10} color={"#4FD1C5"} loading={true} />
      </Flex>
    );
  }

  if (data) {
    const options = {
      chart: {
        type: `${chartType}`,
        //height: (9 / 16 * 100) + '%',
        //16:9 ratio
        //height: "500px",
      },
      title: {
        text: `${chartTitle}`,
      },
      subtitle: {
        // If no start / end date provided, don't show anything..
        // otherwise, formata and show the date range in the subtitle
        text:
          startDate === ""
            ? "Date Range: All Time"
            : "Date Range: " +
              format(parseISO(startDate), "yyyy/MM/dd") +
              " - " +
              format(parseISO(endDate), "yyyy/MM/dd"),
      },
      xAxis: { categories: chartData.categories },
      plotOptions: {
        series: {
          color: "#38B2AC",
        },
      },

      yAxis: {
        // In order to keep the bar graph more readable
        // Take the lowest of all the y values and divide in half
        min:
          `${chartType}` === "bar"
            ? Math.min(...chartData.yValues) / 2
            : Math.min(...chartData.yValues),
      },
      series: [
        {
          name: `${chartTitle}`,
          data: chartData.yValues,
        },
      ],
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500,
            },
            chartOptions: {
              legend: {
                align: "center",
                verticalAlign: "bottom",
                layout: "horizontal",
              },
            },
          },
        ],
      },
      lang: {
        noData: "No data exists for this time period",
      },
      noData: {
        style: {
          fontWeight: "bold",
          fontSize: "1rem",
          color: "#303030",
        },
      },
    };
    return (
      <>
        {/* This is the container for the chart */}
        <Flex
          width={"100%"}
          boxShadow="md"
          bg="white"
          p={1}
          m={1}
          borderRadius="lg"
          direction={"column"}
        >
          <Box>
            {/* {isError && <Text>{error.response.data.message}</Text>} */}
            <HighchartsReact
              highcharts={Highcharts}
              options={options}
            ></HighchartsReact>
          </Box>
          <Divider></Divider>

          <Flex
            p={1}
            alignSelf={"center"}
            width={"100%"}
            maxW={"30rem"}
            justify={"space-between"}
            fontSize={["xs", "sm", "sm", "md", "md"]}
          >
            <Flex alignItems={"center"} justifyContent="space-between">
              <Flex align={"center"} mr={2}>
                <Icon
                  as={MdOutlineTrendingUp}
                  w={6}
                  h={6}
                  color="teal.500"
                  m={2}
                />
                <Text>High Value: </Text>
              </Flex>
              <Text>
                {highAndLowValues.topValue.x}: {highAndLowValues.topValue.y}
              </Text>
            </Flex>

            <Flex alignItems={"center"} justifyContent="space-between">
              <Flex align={"center"} mr={2}>
                <Icon
                  as={MdOutlineTrendingDown}
                  w={6}
                  h={6}
                  color="teal.500"
                  m={2}
                />
                <Text>Low Value: </Text>
              </Flex>
              <Text>
                {highAndLowValues.bottomValue.x}:{" "}
                {highAndLowValues.bottomValue.y}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </>
    );
  }
};

export default ChartConstructor;
