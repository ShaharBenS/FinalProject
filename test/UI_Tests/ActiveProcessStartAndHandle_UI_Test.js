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
import {Selector} from 'testcafe';

function addProcessStructure() {
    return new Promise(resolve => {
        processStructureController.addProcessStructure('yor@outlook.co.il', 'תהליך אישור', JSON.stringify(processStructureSankeyJSON), [], 0, "12", (err, needApproval) => {
            if (err) {
                resolve(err);
            }
            else {
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
            }
            else {
                UsersAndRolesTreeSankey.setUsersAndRolesTree('yor@outlook.co.il', JSON.stringify(sankeyContent),
                    rolesToEmails, emailsToFullName,
                    rolesToDereg, (err) => {
                        if (err) {
                            resolve(err);
                        }
                        else {
                            resolve();
                        }
                    });
            }
        });
    });
}

let beforeGlobal = async function () {
    mongoose.set('useCreateIndex', true);
    await mongoose.connect('mongodb://localhost:27017/Tests', {useNewUrlParser: true});
    mongoose.connection.db.dropDatabase();
    await insertToDB();
    await addProcessStructure();
};

async function login(browser, userEmail, password) {
    await browser
        .click('#login_button');
    await browser
        .typeText('[name="loginfmt"]', userEmail)
        .pressKey('enter');
    if(password === undefined)
    {
        await browser
            .typeText('[name="passwd"]', 'tomer8108')
            .pressKey('enter');
    }
    else
    {
        await browser
            .typeText('[name="passwd"]', password)
            .pressKey('enter');
    }
}

async function startProcess(browser, activeProcessName, date, urgency, processStructureName) {
    const urgencySelect = Selector('#start-processes-urgency');
    let urgencyOption = urgencySelect.find('option').withText(urgency);
    let processStructureSelect = Selector('#start-processes-selector');
    let processStructureOption = processStructureSelect.find('option').withText(processStructureName);
    await browser
        .typeText('#start-processes-name', 'תהליך אישור', { caretPos: 0, replace: true})
        .typeText('#start-processes-date', '2020-11-03T05:00')
        .click('#start-processes-urgency')
        .click(urgencyOption)
        .click('#start-processes-selector')
        .click(processStructureOption)
        .click('#start-process-button');
}

async function handleProcess(browser, processName, comments, options, allOptions)
{
    await browser
        .click('[id="' + processName + '"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/handleProcessView/?process_name=%D7%AA%D7%94%D7%9C%D7%99%D7%9A%20%D7%90%D7%99%D7%A9%D7%95%D7%A8', {timeout: 5000});

    await browser
        .typeText('[name="comments"]', comments);
    /*for(let stageNum in allOptions)
    {
        if(allOptions.hasOwnProperty(stageNum))
        {
            await browser.expect(Selector('[name="'+ stageNum+'"]').textContent).eql(allOptions[stageNum]);
        }
    }*/
    for(let i=0;i<options.length;i++)
    {
        await browser
            .click('[name="' + options[i] + '"]');
    }
    await browser
        .click('#advanceProcess');
    await browser.expect(getCurrentUrl()).eql('https://localhost/Home', {timeout: 5000});
}

async function takePartInProcess(browser, processName)
{
    await browser
        .click('[id="' + processName + '"]');
    await browser
        .wait(1000)
        .pressKey('enter');
}

async function returnProcessToCreator(browser, comments, processName)
{
    await browser
        .click('[id="' + processName + '"]');
    await browser
        .typeText('[name="comments"]', comments)
        .click('#returnToCreator1');
}

let getCurrentUrl = ClientFunction(() => window.location.href);

fixture('Handle Process').page('https://localhost');

test('Start And Handle', async browser => {
    await browser.setNativeDialogHandler(() => true);
    await login(browser, 'levtom@outlook.co.il');
    let h1 = Selector('h1');
    await browser.expect(h1.textContent).eql('מערכת לניהול תהליכים ארגוניים');
    await browser
        .click('[name=startProcessView]');
    await browser
        .click('#start-process-button')
        .wait(1000);
    await browser
        .expect(Selector('.ajs-content').withText('שם לא יכול להיות ריק').exists).ok()
        .pressKey('enter');
    await browser
        .typeText('#start-processes-name', 'תהליך אישור')
        .click('#start-process-button')
        .wait(1000);
    await browser
        .expect(Selector('.ajs-content').withText('תאריך לא יכול להיות ריק').exists).ok()
        .pressKey('enter');
    await browser
        .typeText('#start-processes-date', '1997-11-03T05:00')
        .click('#start-process-button')
        .wait(1000);
    await browser
        .expect(Selector('.ajs-content').withText('התאריך חייב להיות מאוחר יותר מהיום').exists).ok()
        .pressKey('enter');
    await startProcess(browser, 'תהליך אישור', '2020-11-03T05:00', '1', 'תהליך אישור');
    await browser
        .wait(1000)
        .pressKey('enter');
    await browser.expect(getCurrentUrl()).eql('https://localhost/Home', {timeout: 5000});
    await browser
        .click('[name="myWaitingProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getWaitingActiveProcessesByUser', {timeout: 5000});
    await browser.expect(Selector('td').nth(0).textContent).eql('תהליך אישור');
    await browser.expect(Selector('td').nth(5).exists).notOk();
    await handleProcess(browser, 'תהליך אישור', 'הערות של אחראי מיתוג קמפיינים', [], {'1': 'רמד הסברה'});
}).before(beforeGlobal);

