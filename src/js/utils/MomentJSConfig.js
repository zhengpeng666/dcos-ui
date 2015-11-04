import moment from "moment";

moment.locale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s Ago",
    s: "Seconds",
    m: "A Min",
    mm: "%d Mins",
    h: "An Hour",
    hh: "%d Hrs",
    d: "A Day",
    dd: "%d Days",
    M: "A Month",
    MM: "%d Mos",
    y: "A Year",
    yy: "%d Yrs"
  }
});
