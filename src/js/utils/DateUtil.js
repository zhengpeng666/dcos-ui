const DateUtil = {
  msToDateStr: function (ms) {
    var date = new Date(ms);
    var dateStr = "";

    dateStr += date.getMonth() + 1 + "-";
    dateStr += date.getDate() + "-";
    dateStr += date.getFullYear() % 100 + " at ";
    dateStr += DateUtil.formatAMPM(date);

    return dateStr;
  },

  formatAMPM: function (date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();

    var ampm = "am";
    if (hours >= 12) {
      ampm = "pm";
    }

    hours = hours % 12;
    if (hours === 0) {
      hours = 12;
    }

    if (minutes < 10) {
      minutes = "0" + minutes;
    }

    var strTime = `${hours}:${minutes} ${ampm}`;
    return strTime;
  }
};

module.exports = DateUtil;
