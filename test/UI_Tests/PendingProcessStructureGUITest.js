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
let usersPermissionsController = require('../../controllers/usersControllers/UsersPermissionsController');
let UserPermissions = require('../../domainObjects/UserPermissions');

import {
    Selector
} from 'testcafe';

function addUsersAndRolesTree() {
    return new Promise(resolve => {
        userAccessor.createSankeyTree({
            sankey: JSON.stringify({
                content: {
                    diagram: []
                }
            })
        }, (err, result) => {
            if (err) {
                resolve(err);
            } else {
                UsersAndRolesTreeSankey.setUsersAndRolesTree('yor@outlook.co.il', JSON.stringify(sankeyContent),
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

function setUserPermissions() {
    return new Promise(resolve => {
        usersPermissionsController.setUserPermissions('yor@outlook.co.il', new UserPermissions("kutigolberg@outlook.co.il", [true, true, true, true]), (err) => {
            if (err) resolve(err);
            else {
                resolve();
            }
        });
    });
}


let beforeGlobal = async function () {
    mongoose.set('useCreateIndex', true);
    await mongoose.connect('mongodb://localhost:27017/Tests', {
        useNewUrlParser: true
    });
    mongoose.connection.db.dropDatabase();
    await addUsersAndRolesTree();
    await addProcessStructure();
    await setUserPermissions();
};

async function login(browser, userEmail, password) {
    await browser.setNativeDialogHandler(() => true);
    await browser
        .click('#login_button');
    await browser
        .typeText('[name="loginfmt"]', userEmail)
        .pressKey('enter');
    if (password === undefined) {
        await browser
            .typeText('[name="passwd"]', 'tomer8108')
            .pressKey('enter');
    } else {
        await browser
            .typeText('[name="passwd"]', password)
            .pressKey('enter');
    }
}

let getCurrentUrl = ClientFunction(() => window.location.href);

fixture('Pending Process Structures').page('https://localhost');

test('Stage 1 - Check There Is A Pending Process Structure', async browser => {
    await login(browser, 'kutigolberg@outlook.co.il');
    await browser.click('#pendingProcessStructures');
    await browser.expect(getCurrentUrl()).eql('https://localhost/processStructures/waitingForApproval/', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('מבני תהליכים הממתינים לאישור')
        .expect(Selector('tbody tr').nth(0).child(0).innerText).eql('תהליך אישור')
        .expect(Selector('tbody tr').nth(0).child(1).innerText).eql('קיילור נבאס - אחראי מיתוג קמפיינים')
        .expect(Selector('tbody tr').nth(0).child(2).innerText).eql('הוספה')
        .click(Selector('tbody tr').nth(0).child(5));
}).before(beforeGlobal);

test('Stage 2 - Check There Is No Pending Process Structure', async browser => {
    await login(browser, 'kutigolberg@outlook.co.il');
    await browser.click('#pendingProcessStructures');
    await browser.expect(getCurrentUrl()).eql('https://localhost/processStructures/waitingForApproval/', {
        timeout: 10000
    })
    .expect(Selector('tbody tr').nth(0).innerText).eql('אין כרגע מידע בטבלה');
});

test('Stage 3 - Check That The Process Structure Is Available Now.', async browser => {
    await login(browser, 'kutigolberg@outlook.co.il');
    await browser.click('[name="startProcessView"]')
        .expect(Selector('#start-processes-selector option').innerText).eql('תהליך אישור');
});