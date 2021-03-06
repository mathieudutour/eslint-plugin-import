var expect = require('chai').expect

var path = require('path')
var node = require('../index.js')

describe("paths", function () {
  it("handles base path relative to CWD", function () {
    expect(node.resolveImport('../', './test/file.js'))
      .to.equal(path.resolve(__dirname, '../index.js'))
  })
})
