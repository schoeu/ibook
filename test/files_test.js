/**
 * @file files+test.js
 * @description files模块测试文件
 * @author schoeu
 * */

let expect = require('chai').expect;
let config = require('./config');

let mdb = require('../')({
    port: config.port,
    ignoreDir: config.ignoreDir,
    path: config.path,
    dirname: config.dirNames
});


describe('files test.', function () {

    it('Mdb is ok.', function () {
        expect(mdb).to.be.ok;
    });

    it('Ignore dir is ok.', function () {
        expect(mdb.files.walkArr.length).to.be.equal(2);
    });

    it('Router is ok.', function () {
        expect(mdb.router.methods).to.be.an('array');
    });

    it('App is ok', function () {
        expect(mdb.app).to.be.an('object').to.include.keys('middleware');
    });

    it('File sort', function () {
        expect(mdb.files.walkArr[1].child[0].itemName).to.be.equal('1_1_2');
        expect(mdb.files.walkArr[1].child[0].index).to.be.equal(1);
    });

    it('File title', function () {
        expect(mdb.files.walkArr[1].child[0].title).to.be.equal('1_1_2');
        expect(mdb.files.walkArr[1].child[1].title).to.be.equal('1_1_3_title');
    });
});
