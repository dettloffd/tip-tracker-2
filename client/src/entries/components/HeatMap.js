import { useContext } from "react";
//
import { Box, Flex, Text } from "@chakra-ui/react";
import { format, parseISO } from "date-fns";
import { useQuery } from "react-query";
import { ResponsiveTimeRange } from "@nivo/calendar";
import MoonLoader from "react-spinners/MoonLoader";
//
import { getAllEntriesByUserIdBetweenDates } from "../api/entriesApi";
import { AuthContext } from "../../auth/AuthContext";


export default function HeatMap({ numDays, mapwidth, mapheight }) {
  const today = new Date();
  const { userId } = useContext(AuthContext);

  function shiftDate(date, numDays) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + numDays);
    return newDate;
  }

  //   startDate -> shiftDate function gives date numDays before today, it's parsed as ISO, then formatted.
  let startDate = format(
    parseISO(shiftDate(today, -numDays).toISOString()),
    "yyyy-MM-dd"
  );

  // Shifting date by + 1 will ensure today's date is shown on the heatmap
  // due to the way mongoDb interprets to and from dates
  let endDate = format(
    parseISO(shiftDate(today, +1).toISOString()),
    "yyyy-MM-dd"
  );

  const { data, isLoading } = useQuery(
    ["heatMapDates", { userId }, { startDate, endDate }],
    getAllEntriesByUserIdBetweenDates
  );

  const entryTooltip = ({ day, tipsTotal, numTransactions }) => {
    return (
      <Box
        fontWeight={"bold"}
        opacity={".9"}
        color="teal.500"
        bgColor="gray.900"
        p={5}
      >
        <Text>Date: {format(parseISO (day),"EEEE, yyyy-MM-dd" )}</Text>
        <Text>Total tips: {tipsTotal}</Text>
        <Text>Number of transactions: {numTransactions}</Text>
        <Text>Average Tip: {(tipsTotal / numTransactions).toFixed(2)}</Text>
      </Box>
    );
  };

  let heatmapValues = [];

  if (data) {

    if (data.data.entries) {
      let returnEntries = data.data.entries;
      // Timerange is expecting "Day" and "value" fields
      returnEntries.forEach((entry) =>
        heatmapValues.push({
          day: entry.date,
          value: 1,
          tipsTotal: entry.tipsTotal,
          numTransactions: entry.numTransactions,
        })
      );
    } 
    //  if no entries, leave heatmapValus as empty array
  }

  if (isLoading) {
    return (
      <Flex width="100%" justify={"center"} p={6}>
        <MoonLoader size={200} color={"#4FD1C5"} loading={true} />
      </Flex>
    );
  }

  return (
    <>
      {/* Change width % based on viewport size for responsiveness  */}
      {/* Box holds the heatmap so it can be centered - added inside component to allow for adding numdays text easer */}
      <Box w={mapwidth} h={mapheight} className="heatmap-parent-box">
        {" "}
        <ResponsiveTimeRange
          data={heatmapValues}
          // height={350}
          // width={900}
          from={startDate}
          to={endDate}
          emptyColor="#eeeeee"
          colors={["#319795"]}
          margin={{ top: 20, right: 20, bottom: 0, left: 20 }}
          dayBorderWidth={2}
          dayBorderColor="#ffffff"
          weekdayLegendOffset={60}
          dayRadius={3}
          tooltip={entryTooltip}
        />
      </Box>
      <Text textAlign={"center"} color="gray.500">
        {`( Previous ${numDays} days )`}
      </Text>
    </>
  );
}
