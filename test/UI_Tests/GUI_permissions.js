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

fixture('Permissions')
    .page('https://localhost');

test('go to permissions', async browser => {
    await login(browser);
    /* await browser.click('#permission');
     await browser.expect(getCurrentUrl()).eql('https://localhost/permissionsControl')
         .expect(Selector('#title').innerText).eql('הרשאות משתמשים')
         .expect(Selector('#user_selector').childNodeCount).gt(5)
         .click(Selector('button').with({'title': 'בחר משתמש'}))
         .click(Selector('span').withText('midaArabic@outlook.com'))
         .click(Selector('a').with({'href':"/Home"}));*/
    await browser.click('#editUsersTree');
    await browser.click('#loadDefaultTree');
    await browser.wait(500);
    await browser.pressKey('enter');
    await browser.wait(500);
    await browser.pressKey('enter');
    await browser.click('#saveTree');
    await browser.pressKey('enter');
    await browser.navigateTo('https://localhost/Home');
    await browser.wait(5000);
});
