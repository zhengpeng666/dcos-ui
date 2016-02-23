// Get the real (not mocked) version of the 'path' module
var Plugin = require.requireActual('path');

// Get the automatic mock for `fs`
var fsMock = jest.genMockFromModule('fs');

// This is a custom function that our tests can use during setup to specify
// what the files on the "mock" filesystem should look like when any of the
// `fs` APIs are used.
var _mockFiles = {};
function __setMockFiles(newMockFiles) {
  _mockFiles = {};
  for (var file in newMockFiles) {
    var dir = path.dirname(file);

    if (!_mockFiles[dir]) {
      _mockFiles[dir] = [];
    }

    _mockFiles[dir].push(path.basename(file));
  }
};

// A custom version of `readdirSync` that reads from the special mocked out
// file list set via __setMockFiles
function readdirSync(directoryPath) {
  return _mockFiles[directoryPath] || [];
};

// Override the default behavior of the `readdirSync` mock
fsMock.readdirSync.mockImplementation(readdirSync);

// Add a custom method to the mock
fsMock.__setMockFiles = __setMockFiles;

module.exports = fsMock;
