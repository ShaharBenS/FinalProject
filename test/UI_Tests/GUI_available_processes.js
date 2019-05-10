let Selector = require("testcafe").Selector;
let ClientFunction = require("testcafe").ClientFunction;

let getCurrentUrl = ClientFunction(() => window.location.href);

let login = async function (browser) {
    await browser
        .click('#login_button');
    await browser
        .typeText('[name="loginfmt"]', 'omriat@outlook.com')
        .pressKey('enter');
    await browser
        .typeText('[name="passwd"]', 'kiprin206677')
        .pressKey('enter');
    await browser.expect(getCurrentUrl()).eql('https://localhost/Home');
};

fixture('Available Processes')
    .page('https://localhost');

test('go to available', async browser => {
    await login(browser);
    await browser.click('#availableProcesses');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getAvailableActiveProcessesByUser');
});
