jest.dontMock("../LoginModal");
jest.dontMock("../../../components/FormModal");
jest.dontMock("../../../components/Form");
jest.dontMock("../../../utils/Util");
jest.dontMock("../../../utils/StringUtil");
jest.dontMock("../../../mixins/StoreMixin");
jest.dontMock("../../../stores/ACLAuthStore");
jest.dontMock("../../../stores/ACLGroupsStore");
jest.dontMock("../../../stores/ACLGroupStore");
jest.dontMock("../../../stores/ACLStore");
jest.dontMock("../../../stores/ACLUsersStore");
jest.dontMock("../../../stores/ACLUserStore");
jest.dontMock("../../../constants/EventTypes");
jest.dontMock("../../../stores/MarathonStore");
jest.dontMock("../../../stores/MesosStateStore");
jest.dontMock("../../../stores/MesosSummaryStore");
jest.dontMock("../../../events/ACLAuthActions");
jest.dontMock("../../../constants/ActionTypes");
jest.dontMock("../../../events/AppDispatcher");
jest.dontMock("../../../constants/EventTypes");
jest.dontMock("../../../mixins/GetSetMixin");
jest.dontMock("../../../utils/Store");

jest.autoMockOff();

var React = require("react/addons");
var TestUtils = React.addons.TestUtils;

var ACLAuthStore = require("../../../stores/ACLAuthStore");
var LoginModal = require("../LoginModal");

describe("LoginModal", function () {
  beforeEach(function () {
    this.instance = TestUtils.renderIntoDocument(
      <LoginModal />
    );
  });

  describe("#handleLoginSubmit", function () {
    beforeEach(function () {
      this.originalLogin = ACLAuthStore.login;
      ACLAuthStore.login = jasmine.createSpy();

      this.model = {name: "kenny"};
      this.instance.handleLoginSubmit(this.model);
    });

    afterEach(function () {
      ACLAuthStore.login = this.originalLogin;
    });

    it("should set disable the login modal while request pending", function () {
      expect(this.instance.state.disableLogin).toEqual(true);
    });

    it("should call ACLAuthStore#login with the model", function () {
      expect(ACLAuthStore.login).toHaveBeenCalledWith(this.model);
    });
  });

  describe("#onAuthStoreError", function () {
    beforeEach(function () {
      this.errorMsg = "Something went wrong";
      this.instance.onAuthStoreError(this.errorMsg);
    });

    it("should enable the modal", function () {
      expect(this.instance.state.disableLogin).toEqual(false);
    });

    it("should set the errorMsg to state", function () {
      expect(this.instance.state.errorMsg).toEqual(this.errorMsg);
    });
  });

  describe("#onAuthStoreSuccess", function () {
    beforeEach(function () {
      this.instance.context = {
        router: {
          transitionTo: jasmine.createSpy()
        }
      };

      this.nextRoute = null;
      this.originalGet = ACLAuthStore.get;
      ACLAuthStore.get = function () {
        return this.nextRoute;
      }.bind(this);
    });

    afterEach(function () {
      ACLAuthStore.get = this.originalGet;
    });

    it("should enable the modal", function () {
      this.instance.onAuthStoreSuccess();
      expect(this.instance.state.disableLogin).toEqual(false);
    });

    it("should transitionTo '/'", function () {
      this.instance.onAuthStoreSuccess();
      expect(this.instance.context.router.transitionTo)
        .toHaveBeenCalledWith("/");
    });

    it("should transitionTo the redirect route if it exists", function () {
      this.nextRoute = "services";
      this.instance.onAuthStoreSuccess();
      expect(this.instance.context.router.transitionTo)
        .toHaveBeenCalledWith("services");
    });
  });
});
