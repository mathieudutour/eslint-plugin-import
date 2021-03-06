var chai = require('chai')
  , expect = chai.expect
  , path = require('path')

var webpack = require('../index')

var file = path.join(__dirname, 'files', 'dummy.js')

describe("resolve.alias", function () {
  it("works", function () {
    expect(webpack.resolveImport('foo', file)).to.exist
      .and.equal(path.join(__dirname, 'files', 'some', 'goofy', 'path', 'foo.js'))
  })
})

var resolveAlias = require('../resolve-alias')
describe("webpack alias spec", function () {
  // from table: http://webpack.github.io/docs/configuration.html#resolve-alias
  function tableLine(alias, xyz, xyzFile) {
    describe(JSON.stringify(alias), function () {
      it("xyz: " + xyz, function () {
        expect(resolveAlias('xyz', alias)).to.equal(xyz)
      })
      it("xyz/file: " + (xyzFile.name || xyzFile), function () {
        if (xyzFile === Error) {
          expect(resolveAlias.bind(null, 'xyz/file', alias)).to.throw(xyzFile)
        } else {
          expect(resolveAlias('xyz/file', alias)).to.equal(xyzFile)
        }
      })
    })
  }

  tableLine( {}
           , 'xyz', 'xyz/file' )

  tableLine( { xyz: "/absolute/path/to/file.js" }
           , '/absolute/path/to/file.js', 'xyz/file' )

  tableLine( { xyz$: "/absolute/path/to/file.js" }
           ,  "/absolute/path/to/file.js", Error )

  tableLine( { xyz: "./dir/file.js" }
           , './dir/file.js',  'xyz/file' )

  tableLine( { xyz$: "./dir/file.js" }
           , './dir/file.js', Error )

  tableLine( { xyz: "/some/dir" }
           , '/some/dir', '/some/dir/file' )

  tableLine( { xyz$: "/some/dir" }
           , '/some/dir', 'xyz/file' )

  tableLine( { xyz: "./dir" }
           , './dir', './dir/file' )

  tableLine( { xyz: "modu" }
           , 'modu', 'modu/file' )

  tableLine( { xyz$: "modu" }
           , 'modu', 'xyz/file' )

  tableLine( { xyz: "modu/some/file.js" }
           , 'modu/some/file.js', Error )

  tableLine( { xyz: "modu/dir" }
           , 'modu/dir', 'modu/dir/file' )

  tableLine( { xyz: "xyz/dir" }
           , 'xyz/dir',  'xyz/dir/file' )

  tableLine( { xyz$: "xyz/dir" }
           , 'xyz/dir', 'xyz/file' )
})

describe("nested module names", function () {
  // from table: http://webpack.github.io/docs/configuration.html#resolve-alias
  function nestedName(alias, xyz, xyzFile) {
    describe(JSON.stringify(alias), function () {
      it("top/xyz: " + xyz, function () {
        expect(resolveAlias('top/xyz', alias)).to.equal(xyz)
      })
      it("top/xyz/file: " + (xyzFile.name || xyzFile), function () {
        if (xyzFile === Error) {
          expect(resolveAlias.bind(null, 'top/xyz/file', alias)).to.throw(xyzFile)
        } else {
          expect(resolveAlias('top/xyz/file', alias)).to.equal(xyzFile)
        }
      })
    })
  }

  nestedName( { 'top/xyz': "/absolute/path/to/file.js" }
      , '/absolute/path/to/file.js', 'top/xyz/file' )

  nestedName( { 'top/xyz$': "/absolute/path/to/file.js" }
      ,  "/absolute/path/to/file.js", Error )

  nestedName( { 'top/xyz': "./dir/file.js" }
      , './dir/file.js',  'top/xyz/file' )

  nestedName( { 'top/xyz$': "./dir/file.js" }
      , './dir/file.js', Error )

  nestedName( { 'top/xyz': "/some/dir" }
      , '/some/dir', '/some/dir/file' )

  nestedName( { 'top/xyz$': "/some/dir" }
      , '/some/dir', 'top/xyz/file' )

  nestedName( { 'top/xyz': "./dir" }
      , './dir', './dir/file' )

  nestedName( { 'top/xyz': "modu" }
      , 'modu', 'modu/file' )

  nestedName( { 'top/xyz$': "modu" }
      , 'modu', 'top/xyz/file' )

  nestedName( { 'top/xyz': "modu/some/file.js" }
      , 'modu/some/file.js', Error )

  nestedName( { 'top/xyz': "modu/dir" }
      , 'modu/dir', 'modu/dir/file' )

  nestedName( { 'top/xyz': "top/xyz/dir" }
      , 'top/xyz/dir',  'top/xyz/dir/file' )

  nestedName( { 'top/xyz$': "top/xyz/dir" }
      , 'top/xyz/dir', 'top/xyz/file' )
})
