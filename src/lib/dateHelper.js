/**
 Get the number of days between two dates - not inclusive.

 "between" does not include the start date, so days
 between Thursday and Friday is one, Thursday to Saturday
 is two, and so on. Between Friday and the following Friday is 7.

 e.g. getDaysBetweenDates( 22-Jul-2011, 29-jul-2011) => 7.

 If want inclusive dates (e.g. leave from 1/1/2011 to 30/1/2011),
 use date prior to start date (i.e. 31/12/2010 to 30/1/2011).

 Only calculates whole days.

 Assumes d0 <= d1
 */
exports.getDaysBetweenDates = function(d0, d1, tz) {

  const msPerDay = 8.64e7;

  // Copy dates so don't mess them up
  const x0 = new Date(d0);
  const x1 = new Date(d1);

  // Set to noon - avoid DST errors
  x0.setUTCHours(12+tz,0,0);
  x1.setUTCHours(12+tz,0,0);

  // Round to remove daylight saving errors
  return Math.round( (x1 - x0) / msPerDay );
};

/**
 * Formats a written day nem into a date object
 * Today -> new Date()
 * Yesterday -> new Date() - 1
 * @param day - written day [yesterday, today, tomorrow]
 * @return {Date} - date object
 */
exports.dayToDate = function(day) {
  const date = new Date();
  if (day === "today") {
    return date;
  } else if (day === "yesterday") {
    date.setUTCDate(date.getUTCDate() - 1);
    return date;
  } else if (day === "tomorrow") {
    date.setUTCDate(date.getUTCDate() + 1);
    return date;
  }
  return date;
};

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
    case "N/A":
      return -1;
  }
};