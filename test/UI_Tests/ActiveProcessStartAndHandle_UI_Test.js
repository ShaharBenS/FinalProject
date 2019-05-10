let ClientFunction = require("testcafe").ClientFunction;
let mongoose = require('mongoose');
let userAccessor = require('../../models/accessors/usersAccessor');
let UsersAndRolesTreeSankey = require('../../controllers/usersControllers/usersAndRolesController');
let sankeyContent = require('../inputs/trees/treeForGUIStartAndHandle/sankey');
let emailsToFullName = require('../inputs/trees/treeForGUIStartAndHandle/emailsToFullNames');
let rolesToDereg = require('../inputs/trees/treeForGUIStartAndHandle/rolesToDeregs');
let rolesToEmails = require('../inputs/trees/treeForGUIStartAndHandle/rolesToEmails');
let processStructureSankeyJSON = require('../inputs/processStructures/processStructureForGuiStartAndHandle/processStructure');


let beforeGlobal = function (done) {
    userAccessor.createSankeyTree({sankey: JSON.stringify({content: {diagram: []}})}, (err, result) => {
        if (err) {
            console.log('blah blah');
            done(err);
        }
        else {
            console.log('blah blah2');
            UsersAndRolesTreeSankey.setUsersAndRolesTree('yor@outlook.co.il', JSON.stringify(sankeyContent),
                rolesToEmails, emailsToFullName,
                rolesToDereg, (err) => {
                    if (err) {
                        done(err);
                    }
                    else {
                        processStructureController.addProcessStructure('yor@outlook.co.il', 'תהליך אישור', JSON.stringify(processStructureSankeyJSON), [], 0, "12", (err, needApproval) => {
                            if (err) {
                                done(err);
                            }
                            else {
                                done();
                            }
                        });
                    }
                });
        }
    });
};

let getCurrentUrl = ClientFunction(() => window.location.href);

fixture('Handle Process').page('https://localhost:3000/').before(beforeGlobal);

test('Start And Handle', async browser => {
    await browser.setNativeDialogHandler(() => true);
    await browser
        .click('#login_button');
    await browser
        .typeText('[name="loginfmt"]', 'levtom@outlook.co.il')
        .pressKey('enter');
    await browser
        .typeText('[name="passwd"]', 'tomer8108')
        .pressKey('enter');
    await browser
        .click('[name=startProcessView]');
    await browser
        .typeText('#start-processes-name', 'תהליך אישור')
        .typeText('#start-processes-date', '2020-11-03T05:00')
        .click('#start-process-button');
    await browser
        .wait(1000)
        .pressKey('enter');
    await browser
        .click('[name="myWaitingProcesses"]');
    await browser
        .click('[id="תהליך אישור"]');
    await browser
        .typeText('[name="comments"]', 'הערות של אחראי מיתוג קמפיינים')
        .click('#advanceProcess');
    /*const history = await browser.getNativeDialogHistory();
    await browser
        .expect(history.length).eql(1)
        .expect(history[0].type).eql('alert')
        .expect(history[0].text).eql('שם לא יכול להיות ריק');*/
    /*await browser
    await browser.expect(getCurrentUrl()).eql('https://localhost:3000/Home', {timeout: 5000});*/
});

test('Handle', async browser => {
    await browser.setNativeDialogHandler(() => true);
    await browser
        .click('#login_button');
    await browser
        .typeText('[name="loginfmt"]', 'kutigolberg@outlook.co.il')
        .pressKey('enter');
    await browser
        .typeText('[name="passwd"]', 'tomer8108')
        .pressKey('enter');
    await browser
        .click('[name="myWaitingProcesses"]');
    await browser
        .click('[id="תהליך אישור"]');
    await browser
        .typeText('[name="comments"]', 'הערות של רמד הסברה')
        .click('#advanceProcess');
    /*const history = await browser.getNativeDialogHistory();
    await browser
        .expect(history.length).eql(1)
        .expect(history[0].type).eql('alert')
        .expect(history[0].text).eql('שם לא יכול להיות ריק');*/
    /*await browser
    await browser.expect(getCurrentUrl()).eql('https://localhost:3000/Home', {timeout: 5000});*/
});

