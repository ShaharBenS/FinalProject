let usersAndRolesController = require('../../controllers/usersControllers/usersAndRolesController');
let UsersPermissionsController = require('../../controllers/usersControllers/UsersPermissionsController');
let processStructureController = require('../../controllers/processesControllers/processStructureController');
let waitingProcessStructuresController = require('../../controllers/processesControllers/waitingProcessStructuresController');
let activeProcessController = require('../../controllers/processesControllers/activeProcessController');
let processReportController = require('../../controllers/processesControllers/processReportController');
let notificationController = require('../../controllers/notificationsControllers/notificationController');
let UserPermissions = require('../../domainObjects/UserPermissions');
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

describe('1. addUsersAndRoles', function () {
    before(globalBefore);
    after(globalAfter);
    let tree10String = fs.readFileSync("./test/inputs/trees/tree10/tree10.json");
    let processStructure9_string = fs.readFileSync("./test/inputs/processStructures/processStructure9/processStructure9.json");

    it('1.1 Creating users and roles tree', function (done) {
            usersAndRolesController.getUsersAndRolesTree(() => {
                    usersAndRolesController.setUsersAndRolesTree("creator@email.com", tree10String,
                        {
                            "יו\"ר": ["yor@outlook.com"],
                            "סיו\"ר": ["sayor@outlook.com"],
                            "מנהלת משאבי אנוש": ["menaeletMashabeiEnosh@outlook.com"],
                            "רמ\"ד תרבות": ["ramadTarbot@outlook.com"],
                            "רמ\"ד מעורבות": ["ramadMeoravot@outlook.com"],
                            "רמ\"ד הסברה": ["ramadHasbara@outlook.com"],
                            "רמ\"ד אקדמיה": ["ramadAcademia@outlook.com"],
                            "רמ\"ד כספים": ["ramadCsafim@outlook.com"],
                            "רכז ניו מדיה": ["rakaznNewMedia1@outlook.com", "rakaznNewMedia2@outlook.com", "rakaznNewMedia3@outlook.com"],
                            "דובר/ת": ["dover1@outlook.com", "dover2@outlook.com"],
                            "אחראי/ת קמפיינים ומיתוג": ["ahraiKampeinimAndMitug@outlook.com"],
                            "מנהל/ת אתר אינטרנט": ["MenaelAtar1@outlook.com", "MenaelAtar2@outlook.com"],
                            "צלמים": ["zalam1@outlook.com", "zalam2@outlook.com"],
                            "עורכ/ת וידאו": ["orehVideo@outlook.com"],
                            "עורך/ת משנה": ["orehMishne@outlook.com"],
                            "מידענ/ית ערבית": ["midaArabic@outlook.com"],
                            "מידענ/ית אנגלית": ["midaEnglish1@outlook.com"]
                        },
                        {
                            "yor@outlook.com": "א א",
                            "sayor@outlook.com": "ב ב",
                            "menaeletMashabeiEnosh@outlook.com": "ג ג",
                            "ramadTarbot@outlook.com": "ד ד",
                            "ramadMeoravot@outlook.com": "ה ה",
                            "ramadHasbara@outlook.com": "ו ו",
                            "ramadAcademia@outlook.com": "ז ז",
                            "ramadCsafim@outlook.com": "ח ח",
                            "rakaznNewMedia1@outlook.com": "ט ט",
                            "rakaznNewMedia2@outlook.com": "י י",
                            "rakaznNewMedia3@outlook.com": "כ כ",
                            "dover1@outlook.com": "ל ל",
                            "dover2@outlook.com": "מ מ",
                            "ahraiKampeinimAndMitug@outlook.com": "נ נ",
                            "MenaelAtar1@outlook.com": "ס ס",
                            "MenaelAtar2@outlook.com": "ע ע",
                            "zalam1@outlook.com": "פ פ",
                            "zalam2@outlook.com": "צ צ",
                            "orehVideo@outlook.com": "ק ק",
                            "orehMishne@outlook.com": "ר ר",
                            "midaArabic@outlook.com": "ש ש",
                            "midaEnglish1@outlook.com": "ת ת",
                        },
                        {
                            "יו\"ר": "5",
                            "סיו\"ר": "4",
                            "מנהלת משאבי אנוש": "3",
                            "רמ\"ד תרבות": "3",
                            "רמ\"ד מעורבות": "3",
                            "רמ\"ד הסברה": "3",
                            "רמ\"ד אקדמיה": "3",
                            "רמ\"ד כספים": "3",
                            "רכז ניו מדיה": "2",
                            "דובר/ת": "2",
                            "אחראי/ת קמפיינים ומיתוג": "2",
                            "מנהל/ת אתר אינטרנט": "2",
                            "צלמים": "1",
                            "עורכ/ת וידאו": "1",
                            "עורך/ת משנה": "1",
                            "מידענ/ית ערבית": "1",
                            "מידענ/ית אנגלית": "1",
                        },
                        (err) => {
                            if (err) {
                                done(err);
                            }
                            else {
                                usersAndRolesController.getRoleIdByUsername("rakaznNewMedia3@outlook.com", (err, roleId1) => {
                                        if (err) {
                                            done(err)
                                        }
                                        else {
                                            usersAndRolesController.getRoleNameByRoleID(roleId1, (err, roleName1) => {
                                                    if (err) {
                                                        done(err)
                                                    }
                                                    else {
                                                        assert.deepEqual(roleName1, "רכז ניו מדיה");
                                                        usersAndRolesController.getRoleIdByUsername("orehMishne@outlook.com", (err, roleId2) => {
                                                            if (err) {
                                                                done(err);
                                                            }
                                                            else {
                                                                usersAndRolesController.getRoleNameByRoleID(roleId2, (err, roleName2) => {
                                                                    if (err) {
                                                                        done(err)
                                                                    }
                                                                    else {
                                                                        assert.deepEqual(roleName2, "עורך/ת משנה");
                                                                        usersAndRolesController.findAdmins((err, admins) => {
                                                                            if (err) {
                                                                                done(err);
                                                                            }
                                                                            else {
                                                                                assert.deepEqual(admins.length, 1);
                                                                                usersAndRolesController.getEmailToFullName((err, emailsToFullName) => {
                                                                                    if (err) {
                                                                                        done(err);
                                                                                    }
                                                                                    else {
                                                                                        assert.deepEqual(emailsToFullName["sayor@outlook.com"], "ב ב");
                                                                                        assert.deepEqual(emailsToFullName["MenaelAtar1@outlook.com"], "ס ס");
                                                                                        assert.deepEqual(emailsToFullName["zalam1@outlook.com"], "פ פ");
                                                                                        assert.deepEqual(emailsToFullName["zalam2@outlook.com"], "צ צ");
                                                                                        assert.deepEqual(emailsToFullName["midaEnglish1@outlook.com"], "ת ת");
                                                                                        usersAndRolesController.getRoleToDereg((err, roleToDereg) => {
                                                                                            if (err) {
                                                                                                done(err)
                                                                                            }
                                                                                            else {
                                                                                                assert.deepEqual(Object.keys(roleToDereg).length, 17);
                                                                                                assert.deepEqual(roleToDereg["יו\"ר"], "5");
                                                                                                assert.deepEqual(roleToDereg["סיו\"ר"], "4");
                                                                                                assert.deepEqual(roleToDereg["רמ\"ד מעורבות"], "3");
                                                                                                assert.deepEqual(roleToDereg["רמ\"ד הסברה"], "3");
                                                                                                assert.deepEqual(roleToDereg["דובר/ת"], "2");
                                                                                                assert.deepEqual(roleToDereg["מידענ/ית אנגלית"], "1");
                                                                                                UsersPermissionsController.setUserPermissions(new UserPermissions("yor@outlook.com", [true, true, true, true]), (err) => {
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
                                                                            }
                                                                        });
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    }
                                                }
                                            );
                                        }
                                    }
                                );
                            }
                        }
                    );
                }
            );
        }
    ).timeout(30000);
});