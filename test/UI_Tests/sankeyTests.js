let Selector = require("testcafe").Selector;
let ClientFunction = require("testcafe").ClientFunction;


let getCurrentUrl = ClientFunction(() => window.location.href);
const elementWithClassNameAt = Selector((value, index) =>
{
    return document.getElementsByClassName(value)[index];
});

fixture('Sankey Tests').page('https://localhost/');
test('Testing Sankey', async browser =>
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

    await browser.hover(Selector('[class="sankey_shape_State"]').nth(0),{offsetX: 2, offsetY: 2})
        .drag(Selector('[class="draw2d_OutputPort"]').nth(0),160,0);

    await browser.hover(Selector('[class="sankey_shape_State"]').nth(0),{offsetX: 2, offsetY: 2})
        .drag(Selector('[class="draw2d_OutputPort"]').nth(0),160,0);

    await browser.click('#save-button').wait(800).pressKey('enter');
    await browser.expect(getCurrentUrl()).eql('https://localhost/usersAndRoles/editTree/', {timeout: 5000});
    await browser.click('#center-button');

    await browser.click(Selector('.sankey_shape_Connection').nth(1),{offsetX: 2, offsetY: 2})
        .pressKey('delete');
    await browser.click('#center-button');

    await browser.hover(Selector('[class="sankey_shape_State"]').nth(1),{offsetX: 2, offsetY: 2})
        .drag(Selector('[class="draw2d_OutputPort"]').nth(1),160,0);

    await browser.hover(Selector('[class="sankey_shape_State"]').nth(1),{offsetX: 2, offsetY: 2})
        .drag(Selector('[class="draw2d_OutputPort"]').nth(1),160,-100);

    await browser.hover(Selector('[class="sankey_shape_State"]').nth(1),{offsetX: 2, offsetY: 2})
        .drag(Selector('[class="draw2d_OutputPort"]').nth(1),160,100);

    await browser.hover(Selector('[class="sankey_shape_State"]').nth(3),{offsetX: 2, offsetY: 2})
        .drag(Selector('[class="draw2d_OutputPort"]').nth(3),160,-50);

    await browser.hover(Selector('[class="sankey_shape_State"]').nth(3),{offsetX: 2, offsetY: 2})
        .drag(Selector('[class="draw2d_OutputPort"]').nth(3),160,50);

    await browser.hover(Selector('[class="sankey_shape_State"]').nth(4),{offsetX: 2, offsetY: 2})
        .drag(Selector('[class="draw2d_OutputPort"]').nth(4),160,100);

    await browser.hover(Selector('[class="sankey_shape_State"]').nth(7),{offsetX: 2, offsetY: 2})
        .drag(Selector('[class="draw2d_OutputPort"]').nth(7),160,100);

    await browser.drag('#role-dragger', 200, 50)
        .typeText('[class="ajs-input"]', 'DELETETHIS')
        .pressKey('enter');

    await browser.click('#save-button').wait(800).pressKey('enter');
    await browser.expect(getCurrentUrl()).eql('https://localhost/usersAndRoles/editTree/', {timeout: 5000});

    await browser.click(Selector('[class="sankey_shape_State"]').nth(-1), {offsetX: 2, offsetY: 2})
        .pressKey('delete');

    await browser.click('#save-button').wait(800).pressKey('enter');
    await browser.expect(getCurrentUrl()).eql('https://localhost/Home', {timeout: 5000});
    await browser.click("#edit-tree-button");
    await browser.expect(getCurrentUrl()).eql('https://localhost/usersAndRoles/editTree/', {timeout: 5000});

    await browser.expect(Selector('[class="sankey_shape_State"]').count).eql(9);
    await browser.rightClick(Selector('[class="sankey_shape_State"]').nth(0), {offsetX: 2, offsetY: 2})
        .click(Selector('[class="ion ion-settings"]').nth(0))
        .expect(Selector('.email').nth(0).value).eql("shahar0897@outlook.com")
        .expect(Selector('.name').nth(0).value).eql("שחר בן שטרית");
    await browser.expect(Selector("#dereg-select").selectedIndex).eql(4);
    await browser.navigateTo('https://localhost/Home/');
    await browser.click("#add-process-structure")
        .typeText("#new-process-structure-name","Test Structure")
        .click("#new-process-structure-button")
        .expect(getCurrentUrl()).eql('https://localhost/processStructures/addProcessStructure/?name=Test%20Structure', {timeout: 5000});

    await browser.wait(1500);
    await browser.drag('#add-by-role', 200, 50)
        .click("#role_selector")
        .click(Selector('#role_selector').find('option').withText("II"))
        .click('#select_role_okay_button');

    await browser.drag('#add-by-role', 350, 50)
        .click("#role_selector")
        .click(Selector('#role_selector').find('option').withText("HH"))
        .click('#select_role_okay_button');

    await browser.drag('#add-by-dereg', 500, -57)
        .click("#dereg-select")
        .click(Selector('#dereg-select').find('option').withText("דרג רמ\"ד"))
        .click('#no-id1234');

    await browser.drag('#add-by-role', 650, 50)
        .click("#role_selector")
        .click(Selector('#role_selector').find('option').withText("FF"))
        .click('#select_role_okay_button');

    await browser.drag('#add-creator', 200, 50);

    await browser.drag('#add-by-role', 400, 200)
        .click("#role_selector")
        .click(Selector('#role_selector').find('option').withText("DD"))
        .click('#select_role_okay_button');

    await browser.drag('#add-by-role', 400, 350)
        .click("#role_selector")
        .click(Selector('#role_selector').find('option').withText("CC"))
        .click('#select_role_okay_button');

    await browser.drag('#add-by-dereg', 600, 150)
        .click("#dereg-select")
        .click(Selector('#dereg-select').find('option').withText("דרג סיו\"ר"))
        .click('#no-id1234');

    await browser.drag('#add-by-dereg', 800, 150)
        .click("#dereg-select")
        .click(Selector('#dereg-select').find('option').withText("דרג יו\"ר"))
        .click('#no-id1234');

    await browser.click('#center-button');

    await browser.hover(Selector('[class="sankey_shape_State"]').nth(0),{offsetX: 2, offsetY: 2})
        .drag(Selector('[class="draw2d_OutputPort"]').nth(0),110,0);

    await browser.hover(Selector('[class="sankey_shape_State"]').nth(1),{offsetX: 2, offsetY: 2})
        .drag(Selector('[class="draw2d_OutputPort"]').nth(1),110,0);

    await browser.hover(Selector('[class="sankey_shape_State"]').nth(2),{offsetX: 2, offsetY: 2})
        .drag(Selector('[class="draw2d_OutputPort"]').nth(2),80,0);

    await browser.hover(Selector('[class="sankey_shape_State"]').nth(3),{offsetX: 2, offsetY: 2})
        .drag(Selector('[class="draw2d_OutputPort"]').nth(3),-500,210,{speed:0.7});

    await browser.hover(Selector('[class="sankey_shape_State"]').nth(4),{offsetX: 2, offsetY: 2})
        .drag(Selector('[class="draw2d_OutputPort"]').nth(4),110,-50);

    await browser.hover(Selector('[class="sankey_shape_State"]').nth(4),{offsetX: 2, offsetY: 2})
        .drag(Selector('[class="draw2d_OutputPort"]').nth(4),105,90);

    await browser.hover(Selector('[class="sankey_shape_State"]').nth(5),{offsetX: 2, offsetY: 2})
        .drag(Selector('[class="draw2d_OutputPort"]').nth(5),150,50);

    await browser.hover(Selector('[class="sankey_shape_State"]').nth(6),{offsetX: 2, offsetY: 2})
        .drag(Selector('[class="draw2d_OutputPort"]').nth(6),150,-90);

    await browser.hover(Selector('[class="sankey_shape_State"]').nth(7),{offsetX: 2, offsetY: 2})
        .drag(Selector('[class="draw2d_OutputPort"]').nth(7),130,0);

    await browser.click('#define-times-button')
        .click('#automaticTimeSelect')
        .click(Selector('#automaticTimeSelect').find('option').withText("48 שעות"))
        .click('#notificationTimeSelect')
        .click(Selector('#notificationTimeSelect').find('option').withText("36 שעות"))
        .click('#define-times-confirm');

    await browser.click('#forms-button')
        .click(Selector('.plus-button').nth(0))
        .click('#selectForm')
        .click(Selector('#selectForm').find('option').withText("טופס קניות"))
        .click(Selector('.plus-button').nth(0))
        .click('#no-id124');

    await browser.click('#saveButton').wait(500).pressKey('enter');
    await browser.expect(getCurrentUrl()).eql('https://localhost/Home', {timeout: 5000});
    await browser.click('#edit-process-structure')
        .click('#processes_selector')
        .click(Selector('#processes_selector').find('option').withText("Test Structure"))
        .click('#edit-process-structure-button');
    await browser.expect(getCurrentUrl()).eql('https://localhost/processStructures/editProcessStructure/?name=Test%20Structure', {timeout: 5000});

    await browser.expect(Selector('[class="sankey_shape_State"]').count).eql(9);
    await browser.expect(Selector('[class="sankey_shape_Connection"]').count).eql(18);

    await browser.click('#define-times-button')
        .expect(Selector('#automaticTimeSelect').selectedIndex).eql(2)
        .expect(Selector('#notificationTimeSelect').selectedIndex).eql(2);

    await browser.click('#automaticTimeSelect')
        .click(Selector('#automaticTimeSelect').find('option').withText("72 שעות"))
        .click('#define-times-confirm');

    await browser.click('#saveButton').wait(500).pressKey('enter');
    await browser.expect(getCurrentUrl()).eql('https://localhost/Home', {timeout: 5000});
    await browser.wait(1000);
});