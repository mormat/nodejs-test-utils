const { By } = require('selenium-webdriver');

const { uris } = require('./resources');

const { 
    PageHelper,
    createDriver 
} = require('../src');

describe("page helper", () => {
 
    let driver;
    let helper;
 
    beforeAll(() => {
        driver = createDriver();
        helper = new PageHelper(driver);
    })
    
    
    test(`getText() without params`, async () => {
        await driver.get( uris['quick_brown_fox'] );
        
        const actualText = await helper.getText();
        
        expect( actualText ).toBe(
            "The Quick Brown Fox. by James Trainor " +
            "The quick brown fox jumps over the lazy dog. " +
            "He lands head first on a rotting maple log. " +
            "Knocked unconscious, fox sleeps with shallow breath. " +
            "until the lazy dog awakes and worries him to death"
        );
    });
    
    test.each([
        ['#line1'],
        ['//p[contains(@id, "line1")]'],
    ])(`getText({selector: '%s'})`, async (selector) => {
        await driver.get( uris['quick_brown_fox'] );
        
        const actualText = await helper.getText({ selector });
        
        expect( actualText ).toBe(
            "The quick brown fox jumps over the lazy dog."
        );
    });
    
    test(`getText({element: <WebElement id="header">})`, async () => {
        await driver.get( uris['quick_brown_fox'] );
        
        const rootElement = await driver.findElement(By.id("header"));
        
        const actualText = await helper.getText({ rootElement });
        
        expect( actualText ).toBe(
            "The Quick Brown Fox. by James Trainor"
        );
        
    });
    
    test(`getText({selector: "p", element: <WebElement id="header">})`, async () => {
        await driver.get( uris['quick_brown_fox'] );
        
        const selector = "p";
        const rootElement = await driver.findElement(By.id("header"));
        
        const actualText = await helper.getText({ selector, rootElement });
        
        expect( actualText ).toBe(
            "by James Trainor"
        );
        
    });
    
    afterAll(async () => {
        await driver.close();
    })
    
});

    