test('Handle', async browser => {
    await browser.setNativeDialogHandler(() => true);
    await browser
        .click('#login_button');
    await browser
        .typeText('[name="loginfmt"]', 'levtom@outlook.co.il')
        .pressKey('enter');
    await browser
        .typeText('[name="passwd"]', 'tomer8108')
        .pressKey('enter');
    await browser
        .click('[name="myWaitingProcesses"]');
    await browser
        .click('[id="תהליך אישור"]');
    await browser
        .typeText('[name="comments"]', 'הערות של אחראי מיתוג קמפיינים')
        .click('[name="3"]')
        .click('[name="4"]')
        .click('#advanceProcess');
    /*const history = await browser.getNativeDialogHistory();
    await browser
        .expect(history.length).eql(1)
        .expect(history[0].type).eql('alert')
        .expect(history[0].text).eql('שם לא יכול להיות ריק');*/
    /*await browser
    await browser.expect(getCurrentUrl()).eql('https://localhost:3000/Home', {timeout: 5000});*/
});

test('Handle', async browser => {
    await browser.setNativeDialogHandler(() => true);
    await browser
        .click('#login_button');
    await browser
        .typeText('[name="loginfmt"]', 'levtom2@outlook.co.il')
        .pressKey('enter');
    await browser
        .typeText('[name="passwd"]', 'tomer8108')
        .pressKey('enter');
    await browser
        .click('[name="myWaitingProcesses"]');
    await browser
        .click('[id="תהליך אישור"]');
    await browser
        .typeText('[name="comments"]', 'הערות של אחראי רכש')
        .click('#advanceProcess');
    /*const history = await browser.getNativeDialogHistory();
    await browser
        .expect(history.length).eql(1)
        .expect(history[0].type).eql('alert')
        .expect(history[0].text).eql('שם לא יכול להיות ריק');*/
    /*await browser
    await browser.expect(getCurrentUrl()).eql('https://localhost:3000/Home', {timeout: 5000});*/
});

test('Take Part In Process', async browser => {
    await browser.setNativeDialogHandler(() => true);
    await browser
        .click('#login_button');
    await browser
        .typeText('[name="loginfmt"]', 'shahar0897@outlook.com')
        .pressKey('enter');
    await browser
        .typeText('[name="passwd"]', 'tomer8108')
        .pressKey('enter');
    await browser
        .click('[name="myAvailableProcesses"]');
    await browser
        .click('[id="תהליך אישור"]');
    await browser
        .wait(1000)
        .pressKey('enter');
    /*const history = await browser.getNativeDialogHistory();
    await browser
        .expect(history.length).eql(1)
        .expect(history[0].type).eql('alert')
        .expect(history[0].text).eql('שם לא יכול להיות ריק');*/
    /*await browser
    await browser.expect(getCurrentUrl()).eql('https://localhost:3000/Home', {timeout: 5000});*/
});

test('Handle', async browser => {
    await browser.setNativeDialogHandler(() => true);
    await browser
        .click('#login_button');
    await browser
        .typeText('[name="loginfmt"]', 'shahar0897@outlook.com')
        .pressKey('enter');
    await browser
        .typeText('[name="passwd"]', 'tomer8108')
        .pressKey('enter');
    await browser
        .click('[name="myWaitingProcesses"]');
    await browser
        .click('[id="תהליך אישור"]');
    await browser
        .typeText('[name="comments"]', 'הערות של גרפיקאי')
        .click('#advanceProcess');
    /*const history = await browser.getNativeDialogHistory();
    await browser
        .expect(history.length).eql(1)
        .expect(history[0].type).eql('alert')
        .expect(history[0].text).eql('שם לא יכול להיות ריק');*/
    /*await browser
    await browser.expect(getCurrentUrl()).eql('https://localhost:3000/Home', {timeout: 5000});*/
});