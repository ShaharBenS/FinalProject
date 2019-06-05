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
import {
    Selector
} from 'testcafe';

function addProcessStructure()
{
    return new Promise(resolve =>
    {
        processStructureController.addProcessStructure('yor@outlook.co.il', 'תהליך אישור', JSON.stringify(processStructureSankeyJSON), [], 0, "12", (err, needApproval) =>
        {
            if (err) {
                resolve(err);
            }
            else {
                resolve();
            }
        });
    });
}

function addUsersAndRolesTree()
{
    return new Promise(resolve =>
    {
        userAccessor.createSankeyTree({
            sankey: JSON.stringify({
                content: {
                    diagram: []
                }
            })
        }, (err, result) =>
        {
            if (err) {
                resolve(err);
            }
            else {
                UsersAndRolesTreeSankey.setUsersAndRolesTree('yor@outlook.co.il', JSON.stringify(sankeyContent),
                    rolesToEmails, emailsToFullName,
                    rolesToDereg, (err) =>
                    {
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

let beforeGlobal = async function ()
{
    mongoose.set('useCreateIndex', true);
    await mongoose.connect('mongodb://localhost:27017/Tests', {
        useNewUrlParser: true
    });
    mongoose.connection.db.dropDatabase();
    await addUsersAndRolesTree();
    await addProcessStructure();
};

async function login(browser, userEmail, password)
{
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
    }
    else {
        await browser
            .typeText('[name="passwd"]', password)
            .pressKey('enter');
    }
}

async function startProcess(browser, activeProcessName, date, urgency, processStructureName)
{
    const urgencySelect = Selector('#start-processes-urgency');
    let urgencyOption = urgencySelect.find('option').withText(urgency);
    let processStructureSelect = Selector('#start-processes-selector');
    let processStructureOption = processStructureSelect.find('option').withText(processStructureName);
    await browser
        .typeText('#start-processes-name', 'תהליך אישור', {
            caretPos: 0,
            replace: true
        })
        .typeText('#start-processes-date', '2020-11-03T05:00')
        .click('#start-processes-urgency')
        .click(urgencyOption)
        .click('#start-processes-selector')
        .click(processStructureOption)
        .click('#start-process-button');
}

async function handleProcess(browser, processName, comments, options, allOptions, files)
{
    await browser
        .click('[id="' + processName + '"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/handleProcessView/?process_name=' + encodeURI(processName), {
        timeout: 10000
    });
    let h1 = Selector('h1');
    await browser.expect(h1.textContent).eql('טיפול בתהליך ' + processName);
    await browser
        .typeText('[name="comments"]', comments);
    /*for(let stageNum in allOptions)
    {
        if(allOptions.hasOwnProperty(stageNum))
        {
            await browser.expect(Selector('[name="'+ stageNum+'"]').textContent).eql(allOptions[stageNum]);
        }
    }

    if(files !== undefined)
    {
        for (let i = 0; i < files.length; i++) {
            await browser
                .click('#upFake')
                .setFilesToUpload('#fileUpload',
                    files[i]
                ).wait(2000);
        }
    }*/
    for (let i = 0; i < options.length; i++) {
        await browser
            .click('[name="' + options[i] + '"]');
    }
    await browser
        .wait(2000)
        .click('#advanceProcess')
        .wait(1000)
        .pressKey('enter');
    await browser.expect(getCurrentUrl()).eql('https://localhost/Home', {
        timeout: 10000
    });
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

fixture('Full Test').page('https://localhost');

test('Stage 1 - Check There Is No Available Processes', async browser =>
{
    await login(browser, 'levtom@outlook.co.il');
    await browser.click('[name="myAvailableProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getAvailableActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('תהליכים זמינים')
        .expect(Selector('td').innerText).eql('אין כרגע מידע בטבלה');
}).before(beforeGlobal);

test('Stage 2 - Check There Is No Pending Processes', async browser => {
    await login(browser, 'levtom@outlook.co.il');
    await browser.click('[name="myWaitingProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getWaitingActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('תהליכים ממתינים')
        .expect(Selector('td').innerText).eql('אין כרגע מידע בטבלה');
});

test('Stage 3 - Check There Is No Active Processes', async browser => {
    await login(browser, 'levtom@outlook.co.il');
    await browser.click('[name="myActiveProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getAllActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('תהליכים פעילים')
        .expect(Selector('td').innerText).eql('אין כרגע מידע בטבלה');
});

test('Stage 4 - Check There Is No Process Reports', async browser => {
    await login(browser, 'levtom@outlook.co.il');
    await browser.click('[name="ProcessReports"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getAllProcessesReportsByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('הדוחות שלי')
        .expect(Selector('td').innerText).eql('אין כרגע מידע בטבלה');
});

test('Stage 5 - Check There Is No Personal Notifications', async browser => {
    await login(browser, 'levtom@outlook.co.il');
    await browser.click('[name="Notifications"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/notifications/myNotifications', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('ההתראות שלי')
        .expect(Selector('td').innerText).eql('אין כרגע מידע בטבלה');
});

test('Stage 6 - Start And Handle The Process', async browser =>
{
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
    await browser.expect(getCurrentUrl()).eql('https://localhost/Home', {
        timeout: 10000
    });
    await browser
        .click('[name="myWaitingProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getWaitingActiveProcessesByUser', {
        timeout: 10000
    });
    await browser.expect(Selector('td').nth(0).textContent).eql('תהליך אישור');
    await handleProcess(browser, 'תהליך אישור', 'הערות של אחראי מיתוג קמפיינים', [], {
        '1': 'רמד הסברה'
    }, ['../fileTests/inputFiles/a.txt']);
});

test('Stage 7 - Check There Is A Personal Notification', async browser =>
{
    await login(browser, 'levtom@outlook.co.il');
    await browser.expect(Selector('.badge').innerText).eql('1');
    await browser.click('[name="Notifications"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/notifications/myNotifications', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('ההתראות שלי')
        .expect(Selector('tbody tr').nth(0).child(0).innerText).eql('תהליך בהמתנה')
        .expect(Selector('tbody tr').nth(0).child(1).innerText).eql('תהליך אישור מסוג תהליך אישור מחכה לטיפולך.');
});

test('Stage 8 - Check There Is An Active Process', async browser =>
{
    await login(browser, 'levtom@outlook.co.il');
    await browser.click('[name="myActiveProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getAllActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('תהליכים פעילים')
        .expect(Selector('td').nth(0).innerText).eql('תהליך אישור')
        .expect(Selector('td').nth(1).innerText).eql('1')
        .expect(Selector('td').nth(2).innerText).eql('03/11/2020 05:00:00')
        .expect(Selector('td').nth(3).innerText).eql('רמד הסברה');
});

test('Stage 9 - Check The Process Report', async browser =>
{
    await login(browser, 'levtom@outlook.co.il');
    await browser.click('[name="ProcessReports"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getAllProcessesReportsByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('הדוחות שלי');
    await browser.click(Selector('td').nth(2));
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/reportProcess/?process_name=%D7%AA%D7%94%D7%9C%D7%99%D7%9A%20%D7%90%D7%99%D7%A9%D7%95%D7%A8', {
        timeout: 10000
    })
        .expect(Selector('#processName').innerText).eql('דו"ח תהליך אישור')
        .expect(Selector('#processCreatorName').innerText).eql('שם יוצר התהליך : קיילור נבאס')
        .expect(Selector('#processDate').innerText).eql('תאריך היעד : 03/11/2020 05:00:00')
        .expect(Selector('#processUrgency').innerText).eql('דחיפות התהליך : 1')
        .expect(Selector('#processStatus').innerText).eql('סטטוס : פעיל')
        .expect(Selector('#example tbody tr').count).eql(1)
        .expect(Selector('#example tbody tr td').nth(0).innerText).eql('קיילור נבאס - אחראי מיתוג קמפיינים')
        .expect(Selector('#example tbody tr td').nth(2).innerText).eql('הערות של אחראי מיתוג קמפיינים')

});

test('Stage 10 - Check There Is No Pending Process', async browser =>
{
    await login(browser, 'kutigolberg@outlook.co.il');
    await browser.click('[name="myWaitingProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getWaitingActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('תהליכים ממתינים')
        .expect(Selector('td').innerText).eql('אין כרגע מידע בטבלה');
});

test('Stage 11 - Check There Is An Available Process', async browser =>
{
    await login(browser, 'kutigolberg@outlook.co.il');
    await browser.click('[name="myAvailableProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getAvailableActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('תהליכים זמינים')
        .expect(Selector('td').nth(0).innerText).eql('תהליך אישור');
});

test('Stage 12 - Take The Available Process', async browser =>
{
    await login(browser, 'kutigolberg@outlook.co.il');
    await browser.click('[name="myAvailableProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getAvailableActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('תהליכים זמינים')
        .expect(Selector('td').nth(0).innerText).eql('תהליך אישור');
    await takePartInProcess(browser, 'תהליך אישור');
});

test('Stage 13 - Check There Is An Pending Process', async browser =>
{
    await login(browser, 'kutigolberg@outlook.co.il');
    await browser.click('[name="myWaitingProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getWaitingActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('תהליכים ממתינים')
        .expect(Selector('td').nth(0).innerText).eql('תהליך אישור');
});

test('Stage 14 - Check There Is A Personal Notification', async browser =>
{
    await login(browser, 'kutigolberg@outlook.co.il');
    await browser.expect(Selector('.badge').innerText).eql('1');
    await browser.click('[name="Notifications"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/notifications/myNotifications', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('ההתראות שלי')
        .expect(Selector('tbody tr').nth(0).child(0).innerText).eql('תהליך זמין')
        .expect(Selector('tbody tr').nth(0).child(1).innerText).eql('התהליך תהליך אישור מחכה ברשימת התהליכים הזמינים לך');
});

test('Stage 15 - Handle The Process', async browser =>
{
    await login(browser, 'kutigolberg@outlook.co.il');
    await browser.click('[name="myWaitingProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getWaitingActiveProcessesByUser', {
        timeout: 10000
    });
    await handleProcess(browser, 'תהליך אישור', 'הערות של רמד הסברה', [], {
        '2': 'אחראי מיתוג קמפיינים'
    });
});

test('Stage 16 - Check The Process Report', async browser =>
{
    await login(browser, 'kutigolberg@outlook.co.il');
    await browser.click('[name="ProcessReports"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getAllProcessesReportsByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('הדוחות שלי');
    await browser.click(Selector('td').nth(2));
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/reportProcess/?process_name=%D7%AA%D7%94%D7%9C%D7%99%D7%9A%20%D7%90%D7%99%D7%A9%D7%95%D7%A8', {
        timeout: 10000
    })
        .expect(Selector('#processName').innerText).eql('דו"ח תהליך אישור')
        .expect(Selector('#processCreatorName').innerText).eql('שם יוצר התהליך : קיילור נבאס')
        .expect(Selector('#processDate').innerText).eql('תאריך היעד : 03/11/2020 05:00:00')
        .expect(Selector('#processUrgency').innerText).eql('דחיפות התהליך : 1')
        .expect(Selector('#processStatus').innerText).eql('סטטוס : פעיל')
        .expect(Selector('#example tbody tr').count).eql(2)
        .expect(Selector('#example tbody tr td').nth(0).innerText).eql('פדריקו ולוורדה - רמד הסברה')
        .expect(Selector('#example tbody tr td').nth(2).innerText).eql('הערות של רמד הסברה')

});

test('Stage 17 - Check There Is An Active Process', async browser =>
{
    await login(browser, 'kutigolberg@outlook.co.il');
    await browser.click('[name="myActiveProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getAllActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('תהליכים פעילים')
        .expect(Selector('td').nth(0).innerText).eql('תהליך אישור')
        .expect(Selector('td').nth(1).innerText).eql('1')
        .expect(Selector('td').nth(2).innerText).eql('03/11/2020 05:00:00')
        .expect(Selector('td').nth(3).innerText).eql('קיילור נבאס - אחראי מיתוג קמפיינים');
});

test('Stage 18 - Check There Is An Pending Process', async browser =>
{
    await login(browser, 'levtom@outlook.co.il');
    await browser.click('[name="myWaitingProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getWaitingActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('תהליכים ממתינים')
        .expect(Selector('td').nth(0).innerText).eql('תהליך אישור');
});

test('Stage 19 - Check There Is A Personal Notification', async browser =>
{
    await login(browser, 'levtom@outlook.co.il');
    await browser.expect(Selector('.badge').innerText).eql('2');
    await browser.click('[name="Notifications"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/notifications/myNotifications', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('ההתראות שלי')
        .expect(Selector('tbody tr').nth(0).child(0).innerText).eql('תהליך בהמתנה')
        .expect(Selector('tbody tr').nth(0).child(1).innerText).eql('תהליך אישור מסוג תהליך אישור מחכה לטיפולך.');
});

test('Stage 20 - Handle The Process', async browser =>
{
    await login(browser, 'levtom@outlook.co.il');
    await browser.click('[name="myWaitingProcesses"]');
    await handleProcess(browser, 'תהליך אישור', 'הערות של אחראי מיתוג קמפיינים', ['3', '4'], {
        '3': 'אחראי רכש',
        '4': 'גרפיקאי'
    });
});

test('Stage 21 - Check The Process Report', async browser =>
{
    await login(browser, 'levtom@outlook.co.il');
    await browser.click('[name="ProcessReports"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getAllProcessesReportsByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('הדוחות שלי');
    await browser.click(Selector('td').nth(2));
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/reportProcess/?process_name=%D7%AA%D7%94%D7%9C%D7%99%D7%9A%20%D7%90%D7%99%D7%A9%D7%95%D7%A8', {
        timeout: 10000
    })
        .expect(Selector('#processName').innerText).eql('דו"ח תהליך אישור')
        .expect(Selector('#processCreatorName').innerText).eql('שם יוצר התהליך : קיילור נבאס')
        .expect(Selector('#processDate').innerText).eql('תאריך היעד : 03/11/2020 05:00:00')
        .expect(Selector('#processUrgency').innerText).eql('דחיפות התהליך : 1')
        .expect(Selector('#processStatus').innerText).eql('סטטוס : פעיל')
        .expect(Selector('#example tbody tr').count).eql(3)
        .expect(Selector('#example tbody tr td').nth(0).innerText).eql('פדריקו ולוורדה - רמד הסברה')
        .expect(Selector('#example tbody tr td').nth(2).innerText).eql('הערות של רמד הסברה')

});

test('Stage 22 - Check There Is An Active Process', async browser =>
{
    await login(browser, 'levtom@outlook.co.il');
    await browser.click('[name="myActiveProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getAllActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('תהליכים פעילים')
        .expect(Selector('td').nth(0).innerText).eql('תהליך אישור')
        .expect(Selector('td').nth(1).innerText).eql('1')
        .expect(Selector('td').nth(2).innerText).eql('03/11/2020 05:00:00')
        .expect(Selector('td').nth(3).innerText).eql('גרפיקאי קרלוס קאסמירו - אחראי רכש');
});

test('Stage 23 - Check There Is An Pending Process', async browser =>
{
    await login(browser, 'levtom2@outlook.co.il');
    await browser.click('[name="myWaitingProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getWaitingActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('תהליכים ממתינים')
        .expect(Selector('td').nth(0).innerText).eql('תהליך אישור');
});

test('Stage 24 - Check There Is A Personal Notification', async browser =>
{
    await login(browser, 'levtom2@outlook.co.il');
    await browser.expect(Selector('.badge').innerText).eql('1');
    await browser.click('[name="Notifications"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/notifications/myNotifications', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('ההתראות שלי')
        .expect(Selector('tbody tr').nth(0).child(0).innerText).eql('תהליך בהמתנה')
        .expect(Selector('tbody tr').nth(0).child(1).innerText).eql('התהליך תהליך אישור מחכה לטיפולך.');
});

test('Stage 25 - Handle The Process', async browser =>
{
    await login(browser, 'levtom2@outlook.co.il');
    await browser.click('[name="myWaitingProcesses"]');
    await handleProcess(browser, 'תהליך אישור', 'הערות של אחראי רכש', [], {
        '5': 'רמד הסברה'
    });
});

test('Stage 26 - Check The Process Report', async browser =>
{
    await login(browser, 'levtom@outlook.co.il');
    await browser.click('[name="ProcessReports"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getAllProcessesReportsByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('הדוחות שלי');
    await browser.click(Selector('td').nth(2));
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/reportProcess/?process_name=%D7%AA%D7%94%D7%9C%D7%99%D7%9A%20%D7%90%D7%99%D7%A9%D7%95%D7%A8', {
        timeout: 10000
    })
        .expect(Selector('#processName').innerText).eql('דו"ח תהליך אישור')
        .expect(Selector('#processCreatorName').innerText).eql('שם יוצר התהליך : קיילור נבאס')
        .expect(Selector('#processDate').innerText).eql('תאריך היעד : 03/11/2020 05:00:00')
        .expect(Selector('#processUrgency').innerText).eql('דחיפות התהליך : 1')
        .expect(Selector('#processStatus').innerText).eql('סטטוס : פעיל')
        .expect(Selector('#example tbody tr').count).eql(4)
        .expect(Selector('#example tbody tr td').nth(0).innerText).eql('פדריקו ולוורדה - רמד הסברה')
        .expect(Selector('#example tbody tr td').nth(2).innerText).eql('הערות של רמד הסברה')

});

test('Stage 27 - Check There Is An Active Process', async browser =>
{
    await login(browser, 'levtom2@outlook.co.il');
    await browser.click('[name="myActiveProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getAllActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('תהליכים פעילים')
        .expect(Selector('td').nth(0).innerText).eql('תהליך אישור')
        .expect(Selector('td').nth(1).innerText).eql('1')
        .expect(Selector('td').nth(2).innerText).eql('03/11/2020 05:00:00')
        .expect(Selector('td').nth(3).innerText).eql('גרפיקאי');
});

test('Stage 28 - Check There Is An Available Process', async browser =>
{
    await login(browser, 'shahar0897@outlook.com');
    await browser.click('[name="myAvailableProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getAvailableActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('תהליכים זמינים')
        .expect(Selector('td').nth(0).innerText).eql('תהליך אישור');
});

test('Stage 29 - Take The Available Process', async browser =>
{
    await login(browser, 'shahar0897@outlook.com');
    await browser.click('[name="myAvailableProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getAvailableActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('תהליכים זמינים')
        .expect(Selector('td').nth(0).innerText).eql('תהליך אישור');
    await takePartInProcess(browser, 'תהליך אישור');
});

test('Stage 30 - Check There Is An Pending Process', async browser =>
{
    await login(browser, 'shahar0897@outlook.com');
    await browser.click('[name="myWaitingProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getWaitingActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('תהליכים ממתינים')
        .expect(Selector('td').nth(0).innerText).eql('תהליך אישור');
});

test('Stage 31 - Check There Is A Personal Notification', async browser =>
{
    await login(browser, 'shahar0897@outlook.com');
    await browser.expect(Selector('.badge').innerText).eql('1');
    await browser.click('[name="Notifications"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/notifications/myNotifications', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('ההתראות שלי')
        .expect(Selector('tbody tr').nth(0).child(0).innerText).eql('תהליך זמין')
        .expect(Selector('tbody tr').nth(0).child(1).innerText).eql('התהליך תהליך אישור מחכה ברשימת התהליכים הזמינים לך');
});

test('Stage 32 - Handle The Process', async browser =>
{
    await login(browser, 'shahar0897@outlook.com');
    await browser.click('[name="myWaitingProcesses"]');
    await handleProcess(browser, 'תהליך אישור', 'הערות של גרפיקאי', [], {
        '5': 'רמד הסברה'
    });
});

test('Stage 33 - Check The Process Report', async browser =>
{
    await login(browser, 'levtom@outlook.co.il');
    await browser.click('[name="ProcessReports"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getAllProcessesReportsByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('הדוחות שלי');
    await browser.click(Selector('td').nth(2));
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/reportProcess/?process_name=%D7%AA%D7%94%D7%9C%D7%99%D7%9A%20%D7%90%D7%99%D7%A9%D7%95%D7%A8', {
        timeout: 10000
    })
        .expect(Selector('#processName').innerText).eql('דו"ח תהליך אישור')
        .expect(Selector('#processCreatorName').innerText).eql('שם יוצר התהליך : קיילור נבאס')
        .expect(Selector('#processDate').innerText).eql('תאריך היעד : 03/11/2020 05:00:00')
        .expect(Selector('#processUrgency').innerText).eql('דחיפות התהליך : 1')
        .expect(Selector('#processStatus').innerText).eql('סטטוס : פעיל')
        .expect(Selector('#example tbody tr').count).eql(5)
        .expect(Selector('#example tbody tr td').nth(0).innerText).eql('גארת בייל - גרפיקאי')
        .expect(Selector('#example tbody tr td').nth(2).innerText).eql('הערות של גרפיקאי')

});

test('Stage 34 - Check There Is An Active Process', async browser =>
{
    await login(browser, 'shahar0897@outlook.com');
    await browser.click('[name="myActiveProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getAllActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('תהליכים פעילים')
        .expect(Selector('td').nth(0).innerText).eql('תהליך אישור')
        .expect(Selector('td').nth(1).innerText).eql('1')
        .expect(Selector('td').nth(2).innerText).eql('03/11/2020 05:00:00')
        .expect(Selector('td').nth(3).innerText).eql('פדריקו ולוורדה - רמד הסברה');
});

test('Stage 35 - Check There Is An Pending Process', async browser =>
{
    await login(browser, 'kutigolberg@outlook.co.il');
    await browser.click('[name="myWaitingProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getWaitingActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('תהליכים ממתינים')
        .expect(Selector('td').nth(0).innerText).eql('תהליך אישור');
});

test('Stage 36 - Return Process To Creator', async browser =>
{
    await login(browser, 'kutigolberg@outlook.co.il');
    await browser.click('[name="myWaitingProcesses"]');
    await returnProcessToCreator(browser, 'הערות חזרה של רמד הסברה', 'תהליך אישור');
});

test('Stage 37 - Check There Is An Pending Process', async browser =>
{
    await login(browser, 'levtom@outlook.co.il');
    await browser.click('[name="myWaitingProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getWaitingActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('תהליכים ממתינים')
        .expect(Selector('td').nth(0).innerText).eql('תהליך אישור');
});

test('Stage 38 - Check There Is An Active Process', async browser =>
{
    await login(browser, 'levtom@outlook.co.il');
    await browser.click('[name="myActiveProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getAllActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('תהליכים פעילים')
        .expect(Selector('td').nth(0).innerText).eql('תהליך אישור')
        .expect(Selector('td').nth(1).innerText).eql('1')
        .expect(Selector('td').nth(2).innerText).eql('03/11/2020 05:00:00')
        .expect(Selector('td').nth(3).innerText).eql('קיילור נבאס - אחראי מיתוג קמפיינים');
});

test('Stage 39 - Check There Is A Personal Notification', async browser =>
{
    await login(browser, 'levtom@outlook.co.il');
    await browser.expect(Selector('.badge').innerText).eql('3');
    await browser.click('[name="Notifications"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/notifications/myNotifications', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('ההתראות שלי')
        .expect(Selector('tbody tr').nth(2).child(0).innerText).eql('תהליך חזר ליוצר')
        .expect(Selector('tbody tr').nth(2).child(1).innerText).eql('התהליך תהליך אישור חזר אליך');
});

test('Stage 40 - Handle The Process', async browser =>
{
    await login(browser, 'levtom@outlook.co.il');
    await browser.click('[name="myWaitingProcesses"]');
    await handleProcess(browser, 'תהליך אישור', 'הערות של אחראי מיתוג קמפיינים', ['3', '4'], {
        '3': 'אחראי רכש',
        '4': 'גרפיקאי'
    });
});

test('Stage 41 - Check The Process Report', async browser =>
{
    await login(browser, 'levtom@outlook.co.il');
    await browser.click('[name="ProcessReports"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getAllProcessesReportsByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('הדוחות שלי');
    await browser.click(Selector('td').nth(2));
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/reportProcess/?process_name=%D7%AA%D7%94%D7%9C%D7%99%D7%9A%20%D7%90%D7%99%D7%A9%D7%95%D7%A8', {
        timeout: 10000
    })
        .expect(Selector('#processName').innerText).eql('דו"ח תהליך אישור')
        .expect(Selector('#processCreatorName').innerText).eql('שם יוצר התהליך : קיילור נבאס')
        .expect(Selector('#processDate').innerText).eql('תאריך היעד : 03/11/2020 05:00:00')
        .expect(Selector('#processUrgency').innerText).eql('דחיפות התהליך : 1')
        .expect(Selector('#processStatus').innerText).eql('סטטוס : פעיל')
        .expect(Selector('#example tbody tr').count).eql(7)
        .expect(Selector('#example tbody tr td').nth(0).innerText).eql('גארת בייל - גרפיקאי')
        .expect(Selector('#example tbody tr td').nth(2).innerText).eql('הערות של גרפיקאי')

});

test('Stage 42 - Check There Is An Pending Process', async browser =>
{
    await login(browser, 'levtom2@outlook.co.il');
    await browser.click('[name="myWaitingProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getWaitingActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('תהליכים ממתינים')
        .expect(Selector('td').nth(0).innerText).eql('תהליך אישור');
});

test('Stage 43 - Check There Is A Personal Notification', async browser =>
{
    await login(browser, 'levtom2@outlook.co.il');
    await browser.expect(Selector('.badge').innerText).eql('2');
    await browser.click('[name="Notifications"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/notifications/myNotifications', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('ההתראות שלי')
        .expect(Selector('tbody tr').nth(1).child(0).innerText).eql('תהליך בהמתנה')
        .expect(Selector('tbody tr').nth(1).child(1).innerText).eql('התהליך תהליך אישור מחכה לטיפולך.');
});

test('Stage 44 - Handle The Process', async browser =>
{
    await login(browser, 'levtom2@outlook.co.il');
    await browser
        .click('[name="myWaitingProcesses"]');
    await handleProcess(browser, 'תהליך אישור', 'הערות של אחראי רכש', [], {
        '5': 'רמד הסברה'
    });
});

test('Stage 45 - Check The Process Report', async browser =>
{
    await login(browser, 'levtom@outlook.co.il');
    await browser.click('[name="ProcessReports"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getAllProcessesReportsByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('הדוחות שלי');
    await browser.click(Selector('td').nth(2));
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/reportProcess/?process_name=%D7%AA%D7%94%D7%9C%D7%99%D7%9A%20%D7%90%D7%99%D7%A9%D7%95%D7%A8', {
        timeout: 10000
    })
        .expect(Selector('#processName').innerText).eql('דו"ח תהליך אישור')
        .expect(Selector('#processCreatorName').innerText).eql('שם יוצר התהליך : קיילור נבאס')
        .expect(Selector('#processDate').innerText).eql('תאריך היעד : 03/11/2020 05:00:00')
        .expect(Selector('#processUrgency').innerText).eql('דחיפות התהליך : 1')
        .expect(Selector('#processStatus').innerText).eql('סטטוס : פעיל')
        .expect(Selector('#example tbody tr').count).eql(8)
        .expect(Selector('#example tbody tr td').nth(0).innerText).eql('גארת בייל - גרפיקאי')
        .expect(Selector('#example tbody tr td').nth(2).innerText).eql('הערות של גרפיקאי')

});

test('Stage 46 - Check There Is An Active Process', async browser =>
{
    await login(browser, 'levtom2@outlook.co.il');
    await browser.click('[name="myActiveProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getAllActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('תהליכים פעילים')
        .expect(Selector('td').nth(0).innerText).eql('תהליך אישור')
        .expect(Selector('td').nth(1).innerText).eql('1')
        .expect(Selector('td').nth(2).innerText).eql('03/11/2020 05:00:00')
        .expect(Selector('td').nth(3).innerText).eql('גארת בייל - גרפיקאי');
});

test('Stage 47 - Check There Is An Pending Process', async browser =>
{
    await login(browser, 'shahar0897@outlook.com');
    await browser.click('[name="myWaitingProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getWaitingActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('תהליכים ממתינים')
        .expect(Selector('td').nth(0).innerText).eql('תהליך אישור');
});

test('Stage 48 - Check There Is A Personal Notification', async browser =>
{
    await login(browser, 'shahar0897@outlook.com');
    await browser.expect(Selector('.badge').innerText).eql('2');
    await browser.click('[name="Notifications"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/notifications/myNotifications', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('ההתראות שלי')
        .expect(Selector('tbody tr').nth(1).child(0).innerText).eql('תהליך זמין')
        .expect(Selector('tbody tr').nth(1).child(1).innerText).eql('התהליך תהליך אישור מחכה ברשימת התהליכים הזמינים לך');
});

test('Stage 49 - Handle The Process', async browser =>
{
    await login(browser, 'shahar0897@outlook.com');
    await browser.click('[name="myWaitingProcesses"]');
    await handleProcess(browser, 'תהליך אישור', 'הערות של גרפיקאי', [], {
        '5': 'רמד הסברה'
    });
});

test('Stage 50 - Check The Process Report', async browser =>
{
    await login(browser, 'levtom@outlook.co.il');
    await browser.click('[name="ProcessReports"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getAllProcessesReportsByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('הדוחות שלי');
    await browser.click(Selector('td').nth(2));
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/reportProcess/?process_name=%D7%AA%D7%94%D7%9C%D7%99%D7%9A%20%D7%90%D7%99%D7%A9%D7%95%D7%A8', {
        timeout: 10000
    })
        .expect(Selector('#processName').innerText).eql('דו"ח תהליך אישור')
        .expect(Selector('#processCreatorName').innerText).eql('שם יוצר התהליך : קיילור נבאס')
        .expect(Selector('#processDate').innerText).eql('תאריך היעד : 03/11/2020 05:00:00')
        .expect(Selector('#processUrgency').innerText).eql('דחיפות התהליך : 1')
        .expect(Selector('#processStatus').innerText).eql('סטטוס : פעיל')
        .expect(Selector('#example tbody tr').count).eql(9)
        .expect(Selector('#example tbody tr td').nth(0).innerText).eql('גארת בייל - גרפיקאי')
        .expect(Selector('#example tbody tr td').nth(2).innerText).eql('הערות של גרפיקאי')

});


test('Stage 51 - Check There Is An Active Process', async browser =>
{
    await login(browser, 'shahar0897@outlook.com');
    await browser.click('[name="myActiveProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getAllActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('תהליכים פעילים')
        .expect(Selector('td').nth(0).innerText).eql('תהליך אישור')
        .expect(Selector('td').nth(1).innerText).eql('1')
        .expect(Selector('td').nth(2).innerText).eql('03/11/2020 05:00:00')
        .expect(Selector('td').nth(3).innerText).eql('פדריקו ולוורדה - רמד הסברה');
});

test('Stage 52 - Check There Is An Pending Process', async browser =>
{
    await login(browser, 'kutigolberg@outlook.co.il');
    await browser.click('[name="myWaitingProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getWaitingActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('תהליכים ממתינים')
        .expect(Selector('td').nth(0).innerText).eql('תהליך אישור');
});

test('Stage 53 - Check There Is A Personal Notification', async browser =>
{
    await login(browser, 'kutigolberg@outlook.co.il');
    await browser.expect(Selector('.badge').innerText).eql('3');
    await browser.click('[name="Notifications"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/notifications/myNotifications', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('ההתראות שלי')
        .expect(Selector('tbody tr').nth(2).child(0).innerText).eql('תהליך זמין')
        .expect(Selector('tbody tr').nth(2).child(1).innerText).eql('התהליך תהליך אישור מחכה ברשימת התהליכים הזמינים לך');
});

test('Stage 54 - Handle The Process', async browser =>
{
    await login(browser, 'kutigolberg@outlook.co.il');
    await browser.click('[name="myWaitingProcesses"]');
    await handleProcess(browser, 'תהליך אישור', 'הערות של רמד הסברה', [], {
        '6': 'אחראי מיתוג קמפיינים'
    });
});

test('Stage 55 - Check The Process Report', async browser =>
{
    await login(browser, 'levtom@outlook.co.il');
    await browser.click('[name="ProcessReports"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getAllProcessesReportsByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('הדוחות שלי');
    await browser.click(Selector('td').nth(2));
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/reportProcess/?process_name=%D7%AA%D7%94%D7%9C%D7%99%D7%9A%20%D7%90%D7%99%D7%A9%D7%95%D7%A8', {
        timeout: 10000
    })
        .expect(Selector('#processName').innerText).eql('דו"ח תהליך אישור')
        .expect(Selector('#processCreatorName').innerText).eql('שם יוצר התהליך : קיילור נבאס')
        .expect(Selector('#processDate').innerText).eql('תאריך היעד : 03/11/2020 05:00:00')
        .expect(Selector('#processUrgency').innerText).eql('דחיפות התהליך : 1')
        .expect(Selector('#processStatus').innerText).eql('סטטוס : פעיל')
        .expect(Selector('#example tbody tr').count).eql(10)
        .expect(Selector('#example tbody tr td').nth(0).innerText).eql('גארת בייל - גרפיקאי')
        .expect(Selector('#example tbody tr td').nth(2).innerText).eql('הערות של גרפיקאי')

});


test('Stage 56 - Check There Is An Active Process', async browser =>
{
    await login(browser, 'kutigolberg@outlook.co.il');
    await browser.click('[name="myActiveProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getAllActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('תהליכים פעילים')
        .expect(Selector('td').nth(0).innerText).eql('תהליך אישור')
        .expect(Selector('td').nth(1).innerText).eql('1')
        .expect(Selector('td').nth(2).innerText).eql('03/11/2020 05:00:00')
        .expect(Selector('td').nth(3).innerText).eql('קיילור נבאס - אחראי מיתוג קמפיינים');
});

test('Stage 57 - Check There Is An Pending Process', async browser =>
{
    await login(browser, 'levtom@outlook.co.il');
    await browser.click('[name="myWaitingProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getWaitingActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('תהליכים ממתינים')
        .expect(Selector('td').nth(0).innerText).eql('תהליך אישור');
});

test('Stage 58 - Check There Is A Personal Notification', async browser =>
{
    await login(browser, 'kutigolberg@outlook.co.il');
    await browser.expect(Selector('.badge').innerText).eql('3');
    await browser.click('[name="Notifications"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/notifications/myNotifications', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('ההתראות שלי')
        .expect(Selector('tbody tr').nth(2).child(0).innerText).eql('תהליך זמין')
        .expect(Selector('tbody tr').nth(2).child(1).innerText).eql('התהליך תהליך אישור מחכה ברשימת התהליכים הזמינים לך');
});

test('Stage 59 - Finish The Process', async browser =>
{
    await login(browser, 'levtom@outlook.co.il');
    await browser.click('[name="myWaitingProcesses"]');
    await handleProcess(browser, 'תהליך אישור', 'הערות של אחראי מיתוג קמפיינים', [], {});
});

test('Stage 60 - Check There Is A Personal Notification', async browser =>
{
    await login(browser, 'levtom@outlook.co.il');
    await browser.expect(Selector('.badge').innerText).eql('5');
    await browser.click('[name="Notifications"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/notifications/myNotifications', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('ההתראות שלי')
        .expect(Selector('tbody tr').nth(4).child(0).innerText).eql('תהליך נגמר בהצלחה')
        .expect(Selector('tbody tr').nth(4).child(1).innerText).eql('התהליך תהליך אישור הושלם בהצלחה');
});

test('Stage 61 - Check There Is A Personal Notification', async browser =>
{
    await login(browser, 'kutigolberg@outlook.co.il');
    await browser.expect(Selector('.badge').innerText).eql('4');
    await browser.click('[name="Notifications"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/notifications/myNotifications', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('ההתראות שלי')
        .expect(Selector('tbody tr').nth(3).child(0).innerText).eql('תהליך נגמר בהצלחה')
        .expect(Selector('tbody tr').nth(3).child(1).innerText).eql('התהליך תהליך אישור הושלם בהצלחה');
});

test('Stage 62 - Check There Is A Personal Notification', async browser =>
{
    await login(browser, 'levtom2@outlook.co.il');
    await browser.expect(Selector('.badge').innerText).eql('3');
    await browser.click('[name="Notifications"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/notifications/myNotifications', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('ההתראות שלי')
        .expect(Selector('tbody tr').nth(2).child(0).innerText).eql('תהליך נגמר בהצלחה')
        .expect(Selector('tbody tr').nth(2).child(1).innerText).eql('התהליך תהליך אישור הושלם בהצלחה');
});

test('Stage 63 - Check There Is A Personal Notification', async browser =>
{
    await login(browser, 'shahar0897@outlook.com');
    await browser.expect(Selector('.badge').innerText).eql('3');
    await browser.click('[name="Notifications"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/notifications/myNotifications', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('ההתראות שלי')
        .expect(Selector('tbody tr').nth(2).child(0).innerText).eql('תהליך נגמר בהצלחה')
        .expect(Selector('tbody tr').nth(2).child(1).innerText).eql('התהליך תהליך אישור הושלם בהצלחה');
});

test('Stage 64 - Check The Process Report', async browser =>
{
    await login(browser, 'levtom@outlook.co.il');
    await browser.click('[name="ProcessReports"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getAllProcessesReportsByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('הדוחות שלי');
    await browser.click(Selector('td').nth(2));
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/reportProcess/?process_name=%D7%AA%D7%94%D7%9C%D7%99%D7%9A%20%D7%90%D7%99%D7%A9%D7%95%D7%A8', {
        timeout: 10000
    })
        .expect(Selector('#processName').innerText).eql('דו"ח תהליך אישור')
        .expect(Selector('#processCreatorName').innerText).eql('שם יוצר התהליך : קיילור נבאס')
        .expect(Selector('#processDate').innerText).eql('תאריך היעד : 03/11/2020 05:00:00')
        .expect(Selector('#processUrgency').innerText).eql('דחיפות התהליך : 1')
        .expect(Selector('#processStatus').innerText).eql('סטטוס : הסתיים')
        .expect(Selector('#example tbody tr').count).eql(10)
        .expect(Selector('#example tbody tr td').nth(0).innerText).eql('גארת בייל - גרפיקאי')
        .expect(Selector('#example tbody tr td').nth(2).innerText).eql('הערות של גרפיקאי')

});

test('Stage 65 - Check There Is No Active Processes', async browser =>
{
    await login(browser, 'levtom@outlook.co.il');
    await browser.click('[name="myActiveProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getAllActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('תהליכים פעילים')
        .expect(Selector('td').innerText).eql('אין כרגע מידע בטבלה');
});