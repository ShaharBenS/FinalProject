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

function addProcessStructure() {
    return new Promise(resolve => {
        processStructureController.addProcessStructure('yor@outlook.co.il', 'תהליך אישור', JSON.stringify(processStructureSankeyJSON), [], 0, "12", (err, needApproval) => {
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

let beforeGlobal = async function() {
    mongoose.set('useCreateIndex', true);
    await mongoose.connect('mongodb://localhost:27017/Tests', {
        useNewUrlParser: true
    });
    mongoose.connection.db.dropDatabase();
    await insertToDB();
    await addProcessStructure();
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

async function startProcess(browser, activeProcessName, date, urgency, processStructureName) {
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

async function handleProcess(browser, processName, comments, options, allOptions, files) {
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
        .click('#advanceProcess');
    await browser.expect(getCurrentUrl()).eql('https://localhost/Home', {
        timeout: 10000
    });
}

async function takePartInProcess(browser, processName) {
    await browser
        .click('[id="' + processName + '"]');
    await browser
        .wait(1000)
        .pressKey('enter');
}

async function returnProcessToCreator(browser, comments, processName) {
    await browser
        .click('[id="' + processName + '"]');
    await browser
        .typeText('[name="comments"]', comments)
        .click('#returnToCreator1');
}

let getCurrentUrl = ClientFunction(() => window.location.href);

fixture('Full Test').page('https://localhost');

test('Stage 1 - Check There Is No Available Processes', async browser => {
    await login(browser, 'levtom@outlook.co.il');
    await browser.click('[name="myAvailableProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getAvailableActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('התהליכים הזמינים לי')
        .expect(Selector('td').innerText).eql('אין כרגע מידע בטבלה');
}).before(beforeGlobal);

test('Stage 2 - Check There Is No Pending Processes', async browser => {
    await login(browser, 'levtom@outlook.co.il');
    await browser.click('[name="myWaitingProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getWaitingActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('התהליכים הממתינים לי')
        .expect(Selector('td').innerText).eql('אין כרגע מידע בטבלה');
});

test('Stage 3 - Check There Is No Active Processes', async browser => {
    await login(browser, 'levtom@outlook.co.il');
    await browser.click('[name="myActiveProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getAllActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('התהליכים שלי')
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

test('Stage 5 - Start And Handle The Process', async browser => {
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
    await browser.expect(Selector('td').nth(5).exists).notOk();
    await handleProcess(browser, 'תהליך אישור', 'הערות של אחראי מיתוג קמפיינים', [], {
        '1': 'רמד הסברה'
    }, ['../fileTests/inputFiles/a.txt']);
});

test('Stage 6 - Check There Is An Active Process', async browser => {
    await login(browser, 'levtom@outlook.co.il');
    await browser.click('[name="myActiveProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getAllActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('התהליכים שלי')
        .expect(Selector('td').nth(0).innerText).eql('תהליך אישור')
        .expect(Selector('td').nth(1).innerText).eql('1')
        .expect(Selector('td').nth(2).innerText).eql('03/11/2020 05:00:00')
        .expect(Selector('td').nth(3).innerText).eql('- רמד הסברה');
});

test('Stage 7 - Check The Process Report', async browser => {
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
        .expect(Selector('#processCreatorName').innerText).eql('שם יוצר התהליך: קיילור נבאס')
        .expect(Selector('#processDate').innerText).eql('תאריך היעד: 03/11/2020 05:00:00')
        .expect(Selector('#processUrgency').innerText).eql('דחיפות התהליך: 1')
        .expect(Selector('#processStatus').innerText).eql('סטטוס: פעיל')
        .expect(Selector('#example tbody tr').count).eql(1)
        .expect(Selector('#example tbody tr td').nth(0).innerText).eql('קיילור נבאס - אחראי מיתוג קמפיינים')
        .expect(Selector('#example tbody tr td').nth(2).innerText).eql('הערות של אחראי מיתוג קמפיינים')

});

test('Stage 8 - Check There Is No Pending Process', async browser => {
    await login(browser, 'kutigolberg@outlook.co.il');
    await browser.click('[name="myWaitingProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getWaitingActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('התהליכים הממתינים לי')
        .expect(Selector('td').innerText).eql('אין כרגע מידע בטבלה');
});

test('Stage 9 - Check There Is An Available Process', async browser => {
    await login(browser, 'kutigolberg@outlook.co.il');
    await browser.click('[name="myAvailableProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getAvailableActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('התהליכים הזמינים לי')
        .expect(Selector('td').nth(0).innerText).eql('תהליך אישור');
});

test('Stage 10 - Take The Available Process', async browser => {
    await login(browser, 'kutigolberg@outlook.co.il');
    await browser.click('[name="myAvailableProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getAvailableActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('התהליכים הזמינים לי')
        .expect(Selector('td').nth(0).innerText).eql('תהליך אישור');
    await takePartInProcess(browser, 'תהליך אישור');
});

test('Stage 11 - Check There Is An Pending Process', async browser => {
    await login(browser, 'kutigolberg@outlook.co.il');
    await browser.click('[name="myWaitingProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getWaitingActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('התהליכים הממתינים לי')
        .expect(Selector('td').nth(0).innerText).eql('תהליך אישור');
});

test('Stage 12 - Handle The Process', async browser => {
    await login(browser, 'kutigolberg@outlook.co.il');
    await browser.click('[name="myWaitingProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getWaitingActiveProcessesByUser', {
        timeout: 10000
    });
    await handleProcess(browser, 'תהליך אישור', 'הערות של רמד הסברה', [], {
        '2': 'אחראי מיתוג קמפיינים'
    });
});

test('Stage 13 - Check The Process Report', async browser => {
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
        .expect(Selector('#processCreatorName').innerText).eql('שם יוצר התהליך: קיילור נבאס')
        .expect(Selector('#processDate').innerText).eql('תאריך היעד: 03/11/2020 05:00:00')
        .expect(Selector('#processUrgency').innerText).eql('דחיפות התהליך: 1')
        .expect(Selector('#processStatus').innerText).eql('סטטוס: פעיל')
        .expect(Selector('#example tbody tr').count).eql(2)
        .expect(Selector('#example tbody tr td').nth(0).innerText).eql('פדריקו ולוורדה - רמד הסברה')
        .expect(Selector('#example tbody tr td').nth(2).innerText).eql('הערות של רמד הסברה')

});

test('Stage 14 - Check There Is An Active Process', async browser => {
    await login(browser, 'kutigolberg@outlook.co.il');
    await browser.click('[name="myActiveProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getAllActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('התהליכים שלי')
        .expect(Selector('td').nth(0).innerText).eql('תהליך אישור')
        .expect(Selector('td').nth(1).innerText).eql('1')
        .expect(Selector('td').nth(2).innerText).eql('03/11/2020 05:00:00')
        .expect(Selector('td').nth(3).innerText).eql('קיילור נבאס - אחראי מיתוג קמפיינים');
});

test('Stage 15 - Check There Is An Pending Process', async browser => {
    await login(browser, 'levtom@outlook.co.il');
    await browser.click('[name="myWaitingProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getWaitingActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('התהליכים הממתינים לי')
        .expect(Selector('td').nth(0).innerText).eql('תהליך אישור');
});

test('Stage 16 - Handle The Process', async browser => {
    await login(browser, 'levtom@outlook.co.il');
    await browser.click('[name="myWaitingProcesses"]');
    await handleProcess(browser, 'תהליך אישור', 'הערות של אחראי מיתוג קמפיינים', ['3', '4'], {
        '3': 'אחראי רכש',
        '4': 'גרפיקאי'
    });
});

test('Stage 17 - Check The Process Report', async browser => {
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
        .expect(Selector('#processCreatorName').innerText).eql('שם יוצר התהליך: קיילור נבאס')
        .expect(Selector('#processDate').innerText).eql('תאריך היעד: 03/11/2020 05:00:00')
        .expect(Selector('#processUrgency').innerText).eql('דחיפות התהליך: 1')
        .expect(Selector('#processStatus').innerText).eql('סטטוס: פעיל')
        .expect(Selector('#example tbody tr').count).eql(3)
        .expect(Selector('#example tbody tr td').nth(0).innerText).eql('פדריקו ולוורדה - רמד הסברה')
        .expect(Selector('#example tbody tr td').nth(2).innerText).eql('הערות של רמד הסברה')

});

test('Stage 18 - Check There Is An Active Process', async browser => {
    await login(browser, 'levtom@outlook.co.il');
    await browser.click('[name="myActiveProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getAllActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('התהליכים שלי')
        .expect(Selector('td').nth(0).innerText).eql('תהליך אישור')
        .expect(Selector('td').nth(1).innerText).eql('1')
        .expect(Selector('td').nth(2).innerText).eql('03/11/2020 05:00:00')
        .expect(Selector('td').nth(3).innerText).eql('- גרפיקאי קרלוס קאסמירו - אחראי רכש');
});

test('Stage 19 - Check There Is An Pending Process', async browser => {
    await login(browser, 'levtom2@outlook.co.il');
    await browser.click('[name="myWaitingProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getWaitingActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('התהליכים הממתינים לי')
        .expect(Selector('td').nth(0).innerText).eql('תהליך אישור');
});

test('Stage 20 - Handle The Process', async browser => {
    await login(browser, 'levtom2@outlook.co.il');
    await browser.click('[name="myWaitingProcesses"]');
    await handleProcess(browser, 'תהליך אישור', 'הערות של אחראי רכש', [], {
        '5': 'רמד הסברה'
    });
});

test('Stage 21 - Check The Process Report', async browser => {
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
        .expect(Selector('#processCreatorName').innerText).eql('שם יוצר התהליך: קיילור נבאס')
        .expect(Selector('#processDate').innerText).eql('תאריך היעד: 03/11/2020 05:00:00')
        .expect(Selector('#processUrgency').innerText).eql('דחיפות התהליך: 1')
        .expect(Selector('#processStatus').innerText).eql('סטטוס: פעיל')
        .expect(Selector('#example tbody tr').count).eql(4)
        .expect(Selector('#example tbody tr td').nth(0).innerText).eql('פדריקו ולוורדה - רמד הסברה')
        .expect(Selector('#example tbody tr td').nth(2).innerText).eql('הערות של רמד הסברה')

});

test('Stage 22 - Check There Is An Active Process', async browser => {
    await login(browser, 'levtom2@outlook.co.il');
    await browser.click('[name="myActiveProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getAllActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('התהליכים שלי')
        .expect(Selector('td').nth(0).innerText).eql('תהליך אישור')
        .expect(Selector('td').nth(1).innerText).eql('1')
        .expect(Selector('td').nth(2).innerText).eql('03/11/2020 05:00:00')
        .expect(Selector('td').nth(3).innerText).eql('- גרפיקאי');
});

test('Stage 23 - Check There Is An Available Process', async browser => {
    await login(browser, 'shahar0897@outlook.com');
    await browser.click('[name="myAvailableProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getAvailableActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('התהליכים הזמינים לי')
        .expect(Selector('td').nth(0).innerText).eql('תהליך אישור');
});

test('Stage 24 - Take The Available Process', async browser => {
    await login(browser, 'shahar0897@outlook.com');
    await browser.click('[name="myAvailableProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getAvailableActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('התהליכים הזמינים לי')
        .expect(Selector('td').nth(0).innerText).eql('תהליך אישור');
    await takePartInProcess(browser, 'תהליך אישור');
});

test('Stage 25 - Check There Is An Pending Process', async browser => {
    await login(browser, 'shahar0897@outlook.com');
    await browser.click('[name="myWaitingProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getWaitingActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('התהליכים הממתינים לי')
        .expect(Selector('td').nth(0).innerText).eql('תהליך אישור');
});

test('Stage 26 - Handle The Process', async browser => {
    await login(browser, 'shahar0897@outlook.com');
    await browser.click('[name="myWaitingProcesses"]');
    await handleProcess(browser, 'תהליך אישור', 'הערות של גרפיקאי', [], {
        '5': 'רמד הסברה'
    });
});

test('Stage 27 - Check The Process Report', async browser => {
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
        .expect(Selector('#processCreatorName').innerText).eql('שם יוצר התהליך: קיילור נבאס')
        .expect(Selector('#processDate').innerText).eql('תאריך היעד: 03/11/2020 05:00:00')
        .expect(Selector('#processUrgency').innerText).eql('דחיפות התהליך: 1')
        .expect(Selector('#processStatus').innerText).eql('סטטוס: פעיל')
        .expect(Selector('#example tbody tr').count).eql(5)
        .expect(Selector('#example tbody tr td').nth(0).innerText).eql('גארת בייל - גרפיקאי')
        .expect(Selector('#example tbody tr td').nth(2).innerText).eql('הערות של גרפיקאי')

});

test('Stage 28 - Check There Is An Active Process', async browser => {
    await login(browser, 'shahar0897@outlook.com');
    await browser.click('[name="myActiveProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getAllActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('התהליכים שלי')
        .expect(Selector('td').nth(0).innerText).eql('תהליך אישור')
        .expect(Selector('td').nth(1).innerText).eql('1')
        .expect(Selector('td').nth(2).innerText).eql('03/11/2020 05:00:00')
        .expect(Selector('td').nth(3).innerText).eql('פדריקו ולוורדה - רמד הסברה');
});

test('Stage 29 - Check There Is An Pending Process', async browser => {
    await login(browser, 'kutigolberg@outlook.co.il');
    await browser.click('[name="myWaitingProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getWaitingActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('התהליכים הממתינים לי')
        .expect(Selector('td').nth(0).innerText).eql('תהליך אישור');
});

test('Stage 30 - Return Process To Creator', async browser => {
    await login(browser, 'kutigolberg@outlook.co.il');
    await browser.click('[name="myWaitingProcesses"]');
    await returnProcessToCreator(browser, 'הערות חזרה של רמד הסברה', 'תהליך אישור');
});

test('Stage 31 - Check There Is An Pending Process', async browser => {
    await login(browser, 'levtom@outlook.co.il');
    await browser.click('[name="myWaitingProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getWaitingActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('התהליכים הממתינים לי')
        .expect(Selector('td').nth(0).innerText).eql('תהליך אישור');
});

test('Stage 32 - Check There Is An Active Process', async browser => {
    await login(browser, 'levtom@outlook.co.il');
    await browser.click('[name="myActiveProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getAllActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('התהליכים שלי')
        .expect(Selector('td').nth(0).innerText).eql('תהליך אישור')
        .expect(Selector('td').nth(1).innerText).eql('1')
        .expect(Selector('td').nth(2).innerText).eql('03/11/2020 05:00:00')
        .expect(Selector('td').nth(3).innerText).eql('קיילור נבאס - אחראי מיתוג קמפיינים');
});

test('Stage 33 - Handle The Process', async browser => {
    await login(browser, 'levtom@outlook.co.il');
    await browser.click('[name="myWaitingProcesses"]');
    await handleProcess(browser, 'תהליך אישור', 'הערות של אחראי מיתוג קמפיינים', ['3', '4'], {
        '3': 'אחראי רכש',
        '4': 'גרפיקאי'
    });
});

test('Stage 34 - Check The Process Report', async browser => {
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
        .expect(Selector('#processCreatorName').innerText).eql('שם יוצר התהליך: קיילור נבאס')
        .expect(Selector('#processDate').innerText).eql('תאריך היעד: 03/11/2020 05:00:00')
        .expect(Selector('#processUrgency').innerText).eql('דחיפות התהליך: 1')
        .expect(Selector('#processStatus').innerText).eql('סטטוס: פעיל')
        .expect(Selector('#example tbody tr').count).eql(7)
        .expect(Selector('#example tbody tr td').nth(0).innerText).eql('גארת בייל - גרפיקאי')
        .expect(Selector('#example tbody tr td').nth(2).innerText).eql('הערות של גרפיקאי')

});

test('Stage 35 - Check There Is An Pending Process', async browser => {
    await login(browser, 'levtom2@outlook.co.il');
    await browser.click('[name="myWaitingProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getWaitingActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('התהליכים הממתינים לי')
        .expect(Selector('td').nth(0).innerText).eql('תהליך אישור');
});

test('Stage 36 - Handle The Process', async browser => {
    await login(browser, 'levtom2@outlook.co.il');
    await browser
        .click('[name="myWaitingProcesses"]');
    await handleProcess(browser, 'תהליך אישור', 'הערות של אחראי רכש', [], {
        '5': 'רמד הסברה'
    });
});

test('Stage 37 - Check The Process Report', async browser => {
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
        .expect(Selector('#processCreatorName').innerText).eql('שם יוצר התהליך: קיילור נבאס')
        .expect(Selector('#processDate').innerText).eql('תאריך היעד: 03/11/2020 05:00:00')
        .expect(Selector('#processUrgency').innerText).eql('דחיפות התהליך: 1')
        .expect(Selector('#processStatus').innerText).eql('סטטוס: פעיל')
        .expect(Selector('#example tbody tr').count).eql(8)
        .expect(Selector('#example tbody tr td').nth(0).innerText).eql('גארת בייל - גרפיקאי')
        .expect(Selector('#example tbody tr td').nth(2).innerText).eql('הערות של גרפיקאי')

});

test('Stage 38 - Check There Is An Active Process', async browser => {
    await login(browser, 'levtom2@outlook.co.il');
    await browser.click('[name="myActiveProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getAllActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('התהליכים שלי')
        .expect(Selector('td').nth(0).innerText).eql('תהליך אישור')
        .expect(Selector('td').nth(1).innerText).eql('1')
        .expect(Selector('td').nth(2).innerText).eql('03/11/2020 05:00:00')
        .expect(Selector('td').nth(3).innerText).eql('גארת בייל - גרפיקאי');
});

test('Stage 39 - Check There Is An Pending Process', async browser => {
    await login(browser, 'shahar0897@outlook.com');
    await browser.click('[name="myWaitingProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getWaitingActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('התהליכים הממתינים לי')
        .expect(Selector('td').nth(0).innerText).eql('תהליך אישור');
});

test('Stage 40 - Handle The Process', async browser => {
    await login(browser, 'shahar0897@outlook.com');
    await browser.click('[name="myWaitingProcesses"]');
    await handleProcess(browser, 'תהליך אישור', 'הערות של גרפיקאי', [], {
        '5': 'רמד הסברה'
    });
});

test('Stage 41 - Check The Process Report', async browser => {
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
        .expect(Selector('#processCreatorName').innerText).eql('שם יוצר התהליך: קיילור נבאס')
        .expect(Selector('#processDate').innerText).eql('תאריך היעד: 03/11/2020 05:00:00')
        .expect(Selector('#processUrgency').innerText).eql('דחיפות התהליך: 1')
        .expect(Selector('#processStatus').innerText).eql('סטטוס: פעיל')
        .expect(Selector('#example tbody tr').count).eql(9)
        .expect(Selector('#example tbody tr td').nth(0).innerText).eql('גארת בייל - גרפיקאי')
        .expect(Selector('#example tbody tr td').nth(2).innerText).eql('הערות של גרפיקאי')

});


test('Stage 42 - Check There Is An Active Process', async browser => {
    await login(browser, 'shahar0897@outlook.com');
    await browser.click('[name="myActiveProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getAllActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('התהליכים שלי')
        .expect(Selector('td').nth(0).innerText).eql('תהליך אישור')
        .expect(Selector('td').nth(1).innerText).eql('1')
        .expect(Selector('td').nth(2).innerText).eql('03/11/2020 05:00:00')
        .expect(Selector('td').nth(3).innerText).eql('פדריקו ולוורדה - רמד הסברה');
});

test('Stage 43 - Check There Is An Pending Process', async browser => {
    await login(browser, 'kutigolberg@outlook.co.il');
    await browser.click('[name="myWaitingProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getWaitingActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('התהליכים הממתינים לי')
        .expect(Selector('td').nth(0).innerText).eql('תהליך אישור');
});

test('Stage 44 - Handle The Process', async browser => {
    await login(browser, 'kutigolberg@outlook.co.il');
    await browser.click('[name="myWaitingProcesses"]');
    await handleProcess(browser, 'תהליך אישור', 'הערות של רמד הסברה', [], {
        '6': 'אחראי מיתוג קמפיינים'
    });
});

test('Stage 45 - Check The Process Report', async browser => {
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
        .expect(Selector('#processCreatorName').innerText).eql('שם יוצר התהליך: קיילור נבאס')
        .expect(Selector('#processDate').innerText).eql('תאריך היעד: 03/11/2020 05:00:00')
        .expect(Selector('#processUrgency').innerText).eql('דחיפות התהליך: 1')
        .expect(Selector('#processStatus').innerText).eql('סטטוס: פעיל')
        .expect(Selector('#example tbody tr').count).eql(10)
        .expect(Selector('#example tbody tr td').nth(0).innerText).eql('גארת בייל - גרפיקאי')
        .expect(Selector('#example tbody tr td').nth(2).innerText).eql('הערות של גרפיקאי')

});


test('Stage 46 - Check There Is An Active Process', async browser => {
    await login(browser, 'kutigolberg@outlook.co.il');
    await browser.click('[name="myActiveProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getAllActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('התהליכים שלי')
        .expect(Selector('td').nth(0).innerText).eql('תהליך אישור')
        .expect(Selector('td').nth(1).innerText).eql('1')
        .expect(Selector('td').nth(2).innerText).eql('03/11/2020 05:00:00')
        .expect(Selector('td').nth(3).innerText).eql('קיילור נבאס - אחראי מיתוג קמפיינים');
});

test('Stage 47 - Check There Is An Pending Process', async browser => {
    await login(browser, 'levtom@outlook.co.il');
    await browser.click('[name="myWaitingProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getWaitingActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('התהליכים הממתינים לי')
        .expect(Selector('td').nth(0).innerText).eql('תהליך אישור');
});

test('Stage 48 - Finish The Process', async browser => {
    await login(browser, 'levtom@outlook.co.il');
    await browser.click('[name="myWaitingProcesses"]');
    await handleProcess(browser, 'תהליך אישור', 'הערות של אחראי מיתוג קמפיינים', [], {});
});

test('Stage 49 - Check The Process Report', async browser => {
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
        .expect(Selector('#processCreatorName').innerText).eql('שם יוצר התהליך: קיילור נבאס')
        .expect(Selector('#processDate').innerText).eql('תאריך היעד: 03/11/2020 05:00:00')
        .expect(Selector('#processUrgency').innerText).eql('דחיפות התהליך: 1')
        .expect(Selector('#processStatus').innerText).eql('סטטוס: פעיל')
        .expect(Selector('#example tbody tr').count).eql(10)
        .expect(Selector('#example tbody tr td').nth(0).innerText).eql('גארת בייל - גרפיקאי')
        .expect(Selector('#example tbody tr td').nth(2).innerText).eql('הערות של גרפיקאי')

});

test('Stage 50 - Check There Is No Active Processes', async browser => {
    await login(browser, 'levtom@outlook.co.il');
    await browser.click('[name="myActiveProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getAllActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('התהליכים שלי')
        .expect(Selector('td').innerText).eql('אין כרגע מידע בטבלה');
});