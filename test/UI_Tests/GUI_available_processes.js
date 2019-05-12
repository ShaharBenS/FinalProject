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

let login2 = async function (browser) {
    await browser
        .click('#login_button');
    await browser
        .typeText('[name="loginfmt"]', 'kutigolberg@outlook.co.il')
        .pressKey('enter');
    await browser.click('#i1051');
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

async function createAndAdvanceProcess(browser, addedName) {
    await browser
        .click('[name=startProcessView]');
    await browser
        .typeText('#start-processes-name', 'תהליך אישור' + addedName)
        .typeText('#start-processes-date', '2020-11-03T05:00')
        .click('#start-process-button');
    await browser
        .wait(1000)
        .pressKey('enter');
    await browser
        .click('[name="myWaitingProcesses"]');
    await browser
        .click('[id="תהליך אישור' + addedName + '"]');
    await browser
        .typeText('[name="comments"]', 'הערות של אחראי מיתוג קמפיינים')
        .click('#advanceProcess');
}

fixture('Available Processes')
    .page('https://localhost')
    .beforeEach(async browser => {
        mongoose.set('useCreateIndex', true);
        await mongoose.connect('mongodb://localhost:27017/Tests', {useNewUrlParser: true});
        mongoose.connection.db.dropDatabase();
        await insertToDB();
        await addProcessStructure();
        await browser.setNativeDialogHandler(() => true);
        await login(browser);
        await createAndAdvanceProcess(browser, ' 1');
        await createAndAdvanceProcess(browser, ' 2');
    });

test('check that there is an available process', async browser => {
    await browser
        .click('[name=myAvailableProcesses]')
        .expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getAvailableActiveProcessesByUser')
        .expect(Selector('h1').innerText).eql('התהליכים הזמינים לי');

    await browser.click('[href="/auth/logout"]');
    await login2(browser);
    await browser
        .click('[name=myAvailableProcesses]')
        .expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getAvailableActiveProcessesByUser');
    await browser
        .expect(Selector('tr').count).eql(3)
        .click('[id="תהליך אישור 1"]')
        .expect(Selector('tr').count).eql(2)
        .click('[id="תהליך אישור 2"]')
        .expect(Selector('td').innerText).eql('אין כרגע מידע בטבלה');
});
