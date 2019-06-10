let Selector = require("testcafe").Selector;
let ClientFunction = require("testcafe").ClientFunction;
let mongoose = require('mongoose');
let userAccessor = require('../../models/accessors/usersAccessor');
let UsersAndRolesTreeSankey = require('../../controllers/usersControllers/usersAndRolesController');
let sankeyContent = require('../inputs/trees/treeForGUIStartAndHandle/sankey');
let emailsToFullName = require('../inputs/trees/treeForGUIStartAndHandle/emailsToFullNames2');
let rolesToDereg = require('../inputs/trees/treeForGUIStartAndHandle/rolesToDeregs');
let rolesToEmails = require('../inputs/trees/treeForGUIStartAndHandle/rolesToEmails');
let processStructureSankeyJSON = require('../inputs/processStructures/processStructureForGuiStartAndHandle/processStructure');
let processStructureController = require('../../controllers/processesControllers/processStructureController');
let activeProcessController = require('../../controllers/processesControllers/activeProcessController');

let getCurrentUrl = ClientFunction(() => window.location.href);


let userName = 'levtom1@outlook.co.il';
let original = userName;
let passwd = 'tomer8108';
let userToChange = 'levtom@outlook.co.il';

let login = async function (browser) {
    await browser
        .click('#login_button');
    await browser
        .typeText('[name="loginfmt"]', userName)
        .pressKey('enter');
    await browser.wait(2000);
    await browser
        .typeText('[name="passwd"]', passwd)
        .pressKey('enter');
};

function addProcessStructure() {
    return new Promise(resolve => {
        processStructureController.addProcessStructure('levtom@outlook.co.il', 'תהליך אישור', JSON.stringify(processStructureSankeyJSON), [], 0, "" + 12 * 60 * 60, (err, needApproval) => {
            if (err) {
                resolve(err);
            } else {
                activeProcessController.startProcessByUsername('shahar0897@outlook.com', 'תהליך אישור', 'תהליך1', new Date(2022, 4, 26, 16), 1, (err, res) => {
                    if (err) resolve(err);
                    else
                        activeProcessController.startProcessByUsername('shahar0897@outlook.com', 'תהליך אישור', 'תהליך2', new Date(2022, 4, 26, 16), 1, (err, res) => {
                            if (err) resolve(err);
                            else
                                resolve();
                        });
                });

            }
        });
    });
}

function insertToDB() {
    return new Promise(resolve => {
        userAccessor.createSankeyTree({sankey: JSON.stringify({content: {diagram: []}})}, (err, result) => {
            if (err) {
                resolve(err);
            } else {
                UsersAndRolesTreeSankey.setUsersAndRolesTree('levtom@outlook.co.il', JSON.stringify(sankeyContent),
                    rolesToEmails, emailsToFullName,
                    rolesToDereg, (err) => {
                        if (err) {
                            resolve(err);
                        } else {
                            resolve();
                        }
                    });
            }
        });
    });
}

fixture('Permissions')
    .page('https://localhost')
    .beforeEach(async browser => {
        await browser.setNativeDialogHandler(() => true);
        await login(browser);

    })
    .before(async browser => {
        await mongoose.connect('mongodb://localhost:27017/Tests', {useNewUrlParser: true});
        mongoose.connection.db.dropDatabase();
        await insertToDB();
        await addProcessStructure();
    })
    .after(async browser => {
        mongoose.connection.close();
    });


test('check permission does not exists', async browser => {
    await browser.navigateTo('https://localhost/Home/');

    // see permissions
    await browser.expect(Selector('#permission').visible).notOk();

    await browser.navigateTo('https://localhost/Home/');

    // users tree
    await browser.click('#edit-tree-button');
    await browser.expect(getCurrentUrl()).eql('https://localhost/usersAndRoles/editTree/');
    await browser.wait(1000);
    await browser.click('#save-button');
    await browser.wait(1000);
    await browser.pressKey('enter');
    await browser.expect(getCurrentUrl()).notEql('https://localhost/Home');

    await browser.navigateTo('https://localhost/Home/');

    // structure tree
    await browser.click('#edit-process-structure');
    await browser.click('#edit-process-structure-button');
    await browser.expect(getCurrentUrl()).contains('https://localhost/processStructures/editProcessStructure/');
    await browser.wait(1000);
    await browser.click('#saveButton');
    await browser.wait(1000);
    await browser.pressKey('enter');
    await browser.expect(getCurrentUrl()).eql('https://localhost/Home');
    userName = userToChange;
});

test('type and check', async browser => {
    await browser.click('#permission');
    await browser.expect(getCurrentUrl()).eql('https://localhost/permissionsControl')
        .expect(Selector('#title').innerText).eql('הרשאות משתמשים')
        .expect(Selector('#user_selector').childNodeCount).gt(5)
        .click(Selector('button').with({'title': 'בחר משתמש'}))
        .typeText('[class="input-block-level form-control"]', 'נא')
        .click(Selector('span').withText('נארוטו אוזומקי - מנהל גרפיקה'));
    let checkbox1 = Selector('#all_checkbox').child(0);
    let checkbox2 = Selector('#all_checkbox').child(3);
    let checkbox3 = Selector('#all_checkbox').child(6);
    let checkbox4 = Selector('#all_checkbox').child(9);
    let submit = Selector('#all_checkbox').child(13);
    await browser
        .click(checkbox1)
        .expect(checkbox1.checked).ok()
        .click(checkbox2)
        .expect(checkbox2.checked).ok()
        .click(checkbox3)
        .expect(checkbox3.checked).ok()
        .click(checkbox4)
        .expect(checkbox4.checked).ok()
        .click(submit)
        .wait(1000)
        .pressKey('enter')
        .click(Selector('a[title="דף הבית"]'));
    userName = userToChange;
    await browser.expect(getCurrentUrl()).eql('https://localhost/Home');
});

test('check permissions observer', async browser => {
    await browser.click('#reports-button');
    await browser.expect(getCurrentUrl()).contains('https://localhost/activeProcesses/getAllProcessesReportsByUser');
    await browser.expect(Selector('tbody tr').count).eql(2);
});

test('check permissions worked', async browser => {
    await browser.click('#permission');
    await browser.expect(getCurrentUrl()).eql('https://localhost/permissionsControl');
    await browser.click(Selector('a[title="דף הבית"]'));
    await browser.expect(getCurrentUrl()).eql('https://localhost/Home');

});

test('check permissions users tree', async browser => {
    await browser.click('#edit-tree-button');
    await browser.expect(getCurrentUrl()).eql('https://localhost/usersAndRoles/editTree/');
    await browser.wait(1000);
    await browser.click('#save-button');
    await browser.wait(1000);
    await browser.pressKey('enter');
    await browser.expect(getCurrentUrl()).eql('https://localhost/Home');
});

test('check permissions structures tree', async browser => {
    await browser.click('#edit-process-structure');
    await browser.click('#edit-process-structure-button');
    await browser.expect(getCurrentUrl()).contains('https://localhost/processStructures/editProcessStructure/');
    await browser.wait(1000);
    await browser.click('#saveButton');
    await browser.wait(1000);
    await browser.pressKey('enter');
    await browser.expect(getCurrentUrl()).eql('https://localhost/Home');
});

