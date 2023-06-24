import { useState, useRef, useEffect } from "react";
//
import { DateRangePicker } from "react-date-range";
import format from "date-fns/format";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
//
import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from "@chakra-ui/react";
import { MdCalendarToday } from "react-icons/md";

const DateRangeSelector = ({ setDateRange, placeholderMessage }) => {
  // controls the date range being used in the date picker
  const [range, setRange] = useState([
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ]);

  // controls whether the datepicker is open or not
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.addEventListener("keydown", hideOnEscape, true);
    document.addEventListener("click", hideOnClickOutside, true);
  }, []);

  const hideOnEscape = (e) => {
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  // get target element to toggle
  const refOne = useRef(null);

  const hideOnClickOutside = (e) => {
    if (refOne.current && !refOne.current.contains(e.target)) {
      setOpen(false);
    }
  };

  return (
    <Flex
      bgColor={"white"}
      padding={3}
      justifyContent={"center"}
      alignItems={"center"}
      flexDirection="column"
      className="calendarWrap"
      w="80%"
    >
      <InputGroup size={["sm"]}>
        <InputLeftElement
          pointerEvents="none"
          children={<MdCalendarToday />}
        ></InputLeftElement>
        <Input
          mb={1}
          focusBorderColor="teal.400"
          fontSize={["xs", "xs", "sm"]}
          width={"100%"}
          textAlign="center"
          onClick={() => setOpen((open) => !open)}
          placeholder={
            placeholderMessage ? placeholderMessage : "Set Chart Date Range"
          }
          // If there's a value selected by the user, display that value
          // otherwise, make an empty string so that the user sees the placeholder
          value={
            range[0].startDate !== null && range[0].endDate !== null
              ? ` ${format(range[0].startDate, "yyyy/MM/dd")} to ${format(
                  range[0].endDate,
                  "yyyy/MM/dd"
                )}`
              : ""
          }
          className="inputBox"
        />
      </InputGroup>

      <div ref={refOne}>
        {open && (
          <DateRangePicker
            rangeColors={["#38B2AC"]}
            // when dates picked in the datepicker, change the range being held in state
            onChange={(item) => {
              setRange([item.selection]);
              // This setDateRange will set the date range and refresh the graphs when the range of datepicker is changed
              // setDateRange({
              //   startDate: format(item.selection.startDate, "yyyy-MM-dd"),
              //   endDate: format(item.selection.endDate, "yyyy-MM-dd"),
              // });
            }}
            editableDateInputs={true}
            moveRangeOnFirstSelection={false}
            ranges={range}
            months={1}
            direction="vertical"
            display="none"
            className="calendarElement"
          />
        )}
      </div>
      <Flex
        justifyContent={["center"]}
        alignItems="center"
        width={"100%"}
        flexDir={["column", "column", "row", "row", "row"]}
      >
        <Button
          m={[0, 0, 2]}
          variant="solid"
          colorScheme="teal"
          size="sm"
          isDisabled={(range[0]["startDate"] && range[0]["endDate"]) == null}
          // Sets the date range manually in parent element to trickle down to charts
          // unnecessary maybe since refactored to change on click?
          onClick={() => {
            setDateRange({
              startDate: format(range[0].startDate, "yyyy-MM-dd"),
              endDate: format(range[0].endDate, "yyyy-MM-dd"),
            });
          }}
        >
          <Text fontSize={["xs", "sm", "sm"]}>Confirm Date Range</Text>
        </Button>
        {/* This resets the parent element (so charts will cover all time) and the input fields */}
        {/* Also resets the range in the datepicker */}
        <Button
          m={[0, 0, 2]}
          size="sm"
          onClick={() => {
            // reset daterange in parent element
            setDateRange({
              startDate: "",
              endDate: "",
            });
            // reset datepicker ranges previously selected
            setRange([
              {
                startDate: null,
                endDate: null,
                key: "selection",
              },
            ]);
          }}
        >
          <Text fontSize={["xs", "sm", "sm"]}>Reset</Text>
        </Button>
      </Flex>
    </Flex>
  );
};

export default DateRangeSelector;
