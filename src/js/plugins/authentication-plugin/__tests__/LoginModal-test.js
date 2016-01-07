jest.dontMock("../LoginModal");
jest.dontMock("../../../components/ClusterHeader");
jest.dontMock("../../../components/FormModal");
jest.dontMock("../../../components/Form");
jest.dontMock("../../../components/FormControl");
jest.dontMock("../../../components/FieldInput");
jest.dontMock("../../../components/FieldPassword");
jest.dontMock("../../../utils/Util");
jest.dontMock("../../../utils/StringUtil");
jest.dontMock("../../../stores/ACLAuthStore");
jest.dontMock("../../../stores/ACLGroupsStore");
jest.dontMock("../../../stores/ACLGroupStore");
jest.dontMock("../../../stores/ACLStore");
jest.dontMock("../../../stores/ACLUsersStore");
jest.dontMock("../../../stores/ACLUserStore");
jest.dontMock("../../../constants/EventTypes");
jest.dontMock("../../../constants/FieldTypes");
jest.dontMock("../../../stores/MarathonStore");
jest.dontMock("../../../stores/MesosStateStore");
jest.dontMock("../../../stores/MesosSummaryStore");
jest.dontMock("../../../events/ACLAuthActions");
jest.dontMock("../../../constants/ActionTypes");
jest.dontMock("../../../events/AppDispatcher");
jest.dontMock("../../../constants/EventTypes");
jest.dontMock("../../../mixins/GetSetMixin");

require("../../../utils/StoreMixinConfig");

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

  describe("#onAuthStoreRoleChange", function () {
    beforeEach(function () {
      this.instance.context = {
        router: {
          transitionTo: jasmine.createSpy()
        }
      };

      this.nextRoute = null;
      this.originalGet = ACLAuthStore.get;
      this.originalIsAdmin = ACLAuthStore.isAdmin;
      ACLAuthStore.get = function () {
        return this.nextRoute;
      }.bind(this);
      ACLAuthStore.isAdmin = function () { return true; };
    });

    afterEach(function () {
      ACLAuthStore.get = this.originalGet;
      ACLAuthStore.isAdmin = this.originalIsAdmin;
    });

    it("should enable the modal", function () {
      this.instance.onAuthStoreRoleChange();
      expect(this.instance.state.disableLogin).toEqual(false);
    });

    it("should transitionTo 'access-denied' if not admin", function () {
      var prevIsAdmin = ACLAuthStore.isAdmin;
      ACLAuthStore.isAdmin = function () { return false; };

      this.instance.onAuthStoreRoleChange();
      expect(this.instance.context.router.transitionTo)
        .toHaveBeenCalledWith("/access-denied");

      ACLAuthStore.isAdmin = prevIsAdmin;
    });

    it("should transitionTo '/' if admin", function () {
      this.instance.onAuthStoreRoleChange();
      expect(this.instance.context.router.transitionTo)
        .toHaveBeenCalledWith("/");
    });

    it("should transitionTo the redirect route if it exists", function () {
      this.nextRoute = "services";
      this.instance.onAuthStoreRoleChange();
      expect(this.instance.context.router.transitionTo)
        .toHaveBeenCalledWith("services");
    });
  });
});
