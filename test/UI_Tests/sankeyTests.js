let Selector = require("testcafe").Selector;
let ClientFunction = require("testcafe").ClientFunction;


let getCurrentUrl = ClientFunction(() => window.location.href);
const elementWithClassNameAt = Selector((value, index) =>
{
    return document.getElementsByClassName(value)[index];
});

fixture('Sankey Tests').page('https://localhost/usersAndRoles/editTree/');
test('editing tree', async browser =>
{

    await browser
        .click('#login_button');
    await browser
        .typeText('[name="loginfmt"]', 'shahar0897@outlook.com')
        .pressKey('enter');
    await browser
        .typeText('[name="passwd"]', 'tomer8108')
        .pressKey('enter');
    await browser.expect(getCurrentUrl()).eql('https://localhost/Home', {timeout: 5000});

    await browser.click("#edit-tree-button");
    await browser.expect(getCurrentUrl()).eql('https://localhost/usersAndRoles/editTree/', {timeout: 5000});

    await browser.drag('#role-dragger', 200, 150)
        .typeText('[class="ajs-input"]', 'AA')
        .pressKey('enter');

    await browser.drag('#role-dragger', 400, 150)
        .typeText('[class="ajs-input"]', 'BB')
        .pressKey('enter');

    await browser.drag('#role-dragger', 600, 150)
        .typeText('[class="ajs-input"]', 'CC')
        .pressKey('enter');

    await browser.drag('#role-dragger', 600, 50)
        .typeText('[class="ajs-input"]', 'DD')
        .pressKey('enter');

    await browser.drag('#role-dragger', 600, 250)
        .typeText('[class="ajs-input"]', 'EE')
        .pressKey('enter');

    await browser.drag('#role-dragger', 800, 0)
        .typeText('[class="ajs-input"]', 'FF')
        .pressKey('enter');

    await browser.drag('#role-dragger', 800, 100)
        .typeText('[class="ajs-input"]', 'GG')
        .pressKey('enter');

    await browser.drag('#role-dragger', 800, 350)
        .typeText('[class="ajs-input"]', 'HH')
        .pressKey('enter');

    await browser.drag('#role-dragger', 1000, 450)
        .typeText('[class="ajs-input"]', 'II')
        .pressKey('enter');


    await browser.click('#center-button');

    await browser.hover(Selector('[class="sankey_shape_State"]').nth(0),{offsetX: 2, offsetY: 2})
        .drag(Selector('[class="draw2d_OutputPort"]').nth(0),160,0,{speed:0.5});

    await browser.hover(Selector('[class="sankey_shape_State"]').nth(1),{offsetX: 2, offsetY: 2})
        .drag(Selector('[class="draw2d_OutputPort"]').nth(1),160,0,{speed:0.5});

    await browser.hover(Selector('[class="sankey_shape_State"]').nth(1),{offsetX: 2, offsetY: 2})
        .drag(Selector('[class="draw2d_OutputPort"]').nth(1),160,-100,{speed:0.5});

    await browser.hover(Selector('[class="sankey_shape_State"]').nth(1),{offsetX: 2, offsetY: 2})
        .drag(Selector('[class="draw2d_OutputPort"]').nth(1),160,100,{speed:0.5});

    await browser.hover(Selector('[class="sankey_shape_State"]').nth(3),{offsetX: 2, offsetY: 2})
        .drag(Selector('[class="draw2d_OutputPort"]').nth(3),160,-50,{speed:0.5});

    await browser.hover(Selector('[class="sankey_shape_State"]').nth(3),{offsetX: 2, offsetY: 2})
        .drag(Selector('[class="draw2d_OutputPort"]').nth(3),160,50,{speed:0.5});

    await browser.hover(Selector('[class="sankey_shape_State"]').nth(4),{offsetX: 2, offsetY: 2})
        .drag(Selector('[class="draw2d_OutputPort"]').nth(4),160,100,{speed:0.5});

    await browser.hover(Selector('[class="sankey_shape_State"]').nth(7),{offsetX: 2, offsetY: 2})
        .drag(Selector('[class="draw2d_OutputPort"]').nth(7),160,100,{speed:0.5});

    await browser.rightClick(Selector('[class="sankey_shape_State"]').nth(0), {offsetX: 2, offsetY: 2})
        .click(Selector('[class="ion ion-settings"]').nth(0))
        .click(Selector('[class="ion ion-android-add-circle"]').nth(0))
        .typeText('[class="ajs-input"]', 'shahar0897@outlook.com')
        .pressKey('enter')
        .wait(500)
        .typeText('[class="ajs-input"]', 'שחר בן שטרית')
        .pressKey('enter')
        .wait(150)
        .click(Selector('#dereg-select'))
        .click(Selector('#dereg-select').find('option').withText("דרג יו\"ר"))
        .wait(500)
        .click(Selector('#no-id123'));

    await browser.rightClick(Selector('[class="sankey_shape_State"]').nth(1), {offsetX: 2, offsetY: 2})
        .click(Selector('[class="ion ion-settings"]').nth(0))
        .click(Selector('[class="ion ion-android-add-circle"]').nth(0))
        .typeText('[class="ajs-input"]', 'BB@outlook.com')
        .pressKey('enter')
        .wait(500)
        .typeText('[class="ajs-input"]', 'תפקיד בית')
        .pressKey('enter')
        .wait(150)
        .click(Selector('#dereg-select'))
        .click(Selector('#dereg-select').find('option').withText("דרג סיו\"ר"))
        .wait(500)
        .click(Selector('#no-id123'));

    await browser.rightClick(Selector('[class="sankey_shape_State"]').nth(2),{offsetX:2,offsetY:2})
        .click(Selector('[class="ion ion-settings"]').nth(0))
        .click(Selector('[class="ion ion-android-add-circle"]').nth(0))
        .typeText('[class="ajs-input"]', 'CC@outlook.com')
        .pressKey('enter')
        .wait(500)
        .typeText('[class="ajs-input"]', 'תפקיד גימל')
        .pressKey('enter')
        .wait(150)
        .click(Selector('#dereg-select'))
        .click(Selector('#dereg-select').find('option').withText("דרג רמ\"ד"))
        .wait(500)
        .click(Selector('#no-id123'));

    await browser.rightClick(Selector('[class="sankey_shape_State"]').nth(3),{offsetX:2,offsetY:2})
        .click(Selector('[class="ion ion-settings"]').nth(0))
        .click(Selector('[class="ion ion-android-add-circle"]').nth(0))
        .typeText('[class="ajs-input"]', 'DD@outlook.com')
        .pressKey('enter')
        .wait(500)
        .typeText('[class="ajs-input"]', 'תפקיד דלת')
        .pressKey('enter')
        .wait(150)
        .click(Selector('#dereg-select'))
        .click(Selector('#dereg-select').find('option').withText("דרג רמ\"ד"))
        .wait(500)
        .click(Selector('#no-id123'));

    await browser.rightClick(Selector('[class="sankey_shape_State"]').nth(4),{offsetX:2,offsetY:2})
        .click(Selector('[class="ion ion-settings"]').nth(0))
        .click(Selector('[class="ion ion-android-add-circle"]').nth(0))
        .typeText('[class="ajs-input"]', 'EE@outlook.com')
        .pressKey('enter')
        .wait(500)
        .typeText('[class="ajs-input"]', 'תפקיד היי')
        .pressKey('enter')
        .wait(150)
        .click(Selector('#dereg-select'))
        .click(Selector('#dereg-select').find('option').withText("דרג רמ\"ד"))
        .wait(500)
        .click(Selector('#no-id123'));

    await browser.rightClick(Selector('[class="sankey_shape_State"]').nth(5),{offsetX:2,offsetY:2})
        .click(Selector('[class="ion ion-settings"]').nth(0))
        .click(Selector('[class="ion ion-android-add-circle"]').nth(0))
        .typeText('[class="ajs-input"]', 'FF@outlook.com')
        .pressKey('enter')
        .wait(500)
        .typeText('[class="ajs-input"]', 'תפקיד וו')
        .pressKey('enter')
        .wait(150)
        .click(Selector('#dereg-select'))
        .click(Selector('#dereg-select').find('option').withText("דרג מנהל"))
        .wait(500)
        .click(Selector('#no-id123'));

    await browser.rightClick(Selector('[class="sankey_shape_State"]').nth(6),{offsetX:2,offsetY:2})
        .click(Selector('[class="ion ion-settings"]').nth(0))
        .click(Selector('[class="ion ion-android-add-circle"]').nth(0))
        .typeText('[class="ajs-input"]', 'GG@outlook.com')
        .pressKey('enter')
        .wait(500)
        .typeText('[class="ajs-input"]', 'תפקיד זין')
        .pressKey('enter')
        .wait(150)
        .click(Selector('#dereg-select'))
        .click(Selector('#dereg-select').find('option').withText("דרג מנהל"))
        .wait(500)
        .click(Selector('#no-id123'));

    await browser.rightClick(Selector('[class="sankey_shape_State"]').nth(7),{offsetX:2,offsetY:2})
        .click(Selector('[class="ion ion-settings"]').nth(0))
        .click(Selector('[class="ion ion-android-add-circle"]').nth(0))
        .typeText('[class="ajs-input"]', 'HH@outlook.com')
        .pressKey('enter')
        .wait(500)
        .typeText('[class="ajs-input"]', 'תפקיד חית')
        .pressKey('enter')
        .wait(150)
        .click(Selector('#dereg-select'))
        .click(Selector('#dereg-select').find('option').withText("דרג מנהל"))
        .wait(500)
        .click(Selector('#no-id123'));

    await browser.rightClick(Selector('[class="sankey_shape_State"]').nth(8),{offsetX:2,offsetY:2})
        .click(Selector('[class="ion ion-settings"]').nth(0))
        .click(Selector('[class="ion ion-android-add-circle"]').nth(0))
        .typeText('[class="ajs-input"]', 'II@outlook.com')
        .pressKey('enter')
        .wait(500)
        .typeText('[class="ajs-input"]', 'תפקיד טית')
        .pressKey('enter')
        .wait(150)
        .click(Selector('#dereg-select'))
        .click(Selector('#dereg-select').find('option').withText("דרג רכז"))
        .wait(500)
        .click(Selector('#no-id123'));

    await browser.click('#save-button').wait(300).pressKey('enter');
    await browser.expect(getCurrentUrl()).eql('https://localhost/Home/', {timeout: 5000});

    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > 3000) {
            break;
        }
    }
});