test('Handle', async browser => {
    await browser.setNativeDialogHandler(() => true);
    await login(browser, 'kutigolberg@outlook.co.il');
    await browser
        .click('[name="myWaitingProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getWaitingActiveProcessesByUser', {timeout: 5000});
    await handleProcess(browser, 'תהליך אישור', 'הערות של רמד הסברה', [], {'2': 'אחראי מיתוג קמפיינים'});
});

test('Handle', async browser => {
    await browser.setNativeDialogHandler(() => true);
    await login(browser, 'levtom@outlook.co.il');
    await browser
        .click('[name="myWaitingProcesses"]');
    await handleProcess(browser, 'תהליך אישור', 'הערות של אחראי מיתוג קמפיינים', ['3', '4'], {'3': 'אחראי רכש', '4': 'גרפיקאי'});
});

test('Handle', async browser => {
    await browser.setNativeDialogHandler(() => true);
    await login(browser, 'levtom2@outlook.co.il');
    await browser
        .click('[name="myWaitingProcesses"]');
    await handleProcess(browser, 'תהליך אישור', 'הערות של אחראי רכש', [], {'5': 'רמד הסברה'});
});

test('Take Part In Process', async browser => {
    await browser.setNativeDialogHandler(() => true);
    await login(browser, 'shahar0897@outlook.com');
    await browser
        .click('[name="myAvailableProcesses"]');
    await takePartInProcess(browser, 'תהליך אישור');
});

test('Handle', async browser => {
    await browser.setNativeDialogHandler(() => true);
    await login(browser, 'shahar0897@outlook.com');
    await browser
        .click('[name="myWaitingProcesses"]');
    await handleProcess(browser, 'תהליך אישור', 'הערות של גרפיקאי', [], {'5': 'רמד הסברה'});
});

test('Return To Creator', async browser => {
    await browser.setNativeDialogHandler(() => true);
    await login(browser, 'kutigolberg@outlook.co.il');
    await browser
        .click('[name="myWaitingProcesses"]');
    await returnProcessToCreator(browser, 'הערות חזרה של רמד הסברה', 'תהליך אישור')
});

test('Handle', async browser => {
    await browser.setNativeDialogHandler(() => true);
    await login(browser, 'levtom@outlook.co.il');
    await browser
        .click('[name="myWaitingProcesses"]');
    await handleProcess(browser, 'תהליך אישור', 'הערות של אחראי מיתוג קמפיינים', ['3', '4'], {'3': 'אחראי רכש', '4': 'גרפיקאי'});
});

test('Handle', async browser => {
    await browser.setNativeDialogHandler(() => true);
    await login(browser, 'levtom2@outlook.co.il');
    await browser
        .click('[name="myWaitingProcesses"]');
    await handleProcess(browser, 'תהליך אישור', 'הערות של אחראי רכש', [], {'5': 'רמד הסברה'});
});

test('Handle', async browser => {
    await browser.setNativeDialogHandler(() => true);
    await login(browser, 'shahar0897@outlook.com');
    await browser
        .click('[name="myWaitingProcesses"]');
    await handleProcess(browser, 'תהליך אישור', 'הערות של גרפיקאי', [], {'5': 'רמד הסברה'});
});

test('Handle', async browser => {
    await browser.setNativeDialogHandler(() => true);
    await login(browser, 'kutigolberg@outlook.co.il');
    await browser
        .click('[name="myWaitingProcesses"]');
    await handleProcess(browser, 'תהליך אישור', 'הערות של רמד הסברה', [], {'6': 'אחראי מיתוג קמפיינים'});
});

test('Finish', async browser => {
    await browser.setNativeDialogHandler(() => true);
    await login(browser, 'levtom@outlook.co.il');
    await browser
        .click('[name="myWaitingProcesses"]');
    await handleProcess(browser, 'תהליך אישור', 'הערות של אחראי מיתוג קמפיינים', [], {});
});