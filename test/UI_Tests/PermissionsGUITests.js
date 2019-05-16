let Selector = require("testcafe").Selector;
let ClientFunction = require("testcafe").ClientFunction;
let mongoose = require('mongoose');
let userAccessor = require('../../models/accessors/usersAccessor');
let UsersAndRolesTreeSankey = require('../../controllers/usersControllers/usersAndRolesController');
let sankeyContent = require('../inputs/trees/treeForGUIStartAndHandle/sankey');
let emailsToFullName = require('../inputs/trees/treeForGUIStartAndHandle/emailsToFullNames');
let rolesToDereg = require('../inputs/trees/treeForGUIStartAndHandle/rolesToDeregs');
let rolesToEmails = require('../inputs/trees/treeForGUIStartAndHandle/rolesToEmails');
let processStructureSankeyJSON = require('../inputs/processStructures/processStructureForGuiStartAndHandle/processStructure');
let processStructureController = require('../../controllers/processesControllers/processStructureController');

let getCurrentUrl = ClientFunction(() => window.location.href);

let login = async function (browser) {
    await browser
        .click('#login_button');
    await browser
        .typeText('[name="loginfmt"]', 'levtom@outlook.co.il')
        .pressKey('enter');
    await browser
        .typeText('[name="passwd"]', 'tomer8108')
        .pressKey('enter');
};

function addProcessStructure() {
    return new Promise(resolve => {
        processStructureController.addProcessStructure('levtom@outlook.co.il', 'תהליך אישור', JSON.stringify(processStructureSankeyJSON), [], 0, "12", (err, needApproval) => {
            if (err) {
                resolve(err);
            } else {
                resolve();
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
        mongoose.set('useCreateIndex', true);
        await mongoose.connect('mongodb://localhost:27017/Tests', {useNewUrlParser: true});
        mongoose.connection.db.dropDatabase();
        await insertToDB();
        await addProcessStructure();
        await browser.setNativeDialogHandler(() => true);
        await login(browser);

    });

test('check checkboxes', async browser => {
    await browser.click('#permission');
    await browser.expect(getCurrentUrl()).eql('https://localhost/permissionsControl')
        .expect(Selector('#title').innerText).eql('הרשאות משתמשים')
        .expect(Selector('#user_selector').childNodeCount).gt(5)
        .click(Selector('button').with({'title': 'בחר משתמש'}))
        .click(Selector('span').withText('levtom1@outlook.co.il'));
    let checkbox1 = Selector('#all_checkbox').child(0);
    let checkbox2 = Selector('#all_checkbox').child(3);
    let checkbox3 = Selector('#all_checkbox').child(6);
    let checkbox4 = Selector('#all_checkbox').child(9);
    let submit = Selector('#all_checkbox').child(13);
    await browser
        .expect(checkbox1.checked).notOk()
        .click(checkbox1)
        .expect(checkbox1.checked).ok()
        .expect(checkbox2.checked).notOk()
        .click(checkbox2)
        .expect(checkbox2.checked).ok()
        .expect(checkbox3.checked).notOk()
        .click(checkbox3)
        .expect(checkbox3.checked).ok()
        .expect(checkbox4.checked).notOk()
        .click(checkbox4)
        .expect(checkbox4.checked).ok()
        .click(submit)
        .click(Selector('a[title="דף הבית"]'));
    await browser.expect(getCurrentUrl()).eql('https://localhost/Home');
});

test('type and check', async browser => {
    await browser.click('#permission');
    await browser.expect(getCurrentUrl()).eql('https://localhost/permissionsControl')
        .expect(Selector('#title').innerText).eql('הרשאות משתמשים')
        .expect(Selector('#user_selector').childNodeCount).gt(5)
        .click(Selector('button').with({'title': 'בחר משתמש'}))
        .typeText('[class="input-block-level form-control"]', 'y')
        .click(Selector('span').withText('sayor@outlook.co.il'));
    let checkbox1 = Selector('#all_checkbox').child(0);
    let checkbox4 = Selector('#all_checkbox').child(9);
    let submit = Selector('#all_checkbox').child(13);
    await browser
        .expect(checkbox1.checked).notOk()
        .click(checkbox1)
        .expect(checkbox1.checked).ok()
        .expect(checkbox4.checked).notOk()
        .click(checkbox4)
        .expect(checkbox4.checked).ok()
        .click(submit)
        .click(Selector('a[title="דף הבית"]'));
    await browser.expect(getCurrentUrl()).eql('https://localhost/Home');
});
