var chapterRecognition = require('../../app/utils/chapter-recognition');

var specs = [
    {
        it: 'expect to recognise Ch.{number}',
        name: 'Mokushiroku Alice Vol.1 Ch.4: Misrepresentation',
        result: 4
    },
    {
        it: 'expect to recognise Ch.{number.decimal}',
        name: 'Mokushiroku Alice Vol.1 Ch.4.1: Misrepresentation',
        result: 4.1
    },
    {
        it: 'expect to recognise Ch.{number.decimal}',
        name: 'Mokushiroku Alice Vol.1 Ch.4.4: Misrepresentation',
        result: 4.4
    },
    {
        it: 'expect to recognise Ch.{number.letter}',
        name: 'Mokushiroku Alice Vol.1 Ch.4.a: Misrepresentation',
        result: 4.1
    },
    {
        it: 'expect to recognise Ch.{number.letter}',
        name: 'Mokushiroku Alice Vol.1 Ch.4.b: Misrepresentation',
        result: 4.2
    },
    {
        it: 'expect to recognise Ch.{number.extra}',
        name: 'Mokushiroku Alice Vol.1 Ch.4.extra: Misrepresentation',
        result: 4.99
    },
    {
        it: 'expect to recognise Ch.{number.omake}',
        name: 'Mokushiroku Alice Vol.1 Ch.4.omake: Misrepresentation',
        result: 4.98
    },
    {
        it: 'expect to recognise Ch.{number.special}',
        name: 'Mokushiroku Alice Vol.1 Ch.4.special: Misrepresentation',
        result: 4.97
    },
    {
        it: 'expect to recognise {number}',
        name: 'Bleach 567: Down With Snowwhite',
        result: 567
    },
    {
        it: 'expect to recognise {number.decimal}',
        name: 'Bleach 567.1: Down With Snowwhite',
        result: 567.1
    },
    {
        it: 'expect to recognise {number.decimal}',
        name: 'Bleach 567.4: Down With Snowwhite',
        result: 567.4
    },
    {
        it: 'expect to recognise {number.letter}',
        name: 'Bleach 567.a: Down With Snowwhite',
        result: 567.1
    },
    {
        it: 'expect to recognise {number.letter}',
        name: 'Bleach 567.b: Down With Snowwhite',
        result: 567.2
    },
    {
        it: 'expect to recognise {number.extra}',
        name: 'Bleach 567.extra: Down With Snowwhite',
        result: 567.99
    },
    {
        it: 'expect to recognise multiple {number}',
        name: 'Solanin 028 Vol. 2',
        title: 'Solanin',
        result: 28
    },
    {
        it: 'expect to recognise multiple {number.decimal}',
        name: 'Solanin 028.1 Vol. 2',
        title: 'Solanin',
        result: 28.1
    },
    {
        it: 'expect to recognise multiple {number.letter}',
        name: 'Solanin 028.b Vol. 2',
        title: 'Solanin',
        result: 28.2
    },
    {
        it: 'expect to recognise multiple {number} in wrong order',
        name: 'Onepunch-Man Punch Ver002 028',
        title: 'Onepunch-Man',
        result: 28
    }
];

describe('chapter recognition', function () {
    specs.forEach(function (spec) {
        it(spec.it, function () {
            let result = chapterRecognition.parseChapterNumber({name: spec.name}, {title: spec.title});
            let expectedMatch = {
                name: spec.name,
                chapter_number: spec.result
            };
            expect(result).toMatchObject(expectedMatch);
        });
    });
});
