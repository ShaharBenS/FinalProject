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
let onlineFormsController = require('../../controllers/onlineFormsControllers/onlineFormController');

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

function addAllForms() {
    return new Promise(resolve => {
        onlineFormsController.createAllOnlineForms(() => resolve())
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

fixture('Available Processes')
    .page('https://localhost')
    .beforeEach(async browser => {
        mongoose.set('useCreateIndex', true);
        await mongoose.connect('mongodb://localhost:27017/Tests', {useNewUrlParser: true});
        mongoose.connection.db.dropDatabase();
        await insertToDB();
        await addProcessStructure();
        // await addAllForms();
        await browser.setNativeDialogHandler(() => true);
        await login(browser);

    });

test('check checkboxes', async browser => {

});
