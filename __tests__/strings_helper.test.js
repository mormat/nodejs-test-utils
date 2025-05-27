const { StringHelper } = require('../src');

describe("StringHelper", () => {
   
    const helper = new StringHelper();
   
    test.each([
        ["foo bar baz", "no_matching", 0],
        ["foo bar baz", "foo", 1],
        ["foo bar baz", "ba",  2],
        [2.12, "2", 0]
    ])(".countSubstring(%s, %s) should return %s", (str, substring, expected) => {
        const helper = new StringHelper();
        const actual = helper.countSubstring(str, substring);
        
        expect(actual).toBe(expected);
    });
     
    test(".assertCountSubstringReturns()", () => {
        expect(
            () => helper.assertCountSubstringReturns("foo bar baz", "ba", 1)
        ).toThrow(`Found 2 occurrence(s) of "ba" instead of 1 in "foo \x1B[7mba\x1B[27mr \x1B[7mba\x1B[27mz"`);
    })
});

