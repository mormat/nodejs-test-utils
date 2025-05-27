const { 
    findElements,
    sleep
} = require('../functions');

class ElementsHelper {
    
    #driver;
    
    constructor(driver) {
        this.#driver = driver;
    }
    
    async get(selector, { rootElement } = {}) {
        const elements = await findElements(
            rootElement ? rootElement : this.#driver, 
            selector
        );
        
        return elements[0];
    }
    
    async select(selector, { rootElement } = {}) {
        return await findElements(
            rootElement ? rootElement : this.#driver, 
            selector
        );
    }
    
    async waitFor(selector, { timeout = 1000, removed = false, ...otherOptions } = {}) {
        
        let duration = 0;
        let step = 100;
        while (duration < timeout) {
            const elements = await this.select(selector, otherOptions);
            if (!removed && elements.length > 0) {
                return true;
            }
            if (removed && elements.length == 0) {
                return true;
            }
            await sleep(step);
            duration += step;
        }
        
        return false;
        
    }
    
    async clickOn(selector, options) {
        
        const element = await this.get(selector, options);
        await element.click();
        
    }
    
}

module.exports = ElementsHelper;