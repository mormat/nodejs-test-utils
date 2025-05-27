
class StringHelper {
    
    countSubstring(str, substr) {
        if (typeof str === 'string') {
            return str.split(substr).length - 1;
        }
        return 0;
    }
    
    assertCountSubstringReturns(str, substr, expected) {
        const actual = this.countSubstring(str, substr);
        if (actual != expected) {
            const highlighted = str.replaceAll(
                substr, 
                "\x1B[7m" + substr + "\x1B[27m"
            );
            throw `Found ${actual} occurrence(s) of "${substr}" ` + 
                `instead of ${expected} in "${highlighted}"`;
        }
    }
    
}

module.exports = StringHelper;