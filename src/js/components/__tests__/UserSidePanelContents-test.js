jest.dontMock("../SidePanelContents");
jest.dontMock("../UserSidePanelContents");
jest.dontMock("../../events/MesosSummaryActions");
jest.dontMock("../../stores/MesosSummaryStore");
jest.dontMock("../../events/ACLUsersActions");
jest.dontMock("../../stores/ACLUserStore");
jest.dontMock("../../mixins/GetSetMixin");
jest.dontMock("./RequestErrorMsg");
jest.dontMock("../../utils/MesosSummaryUtil");
jest.dontMock("../../utils/StringUtil");
jest.dontMock("../../utils/Store");
jest.dontMock("../../utils/Util");

import React from "react";
import TestUtils from "react-addons";
// var TestUtils = React.addons.TestUtils;

import ACLUserStore from "../stores/ACLUserStore";
import MesosSummaryStore from "../stores/MesosSummaryStore";
import RequestErrorMsg from "./RequestErrorMsg";
import SidePanelContents from "./SidePanelContents";
import StringUtil from "../utils/StringUtil";
import UserSidePanelContents from "../UserSidePanelContents";

describe("UserSidePanelContents", function () {
  beforeEach(function () {
    //
  });

  describe("#render", function () {
    beforeEach(function () {
      //
    });

    it("should return error component if fetch error was received", function () {
      var instance = TestUtils.renderIntoDocument(
        <UserSidePanelContents open={true} />
      );
      expect(TestUtils.isElementOfType(instance.render(), RequestErrorMsg)).toEqual(null);
    });

  });

});
