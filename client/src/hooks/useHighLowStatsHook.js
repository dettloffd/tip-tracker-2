import { weekdayParser } from "../util/weekdayParser";
import { monthParser } from "../util/monthParser";

const useHighLowStatsHook = (xKey, yKey) => {
  const extractHighAndLowValues = (chartResponse) => {

    let toBeSorted = [...chartResponse.data.results].sort(
      (a, b) => a[yKey] - b[yKey]
    );

    // use spread operator in order to not mutate array

    let low = toBeSorted[0];
    // array sorted in ascending order; lowest value is 0
    let high = toBeSorted[toBeSorted.length - 1];

    let returnxTop;
    let returnxBottom;

    // top and bottom y values aren't parsed and changed into day, month, year
    // for readability

    switch (xKey) {
      case "day":
        returnxTop = weekdayParser(high[xKey]);
        returnxBottom = weekdayParser(low[xKey]);
        break;
      case "month":
        returnxTop = monthParser(high[xKey]);
        returnxBottom = monthParser(low[xKey]);
        break;
      case "year":
        returnxTop = high[xKey];
        returnxBottom = low[xKey];
        break;
      default:
        returnxTop = weekdayParser(high[xKey]);
        returnxBottom = weekdayParser(low[xKey]);
    }

    return {
      topValue: {
        x: returnxTop,
        y: high[yKey],
      },
      bottomValue: {
        x: returnxBottom,
        y: low[yKey],
      },
    };
  };

  return { extractHighAndLowValues };
};

export default useHighLowStatsHook;
