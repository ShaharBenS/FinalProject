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
let activeProcessController = require('../../controllers/processesControllers/activeProcessController');
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
        processStructureController.addProcessStructure('yor@outlook.co.il', 'תהליך אישור', JSON.stringify(processStructureSankeyJSON), [], 0, "12", (err, needApproval) => {
            if (err) {
                resolve(err);
            } else {
                resolve();
            }
        });
    });
}

function generateActiveProcesses() {
    return new Promise(resolve => {
        activeProcessController.startProcessByUsername('levtom@outlook.co.il', 'תהליך אישור', 'אישור תקציב שנתי 1', new Date('2020-01-01T12:00:00'), 3, (err, result) => {
            if (err) resolve(err);
            else {
                activeProcessController.startProcessByUsername('levtom@outlook.co.il', 'תהליך אישור', 'אישור תקציב שנתי 2', new Date('2020-01-01T13:00:00'), 2, (err, result) => {
                    if (err) resolve(err);
                    else {
                        activeProcessController.startProcessByUsername('levtom@outlook.co.il', 'תהליך אישור', 'אישור פרסום', new Date('2020-01-02T12:00:00'), 1, (err, result) => {
                            if (err) resolve(err);
                            else {
                                activeProcessController.startProcessByUsername('levtom@outlook.co.il', 'תהליך אישור', 'אישור הזמנת מופע', new Date('2020-02-01T13:00:00'), 3, (err, result) => {
                                    if (err) resolve(err);
                                    else {
                                        activeProcessController.startProcessByUsername('levtom@outlook.co.il', 'תהליך אישור', 'אישור הזמנת סרט', new Date('2020-02-01T13:01:00'), 2, (err, result) => {
                                            if (err) resolve(err);
                                            else {
                                                activeProcessController.startProcessByUsername('levtom@outlook.co.il', 'תהליך אישור', 'אישור סיום עבודה אגודה', new Date('2020-03-03T12:00:00'), 1, (err, result) => {
                                                    if (err) resolve(err);
                                                    else {
                                                        resolve();
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
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
    await addUsersAndRolesTree();
    await addProcessStructure();
    await generateActiveProcesses();
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

fixture('Tables Search And Sort Test').page('https://localhost');

test('Stage 1 - Check The Everything Is In The Table And Sorted By Name', async browser => {
    await login(browser, 'levtom@outlook.co.il');
    await browser.click('[name="myActiveProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getAllActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('התהליכים שלי')
        //Line 1.
        .expect(Selector('tbody tr').nth(0).child(0).innerText).eql('אישור הזמנת מופע')
        .expect(Selector('tbody tr').nth(0).child(1).innerText).eql('3')
        .expect(Selector('tbody tr').nth(0).child(2).innerText).eql('01/02/2020 13:00:00')
        //Line 2.
        .expect(Selector('tbody tr').nth(1).child(0).innerText).eql('אישור הזמנת סרט')
        .expect(Selector('tbody tr').nth(1).child(1).innerText).eql('2')
        .expect(Selector('tbody tr').nth(1).child(2).innerText).eql('01/02/2020 13:01:00')
        //Line 3.
        .expect(Selector('tbody tr').nth(2).child(0).innerText).eql('אישור סיום עבודה אגודה')
        .expect(Selector('tbody tr').nth(2).child(1).innerText).eql('1')
        .expect(Selector('tbody tr').nth(2).child(2).innerText).eql('03/03/2020 12:00:00')
        //Line 4.
        .expect(Selector('tbody tr').nth(3).child(0).innerText).eql('אישור פרסום')
        .expect(Selector('tbody tr').nth(3).child(1).innerText).eql('1')
        .expect(Selector('tbody tr').nth(3).child(2).innerText).eql('02/01/2020 12:00:00')
        //Line 5.
        .expect(Selector('tbody tr').nth(4).child(0).innerText).eql('אישור תקציב שנתי 1')
        .expect(Selector('tbody tr').nth(4).child(1).innerText).eql('3')
        .expect(Selector('tbody tr').nth(4).child(2).innerText).eql('01/01/2020 12:00:00')
        //Line 6.
        .expect(Selector('tbody tr').nth(5).child(0).innerText).eql('אישור תקציב שנתי 2')
        .expect(Selector('tbody tr').nth(5).child(1).innerText).eql('2')
        .expect(Selector('tbody tr').nth(5).child(2).innerText).eql('01/01/2020 13:00:00');

}).before(beforeGlobal);

test('Stage 2 - Check The Everything Is In The Table And Reversed Sorted By Name', async browser => {
    await login(browser, 'levtom@outlook.co.il');
    await browser.click('[name="myActiveProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getAllActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('התהליכים שלי')
        .click(Selector('thead tr th').nth(0))
        .wait(1000)
        //Line 1.
        .expect(Selector('tbody tr').nth(0).child(0).innerText).eql('אישור תקציב שנתי 2')
        .expect(Selector('tbody tr').nth(0).child(1).innerText).eql('2')
        .expect(Selector('tbody tr').nth(0).child(2).innerText).eql('01/01/2020 13:00:00')
        //Line 2.
        .expect(Selector('tbody tr').nth(1).child(0).innerText).eql('אישור תקציב שנתי 1')
        .expect(Selector('tbody tr').nth(1).child(1).innerText).eql('3')
        .expect(Selector('tbody tr').nth(1).child(2).innerText).eql('01/01/2020 12:00:00')
        //Line 3.
        .expect(Selector('tbody tr').nth(2).child(0).innerText).eql('אישור פרסום')
        .expect(Selector('tbody tr').nth(2).child(1).innerText).eql('1')
        .expect(Selector('tbody tr').nth(2).child(2).innerText).eql('02/01/2020 12:00:00')
        //Line 4.
        .expect(Selector('tbody tr').nth(3).child(0).innerText).eql('אישור סיום עבודה אגודה')
        .expect(Selector('tbody tr').nth(3).child(1).innerText).eql('1')
        .expect(Selector('tbody tr').nth(3).child(2).innerText).eql('03/03/2020 12:00:00')
        //Line 5.
        .expect(Selector('tbody tr').nth(4).child(0).innerText).eql('אישור הזמנת סרט')
        .expect(Selector('tbody tr').nth(4).child(1).innerText).eql('2')
        .expect(Selector('tbody tr').nth(4).child(2).innerText).eql('01/02/2020 13:01:00')
        //Line 6.
        .expect(Selector('tbody tr').nth(5).child(0).innerText).eql('אישור הזמנת מופע')
        .expect(Selector('tbody tr').nth(5).child(1).innerText).eql('3')
        .expect(Selector('tbody tr').nth(5).child(2).innerText).eql('01/02/2020 13:00:00');
});

test('Stage 3 - Check The Everything Is In The Table And Sorted By Urgency', async browser => {
    await login(browser, 'levtom@outlook.co.il');
    await browser.click('[name="myActiveProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getAllActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('התהליכים שלי')
        .click(Selector('thead tr th').nth(1))
        .wait(1000)
        //Line 1.
        .expect(Selector('tbody tr').nth(0).child(0).innerText).eql('אישור סיום עבודה אגודה')
        .expect(Selector('tbody tr').nth(0).child(1).innerText).eql('1')
        .expect(Selector('tbody tr').nth(0).child(2).innerText).eql('03/03/2020 12:00:00')
        //Line 2.
        .expect(Selector('tbody tr').nth(1).child(0).innerText).eql('אישור פרסום')
        .expect(Selector('tbody tr').nth(1).child(1).innerText).eql('1')
        .expect(Selector('tbody tr').nth(1).child(2).innerText).eql('02/01/2020 12:00:00')
        //Line 3.
        .expect(Selector('tbody tr').nth(2).child(0).innerText).eql('אישור הזמנת סרט')
        .expect(Selector('tbody tr').nth(2).child(1).innerText).eql('2')
        .expect(Selector('tbody tr').nth(2).child(2).innerText).eql('01/02/2020 13:01:00')
        //Line 4.
        .expect(Selector('tbody tr').nth(3).child(0).innerText).eql('אישור תקציב שנתי 2')
        .expect(Selector('tbody tr').nth(3).child(1).innerText).eql('2')
        .expect(Selector('tbody tr').nth(3).child(2).innerText).eql('01/01/2020 13:00:00')
        //Line 5.
        .expect(Selector('tbody tr').nth(4).child(0).innerText).eql('אישור הזמנת מופע')
        .expect(Selector('tbody tr').nth(4).child(1).innerText).eql('3')
        .expect(Selector('tbody tr').nth(4).child(2).innerText).eql('01/02/2020 13:00:00')
        //Line 6.
        .expect(Selector('tbody tr').nth(5).child(0).innerText).eql('אישור תקציב שנתי 1')
        .expect(Selector('tbody tr').nth(5).child(1).innerText).eql('3')
        .expect(Selector('tbody tr').nth(5).child(2).innerText).eql('01/01/2020 12:00:00');
});

test('Stage 4 - Check The Everything Is In The Table And Reversed Sorted By Urgency', async browser => {
    await login(browser, 'levtom@outlook.co.il');
    await browser.click('[name="myActiveProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getAllActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('התהליכים שלי')
        .click(Selector('thead tr th').nth(1))
        .click(Selector('thead tr th').nth(1))
        .wait(1000)
        //Line 1.
        .expect(Selector('tbody tr').nth(0).child(0).innerText).eql('אישור הזמנת מופע')
        .expect(Selector('tbody tr').nth(0).child(1).innerText).eql('3')
        .expect(Selector('tbody tr').nth(0).child(2).innerText).eql('01/02/2020 13:00:00')
        //Line 2.
        .expect(Selector('tbody tr').nth(1).child(0).innerText).eql('אישור תקציב שנתי 1')
        .expect(Selector('tbody tr').nth(1).child(1).innerText).eql('3')
        .expect(Selector('tbody tr').nth(1).child(2).innerText).eql('01/01/2020 12:00:00')
        //Line 3.
        .expect(Selector('tbody tr').nth(2).child(0).innerText).eql('אישור הזמנת סרט')
        .expect(Selector('tbody tr').nth(2).child(1).innerText).eql('2')
        .expect(Selector('tbody tr').nth(2).child(2).innerText).eql('01/02/2020 13:01:00')
        //Line 4.
        .expect(Selector('tbody tr').nth(3).child(0).innerText).eql('אישור תקציב שנתי 2')
        .expect(Selector('tbody tr').nth(3).child(1).innerText).eql('2')
        .expect(Selector('tbody tr').nth(3).child(2).innerText).eql('01/01/2020 13:00:00')
        //Line 5.
        .expect(Selector('tbody tr').nth(4).child(0).innerText).eql('אישור סיום עבודה אגודה')
        .expect(Selector('tbody tr').nth(4).child(1).innerText).eql('1')
        .expect(Selector('tbody tr').nth(4).child(2).innerText).eql('03/03/2020 12:00:00')
        //Line 6.
        .expect(Selector('tbody tr').nth(5).child(0).innerText).eql('אישור פרסום')
        .expect(Selector('tbody tr').nth(5).child(1).innerText).eql('1')
        .expect(Selector('tbody tr').nth(5).child(2).innerText).eql('02/01/2020 12:00:00');
});

test('Stage 5 - Check The Everything Is In The Table And Sorted By Destination Date', async browser => {
    await login(browser, 'levtom@outlook.co.il');
    await browser.click('[name="myActiveProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getAllActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('התהליכים שלי')
        .click(Selector('thead tr th').nth(2))
        .wait(1000)
        //Line 1.
        .expect(Selector('tbody tr').nth(0).child(0).innerText).eql('אישור תקציב שנתי 1')
        .expect(Selector('tbody tr').nth(0).child(1).innerText).eql('3')
        .expect(Selector('tbody tr').nth(0).child(2).innerText).eql('01/01/2020 12:00:00')
        //Line 2.
        .expect(Selector('tbody tr').nth(1).child(0).innerText).eql('אישור תקציב שנתי 2')
        .expect(Selector('tbody tr').nth(1).child(1).innerText).eql('2')
        .expect(Selector('tbody tr').nth(1).child(2).innerText).eql('01/01/2020 13:00:00')
        //Line 3.
        .expect(Selector('tbody tr').nth(2).child(0).innerText).eql('אישור הזמנת מופע')
        .expect(Selector('tbody tr').nth(2).child(1).innerText).eql('3')
        .expect(Selector('tbody tr').nth(2).child(2).innerText).eql('01/02/2020 13:00:00')
        //Line 4.
        .expect(Selector('tbody tr').nth(3).child(0).innerText).eql('אישור הזמנת סרט')
        .expect(Selector('tbody tr').nth(3).child(1).innerText).eql('2')
        .expect(Selector('tbody tr').nth(3).child(2).innerText).eql('01/02/2020 13:01:00')
        //Line 5.
        .expect(Selector('tbody tr').nth(4).child(0).innerText).eql('אישור פרסום')
        .expect(Selector('tbody tr').nth(4).child(1).innerText).eql('1')
        .expect(Selector('tbody tr').nth(4).child(2).innerText).eql('02/01/2020 12:00:00')
        //Line 6.
        .expect(Selector('tbody tr').nth(5).child(0).innerText).eql('אישור סיום עבודה אגודה')
        .expect(Selector('tbody tr').nth(5).child(1).innerText).eql('1')
        .expect(Selector('tbody tr').nth(5).child(2).innerText).eql('03/03/2020 12:00:00');
});

test('Stage 6 - Check The Everything Is In The Table And Reversed Sorted By Destination Date', async browser => {
    await login(browser, 'levtom@outlook.co.il');
    await browser.click('[name="myActiveProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getAllActiveProcessesByUser', {
        timeout: 10000
    })
        .expect(Selector('h1').innerText).eql('התהליכים שלי')
        .click(Selector('thead tr th').nth(2))
        .click(Selector('thead tr th').nth(2))
        .wait(1000)
        //Line 1.
        .expect(Selector('tbody tr').nth(0).child(0).innerText).eql('אישור סיום עבודה אגודה')
        .expect(Selector('tbody tr').nth(0).child(1).innerText).eql('1')
        .expect(Selector('tbody tr').nth(0).child(2).innerText).eql('03/03/2020 12:00:00')
        //Line 2.
        .expect(Selector('tbody tr').nth(1).child(0).innerText).eql('אישור פרסום')
        .expect(Selector('tbody tr').nth(1).child(1).innerText).eql('1')
        .expect(Selector('tbody tr').nth(1).child(2).innerText).eql('02/01/2020 12:00:00')
        //Line 3.
        .expect(Selector('tbody tr').nth(2).child(0).innerText).eql('אישור הזמנת סרט')
        .expect(Selector('tbody tr').nth(2).child(1).innerText).eql('2')
        .expect(Selector('tbody tr').nth(2).child(2).innerText).eql('01/02/2020 13:01:00')
        //Line 4.
        .expect(Selector('tbody tr').nth(3).child(0).innerText).eql('אישור הזמנת מופע')
        .expect(Selector('tbody tr').nth(3).child(1).innerText).eql('3')
        .expect(Selector('tbody tr').nth(3).child(2).innerText).eql('01/02/2020 13:00:00')
        //Line 5.
        .expect(Selector('tbody tr').nth(4).child(0).innerText).eql('אישור תקציב שנתי 2')
        .expect(Selector('tbody tr').nth(4).child(1).innerText).eql('2')
        .expect(Selector('tbody tr').nth(4).child(2).innerText).eql('01/01/2020 13:00:00')
        //Line 6.
        .expect(Selector('tbody tr').nth(5).child(0).innerText).eql('אישור תקציב שנתי 1')
        .expect(Selector('tbody tr').nth(5).child(1).innerText).eql('3')
        .expect(Selector('tbody tr').nth(5).child(2).innerText).eql('01/01/2020 12:00:00');
});

test('Stage 7 - Search Process By Name', async browser => {
    await login(browser, 'levtom@outlook.co.il');
    await browser.click('[name="myActiveProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getAllActiveProcessesByUser', {
        timeout: 10000
    });
    await browser
        .click(Selector('#example_filter input'))
        .typeText('[class="form-control form-control-sm"]', 'אישור פרסום');
    await browser
        .expect(Selector('h1').innerText).eql('התהליכים שלי')
        //Line 1.
        .expect(Selector('tbody tr').nth(0).child(0).innerText).eql('אישור פרסום')
        .expect(Selector('tbody tr').nth(0).child(1).innerText).eql('1')
        .expect(Selector('tbody tr').nth(0).child(2).innerText).eql('02/01/2020 12:00:00');
    await browser
        .click(Selector('#example_filter input'))
        .pressKey('ctrl+a delete')
        .typeText('[class="form-control form-control-sm"]', 'אישור תקציב שנתי');
    await browser
        .expect(Selector('h1').innerText).eql('התהליכים שלי')
        //Line 1.
        .expect(Selector('tbody tr').nth(0).child(0).innerText).eql('אישור תקציב שנתי 1')
        .expect(Selector('tbody tr').nth(0).child(1).innerText).eql('3')
        .expect(Selector('tbody tr').nth(0).child(2).innerText).eql('01/01/2020 12:00:00')
        //Line 2.
        .expect(Selector('tbody tr').nth(1).child(0).innerText).eql('אישור תקציב שנתי 2')
        .expect(Selector('tbody tr').nth(1).child(1).innerText).eql('2')
        .expect(Selector('tbody tr').nth(1).child(2).innerText).eql('01/01/2020 13:00:00');
});


test('Stage 8 - Search Process By Destination Date', async browser => {
    await login(browser, 'levtom@outlook.co.il');
    await browser.click('[name="myActiveProcesses"]');
    await browser.expect(getCurrentUrl()).eql('https://localhost/activeProcesses/getAllActiveProcessesByUser', {
        timeout: 10000
    });
    await browser
        .click(Selector('#example_filter input'))
        .typeText('[class="form-control form-control-sm"]', '01/02/2020 13:00:00');
    await browser
        .expect(Selector('h1').innerText).eql('התהליכים שלי')
        .expect(Selector('tbody tr').nth(0).child(0).innerText).eql('אישור הזמנת מופע')
        .expect(Selector('tbody tr').nth(0).child(1).innerText).eql('3')
        .expect(Selector('tbody tr').nth(0).child(2).innerText).eql('01/02/2020 13:00:00');
});