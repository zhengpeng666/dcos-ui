const DEFAULT_INTERVAL_LENGTH = 1000 * 60; // One minute
const DEFAULT_MAX_INTERVALS = 60;

let Utils = {
  normalizeTimeSeriesData: function(dataSets, options = {}) {
    const INTERVAL_LENGTH = options.intervalLength || DEFAULT_INTERVAL_LENGTH;
    const MAX_INTERVALS = options.maxIntervals || DEFAULT_MAX_INTERVALS;
    let currentTime = Date.now();
    let normalizedDataSets = [];
    let timestamps = [];

    // Add all received timestamps to the timestamps array.
    dataSets.forEach(function (dataSet, index) {
      normalizedDataSets[index] = [];
      Object.keys(dataSet).forEach(function (timestamp) {
        if (timestamps.indexOf(timestamp) === -1) {
          timestamps.push(timestamp);
        }
      });
    });

    timestamps.sort();

    // For each timestamp, loop through the datasets and create the normalized
    // data array.
    timestamps.forEach(function (timestamp) {
      dataSets.forEach(function (dataSet, index) {
        // Add 0 if the data doesn't exist for that timestamp.
        normalizedDataSets[index].push(dataSet[timestamp] || 0);
      });
    });

    if (timestamps.length === MAX_INTERVALS) {
      // Return now if we have the desired number of intervals.
      return normalizedDataSets;
    } else if (timestamps.length > MAX_INTERVALS) {
      // If we have more timestamps than the max intervals, we return the newest
      // data points we have.
      normalizedDataSets.forEach(function (dataSet, index) {
        normalizedDataSets[index] = dataSet.splice(dataSet.length - MAX_INTERVALS);
      });
      return normalizedDataSets;
    }

    // Check if the most recent timestamp is greater than the interval length.
    if (timestamps[timestamps.length - 1] > currentTime - INTERVAL_LENGTH) {
      // Need to fill in zeroes at end of array.
      for (let i = timestamps.length; i < MAX_INTERVALS; i++) {
        dataSets.forEach(function (dataSet, index) {
          normalizedDataSets[index].push(0);
        });
      }
    } else {
      // Need to fill in zeroes at beginning of array.
      for (let i = timestamps.length; i < MAX_INTERVALS; i++) {
        dataSets.forEach(function (dataSet, index) {
          normalizedDataSets[index].unshift(0);
        });
      }
    }


    return normalizedDataSets;
  }
};

module.exports = Utils;
