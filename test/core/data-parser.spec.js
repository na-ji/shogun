var chai = require('chai');
chai.use(require('chai-datetime'));
var expect = chai.expect;

import { parseDateAgo, trimSpaces } from '../../app/core/data-parsers';

describe('date parsers', function () {
    describe('date ago', function () {
        let dateParseFailed = new Date(1970, 0, 1);
        let types = ['minute', 'hour', 'day', 'week', 'month', 'year'];
        types.forEach(function (type) {
            [type, type + 's'].forEach(function (t) {
                it('expect to parse ' + t, function () {
                    let parsed = parseDateAgo('8 ' + t + ' ago');
                    expect(parsed).to.be.a('date');
                    expect(parsed).to.not.equalDate(dateParseFailed);
                });
            });
        });

        it('expect Date when parse failed', function () {
            let parsed = parseDateAgo('yolo');
            expect(parsed).to.be.a('date');
            expect(parsed).to.equalDate(dateParseFailed);
        });
    });
});

describe('str parsers', function () {
    describe('trimSpaces', function () {
        it('expect spaces trimed before and after', function () {
            let str = trimSpaces('  caca   ');
            expect(str).to.be.a('string');
            expect(str).to.equal('caca');
        });

        it('expect spaces trimed inside', function () {
            let str = trimSpaces('  caca   pipi  ');
            expect(str).to.be.a('string');
            expect(str).to.equal('caca pipi');
        });
    });
});
