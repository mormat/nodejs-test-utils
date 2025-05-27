const { 
    Builder,
    By
} = require('selenium-webdriver');

const css2xpath       = require('css2xpath');

async function findElements(driverOrElement, selector) {

    const attempts = [
        () => By.css(selector),
        () => By.xpath(css2xpath(selector)),
        () => By.xpath(selector),
    ];

    for (let attempt of attempts) {
        try {
            return await driverOrElement.findElements(attempt());
        } catch (err) {
            if (err.constructor.name !== 'InvalidSelectorError') {
                throw err;
            }
        }
    }        

    return [];

}

function createDriver({
    browserName = 'chrome',
    ...otherCapabilities
} = {}){
    
    const builder = new Builder().withCapabilities({
        browserName,
        ...otherCapabilities
    });

    return builder.build();
}

function sleep(timeout = 1000) {
    return new Promise((resolve) => {
        setTimeout(function() {
            resolve();
        }, timeout);
    });
}

module.exports = {
    findElements,
    createDriver,
    sleep
}

