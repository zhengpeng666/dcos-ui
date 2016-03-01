var fixturePath = '../../../../tests/_fixtures/networking/networking-backend-connections.json';

jest.dontMock(fixturePath);

var ClientList = require('../ClientList');
var BackendConnection = require('../BackendConnection');
var backendConnectionsDetail = require(fixturePath);

describe('BackendConnection', function () {

  beforeEach(function () {
    this.backendConnection = new BackendConnection(backendConnectionsDetail);
  });

  describe('#getClients', function () {

    it('returns an instance of ClientList', function () {
      expect(this.backendConnection.getClients() instanceof ClientList).toBeTruthy();
    });

    it('returns the all of the backends it was given', function () {
      expect(this.backendConnection.getClients().getItems().length).toEqual(
        backendConnectionsDetail.clients.length
      );
    });

  });

});
