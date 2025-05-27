const { By } = require('selenium-webdriver');

const { uris } = require('./resources');

const { createDriver } = require('../src');

const ElementsHelper = require('../src/helpers/ElementsHelper');

describe("ElementsHelper", () => {
   
    let driver;
    let helper;
 
    beforeAll(() => {
        driver = createDriver();
        helper = new ElementsHelper(driver);
    })
   
   test(".get(#no_matching_element) to return null", async () => {
        
       await driver.get( uris['quick_brown_fox'] ); 
       
       const actual = await helper.get('#no_matching_element');
       
       expect(actual).toBe(undefined);
       
    });
   
    test.each([
       ['p'],
       ["//p"],
    ])('.get(%s) should return <WebElement id="author"/>', async (selector) => {    
       await driver.get( uris['quick_brown_fox'] );
       
       const actual = await helper.get(selector);
       const expected = await driver.findElement(By.id("author"));
       
       expect(await actual.getText()).toEqual(await expected.getText());
    });
    
    test('.get(p, {element: <WebElement id="lines"/>}) should return <WebElement id="line1"/>', async () => {
        await driver.get( uris['quick_brown_fox'] );
       
        const rootElement = await driver.findElement(By.id("lines")); 
        const actual = await helper.get('p', { rootElement });
        const expected = await driver.findElement(By.id("line1"));
        
        expect(await actual.getText()).toEqual(await expected.getText());
    })
    
    test(".select(#no_matching_element) should return []", async () => {
        
       await driver.get( uris['quick_brown_fox'] ); 
       
       const actual = await helper.select('#no_matching_element');
       
       expect(actual).toStrictEqual([]);
       
    });
    
    test.each([
        'p',
        '//p',
    ])(".select(%s) should return corresponding elements", async (selector) => {
        
        await driver.get( uris['quick_brown_fox'] ); 
       
        const actual = await helper.select( selector );
        const expected = [
            await driver.findElement(By.id('author')),
            await driver.findElement(By.id('line1')),
            await driver.findElement(By.id('line2')),
            await driver.findElement(By.id('line3')),
            await driver.findElement(By.id('line4')),
        ]
        
        expect(actual).toHaveLength(expected.length);
        expect(await actual[0].getText()).toBe(await expected[0].getText());
        expect(await actual[1].getText()).toBe(await expected[1].getText());
        expect(await actual[2].getText()).toBe(await expected[2].getText());
        expect(await actual[3].getText()).toBe(await expected[3].getText());
        expect(await actual[4].getText()).toBe(await expected[4].getText());
        
    });
    
    test('.select(p, {element: <WebElement id="header"/>}) should return [<WebElement id="author"] />', async () => {
        await driver.get( uris['quick_brown_fox'] );
       
        const rootElement = await driver.findElement(By.id("header")); 
        const actual = await helper.select('p', { rootElement });
        const expected = await driver.findElement(By.id("author"));
        
        expect(actual).toHaveLength(1);
        expect(await actual[0].getText()).toEqual(await expected.getText());
    })
    
    test.each([
        ["#no_matching_element", false],
        ['#new_text', true],
        ['#always_displayed', true],
    ])("waitFor('%s') should return %s", async (selector, expected) => {
        await driver.get( uris['waits'] );

        const actual = await helper.waitFor(selector);
        expect(actual).toBe(expected);
    });
    
    test.each([
        ['#new_text', {timeout: 200}, false],
        ["#no_matching_element", {removed: true}, true],
        ['#temporary_text', { removed: true }, true],
        ['#temporary_text', { removed: true, timeout: 200 }, false]
    ])("waitFor('%s', %s) should return %s", async (selector, options, expected) => {
        await driver.get( uris['waits'] );

        const actual = await helper.waitFor(selector, options);
        expect(actual).toBe(expected);
    });
    
    test('waitFor(#new_text, {element: <WebElement id="void}/> shoudl return false"', async() => {
        await driver.get( uris['waits'] );
        
        const rootElement = await driver.findElement(By.id("void"));
        const actual = await helper.waitFor('#new_text', { rootElement });
        expect(actual).toBe(false);
    })
    
    test.each([
        ['a.clickable', 'clicked on "some link"'],
        //['a.clickable', 'clicked on "some link"'],
    ])(".clickOn(%s) should render comments ''", async (selector, expectedComments) => {
        await driver.get( uris['clickables'] );
        
        await helper.clickOn(selector);
        const comments = await driver.findElement(By.id("comments"));
        
        expect( await comments.getText() ).toBe( expectedComments );
    })
    
    test(".clickOn(a.clickable, {element: <WebElement id='section'/>}) shoud render 'clicked on some link in section'", async () => {
        await driver.get( uris['clickables'] );
        
        const rootElement = await driver.findElement(By.id("section"));
        await helper.clickOn('a.clickable', { rootElement });
        const comments = await driver.findElement(By.id("comments"));
        
        expect( await comments.getText() ).toBe( `clicked on "some link in section"` );
    });
    
    test("should be avalaible in src/index.js", () => {
        const { 
            ElementsHelperWithThrowingError
        } = require('../src');
        
        expect( ElementsHelperWithThrowingError.prototype ).toBeInstanceOf( ElementsHelper );
        expect( ElementsHelperWithThrowingError ).not.toBe( ElementsHelper );
        
    });
    
    afterAll(async () => {
        await driver.close();
    })
    
});

