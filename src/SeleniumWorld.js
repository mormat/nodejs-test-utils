const { 
    Builder, 
    By, 
    until,
    ExpectedConditions
} = require('selenium-webdriver');

const css2xpath       = require('css2xpath');

class SeleniumWorld {
    
    static driver;
    #baseUrl;
    
    constructor({baseUrl = ''}) {
        
        this.#baseUrl = baseUrl;
        
        if (!SeleniumWorld.driver) {
            SeleniumWorld.driver = this.createDriver();
        }
        
    }
    
    get driver()
    {
        return SeleniumWorld.driver;
    }
    
    async openUrl(url) {
        await this.driver.get( this.#baseUrl + url );
    }
    
    createDriver()
    {
        const builder = new Builder().withCapabilities({
            'browserName': 'chrome',
            'goog:loggingPrefs': { 'browser':'ALL' },
        });

        return builder.build();
    }
    
    async getPageText(selector = 'body') {

        const elements = await this.findElements(selector);

        if (elements.length === 0) {
            throw `No elements found matching '${selector}'`
        }

        let texts = [];
        for (const element of elements) {
            texts.push(await element.getText());
        }

        return texts.join(' ').replace(/\s+/g,' ');

    }
    
    async waitForText(expectedText, options) {

        const selector = `:contains("${expectedText}")`;

        await this.waitFor(selector, options);
    }
    
    async waitFor(selector, { timeout = 10000 } = {}) {
        await this.driver.wait(
            until.elementIsVisible( 
                this.driver.findElement( By.xpath(css2xpath(selector)) )
            ), 
            timeout
        );
    }
    
    wait(timeout = 1000) {
        return new Promise((resolve) => {
            setTimeout(function() {
                resolve();
            }, timeout)
        });
    }
    
    async findElements(selector, parent = null) {

        const attempts = [
            () => By.css(selector),
            () => By.xpath(css2xpath(selector)),
            () => By.xpath(selector),
        ];

        for (let attempt of attempts) {
            try {
                return await (parent ? parent : this.driver).findElements(attempt());
            } catch (err) {
                if (err.constructor.name !== 'InvalidSelectorError') {
                    throw err;
                }
            }
        }        

        return [];

    }
    
    async getElement(selector, ...vars) {
        const elements = await this.findElements(selector, ...vars);
        if (elements.length) {
            return elements[0];
        }
        throw `Couldn't find element matching ${selector}`;
    }

    async clickOn(selector) {
        const element = await this.getElement(selector);
        await element.click();
    }

    getActiveElement() {
        return this.driver.switchTo().activeElement();
    }

    async dragAndDrop(fromPoint, toPoint) {

        const fn = ({x, y}) => ({
            x: Math.floor(x),
            y: Math.floor(y)
        });
        const actions = this.driver.actions({async: true});
        await actions.move(fn(fromPoint)).press().perform();
        await actions.move(fn(toPoint)).click().perform();

    }
    
}

module.exports = SeleniumWorld;