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

    timestamps.reverse();

    // For each timestamp, loop through the datasets and create the normalized
    // data array.
    timestamps.forEach(function (timestamp, timestampIndex) {
      if (timestampIndex >= MAX_INTERVALS) {
        return;
      }

      dataSets.forEach(function (dataSet, dataSetIndex) {
        // Add 0 if the data doesn't exist for that timestamp.
        normalizedDataSets[dataSetIndex].push(dataSet[timestamp] || 0);
      });
    });

    if (timestamps.length === MAX_INTERVALS) {
      // Return now if we have the desired number of intervals.
      return normalizedDataSets;
    }

    // Check if the most recent timestamp is greater than the interval length.
    let arrayAction;
    if (timestamps[timestamps.length - 1] > currentTime - INTERVAL_LENGTH) {
      // Need to fill in zeroes at end of array.
      arrayAction = 'push';
    } else {
      // Need to fill in zeroes at beginning of array.
      arrayAction = 'unshift';
    }

    for (let i = timestamps.length; i < MAX_INTERVALS; i++) {
      dataSets.forEach(function (dataSet, dataSetIndex) {
        normalizedDataSets[dataSetIndex][arrayAction](0);
      });
    }

    return normalizedDataSets;
  }
};

module.exports = Utils;
