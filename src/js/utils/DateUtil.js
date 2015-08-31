const DateUtil = {
  msToDateStr: function (ms) {
    var date = new Date(ms);
    var dateStr = "";
    console.log(date.getYear());
    dateStr += date.getMonth() + "-";
    dateStr += date.getDate() + "-";
    dateStr += date.getFullYear() % 1000 + " at ";
    dateStr += DateUtil.formatAMPM(date);

    return dateStr;
  },

  formatAMPM: function (date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";

    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  }
};

module.exports = DateUtil;
