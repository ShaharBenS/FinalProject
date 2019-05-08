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

fixture('Login Test').page('https://localhost:3000/').before(beforeGlobal);

test('Create todo', async browser => {
    await browser
        .click('#login_button');
    await browser
        .typeText('[name="loginfmt"]', 'levtom@outlook.co.il')
        .pressKey('enter');
    await browser
        .typeText('[name="passwd"]', 'tomer8108')
        .pressKey('enter');
    await  browser
        .click('[name=treeEdit]');
    await browser.expect(getCurrentUrl()).eql('https://localhost:3000/Home', {timeout: 5000});
});