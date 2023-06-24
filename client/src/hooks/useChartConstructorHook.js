import { weekdayParser } from "../util/weekdayParser";
import { monthParser } from "../util/monthParser";

const useChartConstructorHook = (xKey, yKey) => {
  const constructAxis = (chartResponse) => {
    let x = [];
    let y = [];

    if (chartResponse.data.params.timeVar === "day") {
      for (let i = 0; i < chartResponse.data.count; i++) {
        x[i] = weekdayParser(chartResponse.data.results[i][xKey]);
        y[i] = chartResponse.data.results[i][[yKey]];
      }
    }

    if (chartResponse.data.params.timeVar === "month") {
      for (let i = 0; i < chartResponse.data.count; i++) {
        x[i] = monthParser(chartResponse.data.results[i][xKey]);
        y[i] = chartResponse.data.results[i][[yKey]];
      }
    }

    if (chartResponse.data.params.timeVar === "year") {
      for (let i = 0; i < chartResponse.data.count; i++) {
        x[i] = chartResponse.data.results[i][xKey];
        y[i] = chartResponse.data.results[i][yKey];
      }
    }

    return { xAxis: x, yAxis: y };
  };

  return { constructAxis };
};

export default useChartConstructorHook;
