exports.intervalToInt = function(interval) {
  switch (interval) {
    case "day":
      return 1;
    case "week":
      return 7;
    case "month":
      return 30;
    case "year":
      return 365;
  }
};