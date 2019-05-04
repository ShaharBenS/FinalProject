let usersAndRolesController = require('../../controllers/usersControllers/usersAndRolesController');
let processStructureController = require('../../controllers/processesControllers/processStructureController');
let processStructureAccessor = require('../../models/accessors/processStructureAccessor');
let mongoose = require('mongoose');
let mocha = require('mocha');
let describe = mocha.describe;
let it = mocha.it;
let assert = require('chai').assert;
let fs = require("fs");

let globalBefore = async function ()
{
    mongoose.set('useCreateIndex', true);
    await mongoose.connect('mongodb://localhost:27017/Tests', {useNewUrlParser: true});
    mongoose.connection.db.dropDatabase();
};

let globalAfter = function ()
{
    mongoose.connection.close();
};


describe('1. processStructureController', function ()
{
    before(globalBefore);
    after(globalAfter);

    let tree9 = fs.readFileSync("./test/inputs/trees/tree9/tree9.json");

    let processStructure1 = fs.readFileSync("./test/inputs/processStructures/processStructure1/processStructure1.json");
    let processStructure5 = fs.readFileSync("./test/inputs/processStructures/processStructure5/processStructure5.json");
    let processStructure6 = fs.readFileSync("./test/inputs/processStructures/processStructure6/processStructure6.json");
    let processStructure8 = fs.readFileSync("./test/inputs/processStructures/processStructure8/processStructure8.json");
    let processStructure9 = fs.readFileSync("./test/inputs/processStructures/processStructure9/processStructure9.json");

    it('1.0 setting up tree', function (done)
    {
        usersAndRolesController.getUsersAndRolesTree(() =>
        {
            usersAndRolesController.setUsersAndRolesTree("creator@gmail.com", tree9, {
                    "יו\"ר": ["yor@outlook.com"],
                    "סיו\"ר": ["sayor@outlook.com"],
                    "רמ\"ד כספים": ["cesef@outlook.com"],
                    "רמ\"ד אקדמיה": ["academy@outlook.com"],
                    "רמ\"ד הסברה": ["hasbara@outlook.com"],
                    "רמ\"ד מעורבות": ["meoravut@outlook.com"],
                    "מנהל/ת רווחה": ["revaha@outlook.com"],
                    "מנהלת גרפיקה": ["graphics@outlook.com"],
                    "רכז ניו מדיה": ["new_media@outlook.com", "new_media2@outlook.com", "new_media3@outlook.com"],
                    "מנהל/ת אתר אינטרנט": ["website@outlook.com"],
                    "מנהל/ת מיזמים אקדמים": ["meizamim@outlook.com"]
                },
                {
                    "yor@outlook.com": "אלף בית",
                    "sayor@outlook.com": "בית גימל",
                    "cesef@outlook.com": "גימל דלת",
                    "academy@outlook.com": "דלת היי",
                    "hasbara@outlook.com": "היי וו",
                    "meoravut@outlook.com": "וו זין",
                    "revaha@outlook.com": "זין חית",
                    "graphics@outlook.com": "חית טת",
                    "meizamim@outlook.com": "טת יוד",
                    "new_media@outlook.com": "יוד כף",
                    "new_media2@outlook.com": "יוד כף למד",
                    "new_media3@outlook.com": "כף למד מם",
                    "website@outlook.com": "כף למד"
                },
                {
                    "יו\"ר": "5",
                    "סיו\"ר": "4",
                    "רמ\"ד כספים": "3",
                    "רמ\"ד אקדמיה": "3",
                    "רמ\"ד הסברה": "3",
                    "רמ\"ד מעורבות": "3",
                    "מנהל/ת רווחה": "2",
                    "מנהלת גרפיקה": "2",
                    "רכז ניו מדיה": "1",
                    "מנהל/ת אתר אינטרנט": "2",
                    "מנהל/ת מיזמים אקדמים": "2"
                }, (err) =>
                {
                    if (err) {
                        done(err);
                    }
                    else {
                        done();
                    }
                })
        });
    }).timeout(10000);

    it('1.1 addProcessStructure', function (done)
    {
        processStructureController.addProcessStructure("creator@gmail.com", "PS 1", processStructure1, [], "24", "12", (err, needApprove) =>
        {
            assert.deepEqual(err, 'שגיאה: אין שלבים (צריך לפחות אחד)');
            processStructureController.addProcessStructure("creator@gmail.com", "PS 5", processStructure5, [], "24", "12", (err, needApprove) =>
            {
                assert.deepEqual(err, 'שגיאה: יש יותר מזרימה אחת בגרף');
                processStructureController.addProcessStructure("creator@gmail.com", "PS 8", processStructure8, [], "24", "12", (err, needApprove) =>
                {
                    assert.deepEqual(err, 'שגיאה: יש יותר מחיבור אחד בין 2 שלבים');
                    processStructureController.addProcessStructure("creator@gmail.com", "PS 6", processStructure6, [], "24", "12", (err, needApprove) =>
                    {
                        assert.deepEqual(err, 'שגיאה: המבנה מכיל מעגלים');
                        processStructureController.addProcessStructure("creator@gmail.com", "PS 9", processStructure9, [], "24", "12", (err, needApprove) =>
                        {
                            if (err) {
                                done(err);
                            }
                            else {
                                processStructureAccessor.findProcessStructure({structureName: "PS 9"}, (err, structure) =>
                                {
                                    if (err) {
                                        done(err);
                                    }
                                    else {
                                        assert.deepEqual(structure.stages.length, 10);
                                        assert.deepEqual(structure.notificationTime, 12);
                                        processStructureController.addProcessStructure("creator@gmail.com", "PS 9.1", processStructure9, [], "48", "24", (err, needApprove) =>
                                        {
                                            if (err) {
                                                done(err);
                                            }
                                            else {
                                                processStructureAccessor.findProcessStructure({structureName: "PS 9.1"}, (err, structure) =>
                                                {
                                                    if (err) {
                                                        done(err);
                                                    }
                                                    else {
                                                        assert.deepEqual(structure.stages.length, 10);
                                                        assert.deepEqual(structure.notificationTime, 24);
                                                        done();
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    });
                });
            });
        });
    }).timeout(10000);

    it('1.2 editProcessStructure', function (done)
    {
        processStructureController.editProcessStructure("creator@gmail.com", "PS 9", processStructure9, [], "48", "24", (err) =>
        {
            if (err) {
                done(err);
            }
            else {
                processStructureAccessor.findProcessStructure({structureName: "PS 9"}, (err, structure) =>
                {
                    if (err) {
                        done(err);
                    }
                    else {
                        assert.deepEqual(structure.stages.length, 10);
                        assert.deepEqual(structure.notificationTime, 24);
                        done();
                    }
                });
            }
        });
    }).timeout(10000);

    it('1.3 getProcessStructure', function (done)
    {
        processStructureController.getProcessStructure("PS 9", (err, structure) =>
        {
            if (err) {
                done(err);
            }
            else {
                assert.deepEqual(structure.stages.length, 10);
                assert.deepEqual(structure.notificationTime, 24);
                done();
            }
        });
    }).timeout(10000);

    it('1.4 getAllProcessStructures', function (done)
    {
        processStructureController.getAllProcessStructures((err, structures) =>
        {
            if (err) {
                done(err);
            }
            else {
                assert.deepEqual(structures.length, 2);
                assert.deepEqual(true, structures.some(structure =>
                {
                    return structure.structureName === "PS 9.1";
                }));
                done();
            }
        });
    }).timeout(10000);

    it('1.5 removeProcessStructure', function (done)
    {
        processStructureController.removeProcessStructure("creator@gmail.com", "PS 9", (err) =>
        {
            if (err) {
                done(err);
            }
            processStructureAccessor.findProcessStructure({structureName: "PS 9"}, (err, structure) =>
            {
                if (err) {
                    done(err);
                }
                else {
                    assert.deepEqual(structure, null);
                    done();
                }
            });
        });
    });

    it('1.6 getAllProcessStructuresTakenNames', function (done)
    {
        processStructureController.addProcessStructure("yor@outlook.com", "PS APPROVE", processStructure9, [], "24", "12", (err, needApprove) =>
        {
            assert.deepEqual(needApprove, "approval");
            processStructureController.getAllProcessStructuresTakenNames((err, structures) =>
            {
                if (err) {
                    done(err);
                }
                else {
                    assert.deepEqual(structures.length, 2);
                    assert.deepEqual(true, structures.some(structure =>
                    {
                        return structure === "PS APPROVE";
                    }));
                    done();
                }
            });
        });
    });

    it('1.7 setProcessStructuresUnavailable', function (done)
    {
        usersAndRolesController.getRoleIdByUsername("meizamim@outlook.com", (err, roleID) =>
        {
            processStructureController.setProcessStructuresUnavailable([roleID], ["מנהל/ת מיזמים אקדמים"], [], (err) =>
            {
                if (err) {
                    done(err);
                }
                else {
                    processStructureController.getProcessStructure("PS 9.1", (err, processStructure) =>
                    {
                        if (err) {
                            done(err);
                        }
                        else {
                            processStructureController.editProcessStructure("creator@gmail.com", "PS 9.1", processStructure.sankey, [], processStructure.automaticAdvanceTime, processStructure.notificationTime, (err) =>
                            {
                                let sankeyArray = JSON.parse(processStructure.sankey).content.diagram;
                                sankeyArray.forEach(element =>
                                {
                                    if (element.type === "sankey.shape.State") {
                                        if (element.labels[0].text === "מנהל/ת מיזמים אקדמים") {
                                            assert.deepEqual(element.bgColor.toLowerCase(), "#ff1100");
                                        }
                                    }
                                });
                                done();
                            });
                        }
                    });
                }
            });
        });
    });
});