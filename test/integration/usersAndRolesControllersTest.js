let usersAndRolesController = require('../../controllers/usersControllers/usersAndRolesController');
let usersAccessor = require('../../models/accessors/usersAccessor');
let mongoose = require('mongoose');
let mocha = require('mocha');
let describe = mocha.describe;
let it = mocha.it;
let assert = require('chai').assert;
let fs = require("fs");

let globalBefore = async function () {
    mongoose.set('useCreateIndex', true);
    await mongoose.connect('mongodb://localhost:27017/Tests', {useNewUrlParser: true});
    mongoose.connection.db.dropDatabase();
};

let globalAfter = function () {
    mongoose.connection.close();
};


describe('1. usersAndRolesController', function () {
    before(globalBefore);
    after(globalAfter);
    let tree1 = fs.readFileSync("./test/inputs/trees/tree1/tree1.json");
    let tree2 = fs.readFileSync("./test/inputs/trees/tree2/tree2.json");
    let tree3 = fs.readFileSync("./test/inputs/trees/tree3/tree3.json");
    let tree4 = fs.readFileSync("./test/inputs/trees/tree4/tree4.json");
    let tree5 = fs.readFileSync("./test/inputs/trees/tree5/tree5.json");
    let tree6 = fs.readFileSync("./test/inputs/trees/tree6/tree6.json");
    let tree7 = fs.readFileSync("./test/inputs/trees/tree7/tree7.json");
    let tree8 = fs.readFileSync("./test/inputs/trees/tree8/tree8.json");
    let tree9 = fs.readFileSync("./test/inputs/trees/tree9/tree9.json");

    it('1.0 setUsersAndRolesTree', function (done) {
        usersAndRolesController.getUsersAndRolesTree(() => {
            usersAndRolesController.setUsersAndRolesTree("creator@gmail.com", tree1, {}, {}, {}, (err) => {
                assert.deepEqual('שגיאה: חייב להיות לפחות תפקיד אחד בעץ.', err);
                usersAndRolesController.setUsersAndRolesTree("creator@gmail.com", tree4, {
                    "AA": ["A@GMAIL.com"],
                    "BB": ["B@GMAIL.com"],
                    "CC": ["C@GMAIL.com"],
                    "DD": ["D@GMAIL.com"],
                    "EE": ["E@GMAIL.com"],
                }, {}, {}, (err) => {
                    assert.deepEqual('שגיאה: העץ מכיל מעגלים.', err);
                    usersAndRolesController.setUsersAndRolesTree("creator@gmail.com", tree5, {
                        "AA": ["A@GMAIL.com"],
                        "BB": ["B@GMAIL.com"],
                        "CC": ["C@GMAIL.com"],
                        "DD": ["D@GMAIL.com"],
                        "EE": ["E@GMAIL.com"],
                        "FF": ["F@GMAIL.com"],
                        "GG": ["G@GMAIL.com"],
                    }, {}, {}, (err) => {
                        assert.deepEqual('שגיאה: יש יותר מעץ אחד.', err);
                        usersAndRolesController.setUsersAndRolesTree("creator@gmail.com", tree8, {
                            "AA": ["A@GMAIL.com"],
                            "BB": ["B@GMAIL.com"],
                            "CC": [],
                            "DD": ["D@GMAIL.com"],
                            "EE": ["E1@GMAIL.com", "E2@GMAIL.com", "E3@GMAIL.com"],
                            "FF": ["F@GMAIL.com"],
                            "GG": ["G@GMAIL.com"],
                        }, {
                            "A@GMAIL.com": "A B",
                            "B@GMAIL.com": "B C",
                            "C@GMAIL.com": "C D",
                            "D@GMAIL.com": "D E",
                            "E@GMAIL.com": "E F",
                            "F@GMAIL.com": "F G",
                            "G@GMAIL.com": "G H",
                        }, {
                            "AA": "5",
                            "BB": "4",
                            "CC": "3",
                            "DD": "3",
                            "EE": "2",
                            "FF": "2",
                            "GG": "2",
                        }, (err) => {
                            assert.deepEqual(err, 'שגיאה: לכל תפקיד חייב היות מקושר לפחות עובד אחד.');
                            usersAndRolesController.setUsersAndRolesTree("creator@gmail.com", tree8, {
                                "AA": ["A@GMAIL.com"],
                                "BB": ["B@GMAIL.com"],
                                "CC": ["C1@GMAIL.com", "C2@GMAIL.com"],
                                "DD": ["D@GMAIL.com"],
                                "EE": ["E1@GMAIL.com", "E2@GMAIL.com", "E3@GMAIL.com"],
                                "FF": ["F@GMAIL.com"],
                                "GG": ["G@GMAIL.com"],
                            }, {
                                "A@GMAIL.com": "A B",
                                "B@GMAIL.com": "B C",
                                "C1@GMAIL.com": "C1 D",
                                "C2@GMAIL.com": "C2 D",
                                "D@GMAIL.com": "D E",
                                "E1@GMAIL.com": "E1 F",
                                "E2@GMAIL.com": "E2 F",
                                "E3@GMAIL.com": "E3 F",
                                "F@GMAIL.com": "F G",
                                "G@GMAIL.com": "G H",
                            }, {
                                "AA": "5",
                                "BB": "4",
                                "CC": "3",
                                "DD": "3",
                                "EE": "2",
                                "FF": "2",
                                "GG": "2",
                            }, (err) => {
                                if (err) {
                                    done(err);
                                } else {
                                    done();
                                }
                            });
                        });
                    });
                });
            });
        });
    }).timeout(30000);

    it('1.1 getRoleToEmails', function (done) {
        usersAndRolesController.getRoleToEmails((err, roleToEmails) => {
            if (err) {
                done(err);
            } else {
                assert.deepEqual(roleToEmails, {
                    "AA": ["A@GMAIL.com"],
                    "BB": ["B@GMAIL.com"],
                    "CC": ["C1@GMAIL.com", "C2@GMAIL.com"],
                    "DD": ["D@GMAIL.com"],
                    "EE": ["E1@GMAIL.com", "E2@GMAIL.com", "E3@GMAIL.com"],
                    "FF": ["F@GMAIL.com"],
                    "GG": ["G@GMAIL.com"],
                });
                done();
            }
        });
    });

    it('1.2 getRoleToDereg', function (done) {
        usersAndRolesController.getRoleToDereg((err, roleToDereg) => {
            if (err) {
                done(err);
            } else {
                assert.deepEqual(roleToDereg, {
                    "AA": "5",
                    "BB": "4",
                    "CC": "3",
                    "DD": "3",
                    "EE": "2",
                    "FF": "2",
                    "GG": "2",
                });
                done();
            }
        });
    });

    it('1.3 getEmailToFullName', function (done) {
        usersAndRolesController.getEmailToFullName((err, emailToFullName) => {
            if (err) {
                done(err);
            } else {
                assert.deepEqual(emailToFullName, {
                    "A@GMAIL.com": "A B",
                    "B@GMAIL.com": "B C",
                    "C1@GMAIL.com": "C1 D",
                    "C2@GMAIL.com": "C2 D",
                    "D@GMAIL.com": "D E",
                    "E1@GMAIL.com": "E1 F",
                    "E2@GMAIL.com": "E2 F",
                    "E3@GMAIL.com": "E3 F",
                    "F@GMAIL.com": "F G",
                    "G@GMAIL.com": "G H",
                });
                done();
            }
        });
    });

    it('1.4 getIdToRole', function (done) {
        usersAndRolesController.getIdToRole((err, idToRole) => {
            if (err) {
                done(err);
            } else {
                assert.deepEqual(idToRole["36fafcc6-d39f-4588-2b88-7f1c305b4118"], "AA");
                assert.deepEqual(idToRole["d4afa59c-93f1-3205-4af5-b57f24e0aac7"], "BB");
                assert.deepEqual(idToRole["e255c7ac-8073-f5e5-43ec-f8f56ce4adaa"], "CC");
                assert.deepEqual(idToRole["3bf7e4e7-3225-b9c8-9f13-1abc15dd009e"], "DD");
                done();
            }
        });
    });

    it('1.7 getAllRoles', function (done) {
        usersAndRolesController.getAllRoles((err, roles) => {
            if (err) {
                done(err);
            } else {
                assert.deepEqual(roles.map(role => role.roleName), [
                    "GG",
                    "FF",
                    "EE",
                    "DD",
                    "CC",
                    "BB",
                    "AA",
                ]);
                done();
            }
        });
    });

    it('1.8 getUsersAndRolesTree', function (done) {
        usersAndRolesController.getUsersAndRolesTree((err, sankey) => {
            if (err) {
                done(err);
            } else {
                assert.deepEqual(JSON.parse(sankey.sankey), JSON.parse(tree8));
                done();
            }
        });
    });

    it('1.9 setUsersAndRolesTree', function (done) {
        usersAndRolesController.setUsersAndRolesTree("A@GMAIL.com", tree9, {}, {}, {}, (err) => {
            assert.deepEqual('שגיאה: אין לך את ההרשאות המתאימות לעריכת עץ המשתמשים.', err);
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
            }, {
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
            }, {
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
            }, (err) => {
                if (err) {
                    done(err);
                } else {
                    done();
                }
            })
        })
    });

    it('1.11 getRoleIdByUsername', function (done) {
        usersAccessor.findRole({}, (err, roles) => {
            if (err) {
                done(err);
            } else {
                usersAndRolesController.getRoleIdByUsername("meoravut@outlook.com", (err, roleId) => {
                    roles.forEach(role => {
                        if (role._id.toString() === roleId.toString()) {
                            assert.deepEqual(role.userEmail.includes("meoravut@outlook.com"), true);
                            usersAndRolesController.getRoleIdByUsername("new_media2@outlook.com", (err, roleId) => {
                                roles.forEach(role => {
                                    if (role._id.toString() === roleId.toString()) {
                                        assert.deepEqual(role.userEmail.includes("new_media2@outlook.com"), true);
                                    }
                                });
                                done();
                            });
                        }
                    })
                });
            }
        });
    });

    it('1.12 getRoleByUsername', function (done) {
        usersAccessor.findRole({}, (err, roles) => {
            if (err) {
                done(err);
            } else {
                usersAndRolesController.getRoleByUsername("new_media3@outlook.com", (err, role) => {
                    if (err) {
                        done(err);
                    } else {
                        roles.forEach(_role => {
                            if (_role._id.toString() === role.roleID.toString()) {
                                assert.deepEqual(_role.userEmail.includes("new_media3@outlook.com"), true);
                                assert.deepEqual(_role.dereg,"1")
                            }
                        });
                        done();
                    }
                });
            }
        });
    });

    it('1.13 getRoleNameByRoleID', function (done) {
        usersAccessor.findRole({}, (err, roles) => {
            if (err) {
                done(err);
            } else {
                roles.reduce((prev,role)=>{
                    return (err)=>{
                        if(err){
                            prev(err);
                        }
                        else{
                            usersAndRolesController.getRoleNameByRoleID(role._id,(err,roleName)=>{
                                if(err){
                                    prev(err);
                                }
                                assert.deepEqual(roleName,role.roleName);
                                prev(null);
                            });
                        }
                    }
                },(err)=>{
                    if(err){
                        done(err);
                    }
                    else{
                        done(null);
                    }
                })(null);
            }
        });
    });

    it('1.14 findAdmins', function (done) {
        usersAndRolesController.findAdmins((err,admins)=>{
             assert.deepEqual(admins,["creator@gmail.com"]);
             done();
        });
    });

    it('1.15 getRoleNameByUsername', function (done) {
        usersAndRolesController.getRoleNameByUsername("meoravut@outlook.com",(err,roleName)=>{
            assert.deepEqual(roleName,"רמ\"ד מעורבות");
            usersAndRolesController.getRoleNameByUsername("meizamim@outlook.com",(err,roleName)=>{
                assert.deepEqual(roleName,"מנהל/ת מיזמים אקדמים");
                done();
            });
        });
    });

    it('1.16 getEmailsByRoleId', function (done) {
        usersAccessor.findRole({}, (err, roles) => {
            if (err) {
                done(err);
            } else {
                roles.reduce((prev,role)=>{
                    return (err)=>{
                        if(err){
                            prev(err);
                        }
                        else{
                            usersAndRolesController.getEmailsByRoleId(role._id,(err,emails)=>{
                                if(err){
                                    prev(err);
                                }
                                assert.deepEqual(emails,role.userEmail);
                                prev(null);
                            });
                        }
                    }
                },(err)=>{
                    if(err){
                        done(err);
                    }
                    else{
                        done(null);
                    }
                })(null);
            }
        });
    });

    it('1.17 getFullNameByEmail', function (done) {
        usersAndRolesController.getFullNameByEmail("new_media3@outlook.com",(err,fullName)=>{
            assert.deepEqual(fullName,"כף למד מם");
            usersAndRolesController.getFullNameByEmail("sayor@outlook.com",(err,fullName)=>{
                assert.deepEqual(fullName,"בית גימל");
                done();
            });
        });
    });

    it('1.18 findRolesByArray', function (done) {
        usersAccessor.findRole({}, (err, roles) => {
            if (err) {
                done(err);
            } else {
                usersAndRolesController.findRolesByArray(roles.map(role=>role._id),(err,_roles)=>{
                    if(err){
                        done(err);
                    }
                    else{
                        assert.deepEqual(_roles.map(role=>role._id.toString()),roles.map(role=>role._id.toString()));
                        done();
                    }
                });
            }
        });
    });

    it('1.19 getAllUsers', function (done) {
        usersAndRolesController.getAllUsers((err,users)=>{
            assert.deepEqual(users,[
                "meizamim@outlook.com",
                "website@outlook.com",
                "new_media@outlook.com",
                "new_media2@outlook.com",
                "new_media3@outlook.com",
                "graphics@outlook.com",
                "revaha@outlook.com",
                "meoravut@outlook.com",
                "hasbara@outlook.com",
                "academy@outlook.com",
                "cesef@outlook.com",
                "sayor@outlook.com",
                "yor@outlook.com"
            ]);
            done();
        });
    });

    it('1.21 getAllChildren', function (done) {
        usersAndRolesController.getAllChildren("hasbara@outlook.com",(err,children)=>{
            if(err){
                done(err);
            }
            else{
                assert.deepEqual(children,[
                    "new_media@outlook.com",
                    "new_media2@outlook.com",
                    "new_media3@outlook.com",
                    "website@outlook.com"
                ]);
                usersAndRolesController.getAllChildren("new_media@outlook.com",(err,children)=>{
                    if(err){
                        done(err);
                    }
                    else{
                        assert.deepEqual(children,[]);
                        done();
                    }
                });
            }
        });
    });

    it('1.22 getFatherOfDeregByArrayOfRoleIDs', function (done) {
        done();
    });
});