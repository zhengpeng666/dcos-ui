jest.dontMock("../Units");

var Units = require("../Units");

describe("Units", function () {

  describe("#filesize", function () {
    beforeEach(function () {
      this.baseSize = 796;
    });

    // Regular tests
    it("should convert to correct unit of B", function () {
      expect(Units.filesize(this.baseSize)).toBe("796 B");
    });

    it("should convert to correct unit of KiB", function () {
      expect(Units.filesize(this.baseSize * 1024)).toBe("796 KiB");
    });

    it("should convert to correct unit of MiB", function () {
      var factorize = Math.pow(1024, 2);
      expect(Units.filesize(this.baseSize * factorize)).toBe("796 MiB");
    });

    it("should convert to correct unit of GiB", function () {
      var factorize = Math.pow(1024, 3);
      expect(Units.filesize(this.baseSize * factorize)).toBe("796 GiB");
    });

    it("should convert to correct unit of PiB", function () {
      var factorize = Math.pow(1024, 5);
      expect(Units.filesize(this.baseSize * factorize)).toBe("796 PiB");
    });

    it("should convert to correct unit of large PiB", function () {
      var factorize = Math.pow(1024, 6);
      expect(Units.filesize(this.baseSize * factorize)).toBe("815104 PiB");
    });

    it("should convert to correct unit of MiB", function () {
      expect(Units.filesize((this.baseSize + 108) * 1024)).toBe("0.88 MiB");
    });

    it("should convert to correct unit of GiB", function () {
      var factorize = Math.pow(1024, 2);
      expect(Units.filesize((this.baseSize + 128) * factorize)).toBe("0.9 GiB");
    });

    it("should convert to correct unit of TiB", function () {
      var factorize = Math.pow(1024, 3);
      expect(Units.filesize((this.baseSize + 158) * factorize)).toBe("0.93 TiB");
    });

    it("should convert to correct unit of PiB", function () {
      var factorize = Math.pow(1024, 5);
      expect(Units.filesize((this.baseSize + 230) * factorize)).toBe("1026 PiB");
    });

    // Special tests
    it("should return 0 B", function () {
      expect(Units.filesize(0, 0)).toBe("0 B");
    });

    it("has 0 decimals", function () {
      var size = (this.baseSize + 352) * 1024;
      var filesize = Units.filesize(size, 0, 1024);
      expect(filesize).toBe("1 MiB");
    });

    it("has 3 decimals by 4 decimals defined", function () {
      var size = (this.baseSize + 102) * 1024;
      var filesize = Units.filesize(size, 4);
      expect(filesize).toBe("0.877 MiB");
    });

    it("has 4 decimals", function () {
      var size = (this.baseSize + 116) * 1024;
      var filesize = Units.filesize(size, 4);
      expect(filesize).toBe("0.8906 MiB");
    });

    it("has correct custom unit and threshold", function () {
      var size = (this.baseSize + 24) * 1024 * 1024;
      var filesize = Units.filesize(size, 2, 500, 1024, ["byte", "KB", "MB", "GB"]);
      expect(filesize).toBe("0.8 GB");
    });

  });

});
