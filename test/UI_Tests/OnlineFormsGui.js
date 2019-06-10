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
let onlineFormsController = require('../../controllers/onlineFormsControllers/onlineFormController');
let filledOnlineFormsController = require('../../controllers/onlineFormsControllers/filledOnlineFormController');

let getCurrentUrl = ClientFunction(() => window.location.href);


let userName = 'levtom@outlook.co.il';
let original = userName;
let passwd = 'tomer8108';
let formName = 'טופס החתמה על ציוד';
let processName = 'תהליך 1';

let login = async function (browser) {
    await browser
        .click('#login_button');
    await browser
        .typeText('[name="loginfmt"]', userName)
        .pressKey('enter');
    await browser
        .typeText('[name="passwd"]', passwd)
        .pressKey('enter');
};

function addProcessStructure() {
    return new Promise(resolve => {
        onlineFormsController.createAllOnlineForms(() => {
            onlineFormsController.getOnlineFormByName(formName, (err, form) => {
                if (err) resolve(err);
                else
                    processStructureController.addProcessStructure(userName, 'תהליך אישור', JSON.stringify(processStructureSankeyJSON), [form.formID], 0, "" + 12 * 60 * 60, (err, needApproval) => {
                        if (err)
                            resolve(err);
                        else
                            activeProcessController.startProcessByUsername(userName, 'תהליך אישור', processName, new Date(2022, 4, 26, 16), 1, (err, res) => {
                                if (err) resolve(err);
                                else
                                    resolve();
                            });
                    });
            });
        });
    });
}

function insertToDB() {
    return new Promise(resolve => {
        userAccessor.createSankeyTree({sankey: JSON.stringify({content: {diagram: []}})}, (err, result) => {
            if (err) {
                resolve(err);
            } else {
                UsersAndRolesTreeSankey.setUsersAndRolesTree(userName, JSON.stringify(sankeyContent),
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

fixture('OnlineForms')
    .page('https://localhost')
    .beforeEach(async browser => {
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


test('enter form page', async browser => {
    //enter form page
    await browser.click('[name="myWaitingProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getWaitingActiveProcessesByUser');
    await browser.click('[id="' + processName + '"]');
    await browser.expect(getCurrentUrl()).contains('https://localhost/activeProcesses/handleProcessView/?process_name=');
    await browser.click('[class="btn-form"]');
    await browser.expect(getCurrentUrl()).contains('https://localhost/onlineForms/fill?formName=');

    // fill form
    await browser.wait(1000);
    await browser.typeText(Selector('#full_name_1'), 'ישראל ישראלי')
        .typeText(Selector('#id_1'), '13245678')
        .typeText(Selector('#company'), 'החברה שלי')
        .typeText(Selector('#role'), 'התפקיד שלי');

    // sign form
    await browser.click(Selector('#signature_1_sign')).wait(1000).pressKey('enter');
    await browser.expect(Selector('#signature_1_sign').hasAttribute('disabled')).ok();


});
