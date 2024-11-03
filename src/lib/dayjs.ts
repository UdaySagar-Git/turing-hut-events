import day from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isBetween from "dayjs/plugin/isBetween";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";


day.extend(relativeTime);
day.extend(duration);
day.extend(customParseFormat);
day.extend(isBetween);
day.extend(timezone);
day.extend(utc);

export default day;
