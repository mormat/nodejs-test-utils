const { createDriver, sleep } = require('./functions');
const ElementsHelper = require('./helpers/ElementsHelper');
const PageHelper = require('./helpers/PageHelper');
const StringHelper = require('./helpers/StringHelper');

class ElementsHelperWithThrowingError extends ElementsHelper {
    
    async get(selector, ...vars) {
        const result = await super.get(selector, ...vars);
        if (!result) {
            throw `Failed to get "${selector}" element ${vars}`;
        }
        return result;
    }
    
    async waitFor(selector, ...vars) {
        const result = await super.waitFor(selector, ...vars);
        if (!result) {
            throw `Failed to wait for "${selector}" element ${vars}`;
        }
        return result;
    }
    
}

module.exports = { 
    createDriver,
    PageHelper,
    StringHelper,
    ElementsHelper,
    ElementsHelperWithThrowingError,
    sleep
}

