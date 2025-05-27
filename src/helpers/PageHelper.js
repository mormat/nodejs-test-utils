const { findElements } = require('../functions');

class PageHelper {
    
    #driver;
    
    constructor(driver) {
        this.#driver = driver;
    }
    
    async getText({ 
        selector,
        rootElement
    } = {}) {
        
        const parent = rootElement ?
            rootElement :
            (await findElements(this.#driver, 'body'))[0];
        
        const nodes = selector ?
            await findElements(parent, selector) :
            [ parent ]
        ;
        
        const texts = [];
        for (const node of nodes) {
            texts.push( await node.getText() );
        }
        
        return texts.join(' ').replace(/\s+/g,' ');
        
    }
    
    // @todo missing unit test
    async clickOn(clickableText) {
        const selectors = [
            `//label[normalize-space()='${clickableText}']`,
            `a:contains("${clickableText}")`,
            `a[title="${clickableText}"]`,
            `button:contains("${clickableText}")`,
        ];

        for (const selector of selectors) {
            const [ element ] = await findElements( this.#driver, selector );
            if (element) {
                await element.click();
                return;
            }
        }

        throw `No clickable "${clickableText}" found `; 
    }
    
}

module.exports = PageHelper;