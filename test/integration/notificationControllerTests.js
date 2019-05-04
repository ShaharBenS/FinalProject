let mongoose = require('mongoose');
let ObjectID = require('mongodb').ObjectID;
let mocha = require('mocha');
let describe = mocha.describe;
let it = mocha.it;
let assert = require('chai').assert;
let expect = require('chai').expect;
let fs = require("fs");

let UserPermissions = require('../../domainObjects/UserPermissions');
let Notification = require('../../domainObjects/notification');
let notificationController = require('../../controllers/notificationsControllers/notificationController');
let usersAndRolesController = require('../../controllers/usersControllers/usersAndRolesController');
let usersPermissionsController = require('../../controllers/usersControllers/UsersPermissionsController');
let processStructureController = require('../../controllers/processesControllers/processStructureController');
let waitingProcessStructuresController = require('../../controllers/processesControllers/waitingProcessStructuresController');
let activeProcessController = require('../../controllers/processesControllers/activeProcessController');
let processReportsController = require('../../controllers/processesControllers/processReportController');


let connectsToTestingDatabase = async function () {
    mongoose.set('useCreateIndex', true);
    await mongoose.connect('mongodb://localhost:27017/Tests', {useNewUrlParser: true});
    mongoose.connection.db.dropDatabase();
};

let closeConnection = function () {
    mongoose.connection.close();
};

let clearDatabase = function () {
    mongoose.connection.db.dropDatabase();
};

let userAA = "yor@outlook.com";
let userBB = "sayor@outlook.com";
let processName = "תהליך 1";

let createUserAndRolesTree = function (callback) {

    let tree11_string = fs.readFileSync("./test/inputs/trees/tree11/tree11.json");

    usersAndRolesController.getUsersAndRolesTree(() => {
        usersAndRolesController.setUsersAndRolesTree("creator@email.com", tree11_string,
            {
                "AA": [userAA],
                "BB": [userBB]
            },
            {
                "yor@outlook.com": "אלף בית",
                "sayor@outlook.com": "בית גימל"
            },
            {
                "AA": "5",
                "BB": "4"
            },
            (err) => {
                if (err) {
                    callback(err);
                }
                usersPermissionsController.setUserPermissions("creator@email.com", new UserPermissions("yor@outlook.com", [true, true, true, true]), (err) => {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null);
                    }
                });
            }
        );
    });
};

let createProcessStructure = function (callback) {
    let processStructure2_string = fs.readFileSync("./test/inputs/processStructures/processStructure2/processStructure2.json");
    processStructureController.addProcessStructure("sayor@outlook.com",
        "מעורבות באתר אקדמיה", processStructure2_string,
        [], "24", "12", (err) => {
            if (err) callback(err);
            else
                waitingProcessStructuresController.getAllWaitingProcessStructuresWithoutSankey(
                    (err, waitingStructures) => {
                        if (err) callback(err);
                        else
                            waitingProcessStructuresController.approveProcessStructure("yor@outlook.com",
                                waitingStructures[0].id, (err) => {
                                    if (err) callback(err);
                                    else callback(null);
                                });
                    });
        });
};

let createActiveProcess = function (callback) {
    activeProcessController.startProcessByUsername("yor@outlook.com", "מעורבות באתר אקדמיה", processName,
        new Date(2022, 4, 26, 16), 2, (err) => {
            if (err) callback(err);
            else callback(null);
        });
};


describe('1. addNotificationToUser', function () {

    before(connectsToTestingDatabase);
    afterEach(clearDatabase);
    after(closeConnection);

    it('1.1 creates notification to user', function (done) {
        this.timeout(10000);
        let notification = new Notification("description1", "type1");
        notificationController.addNotificationToUser(userAA, notification, (err, res) => {
            if (err) done(err);
            notificationController.getUserNotifications(userAA, (err, notifications) => {
                if (err) done(err);
                assert.equal(notifications.length, 1);
                assert.deepEqual(notifications[0].mongoId, res._id);
                assert.equal(notifications[0].notificationType, res.notification.notificationType);
                assert.equal(notifications[0].description, res.notification.description);
                done();
            });
        })
    });

    it('1.2 creates several notifications to user', function (done) {
        this.timeout(10000);
        let notification = new Notification("description1", "type1");
        let notification2 = new Notification("description2", "type2");
        let notification3 = new Notification("description3", "type3");
        notificationController.addNotificationToUser(userAA, notification, (err, res1) => {
            if (err) done(err);
            notificationController.addNotificationToUser(userAA, notification2, (err, res2) => {
                if (err) done(err);
                notificationController.addNotificationToUser(userAA, notification3, (err, res3) => {
                    if (err) done(err);
                    notificationController.getUserNotifications(userAA, (err, notifications) => {
                        assert.equal(notifications.length, 3);

                        assert.deepEqual(notifications[0].mongoId, res1._id);
                        assert.equal(notifications[0].notificationType, res1.notification.notificationType);
                        assert.equal(notifications[0].description, res1.notification.description);

                        assert.deepEqual(notifications[1].mongoId, res2._id);
                        assert.equal(notifications[1].notificationType, res2.notification.notificationType);
                        assert.equal(notifications[1].description, res2.notification.description);

                        assert.deepEqual(notifications[2].mongoId, res3._id);
                        assert.equal(notifications[2].notificationType, res3.notification.notificationType);
                        assert.equal(notifications[2].description, res3.notification.description);
                        done();
                    });
                })
            })
        })
    });
});

describe('2. deleteNotification', function () {

    before(connectsToTestingDatabase);
    afterEach(clearDatabase);
    after(closeConnection);

    it('2.1 deletes existing notification', function (done) {
        this.timeout(10000);
        let notification = new Notification("description1", "type1");
        notificationController.addNotificationToUser(userAA, notification, (err, res) => {
            if (err) done(err);
            let notificationID = res._id;
            notificationController.getUserNotifications(userAA, (err, notifications) => {
                if (err) done(err);
                assert.equal(notifications.length, 1);
                notificationController.deleteNotification(notificationID, (err, res) => {
                    notificationController.getUserNotifications(userAA, (err, notifications) => {
                        if (err) done(err);
                        assert.equal(notifications.length, 0);
                        done();
                    });
                });

            });
        });
    });

    it('2.2 deletes not existing notification', function (done) {
        this.timeout(15000);
        let notification = new Notification("description1", "type1");
        notificationController.addNotificationToUser(userAA, notification, (err, res) => {
            if (err) done(err);
            notificationController.getUserNotifications(userAA, (err, notifications) => {
                if (err) done(err);
                assert.equal(notifications.length, 1);
                notificationController.deleteNotification(new ObjectID(123), (err, res) => {
                    assert.equal(res.n, 0);
                    done();
                })
            });
        })
    });

    it('2.3 deletes existing notification and checks it didnt effected other users', function (done) {
        this.timeout(10000);
        let notification = new Notification("description1", "type1");
        notificationController.addNotificationToUser(userAA, notification, (err, res) => {
            if (err) done(err);
            let notificationID = res._id;
            notificationController.addNotificationToUser(userAA + "user2", notification, (err, res) => {
                if (err) done(err);
                notificationController.getUserNotifications(userAA, (err, notifications) => {
                    if (err) done(err);
                    assert.equal(notifications.length, 1);
                    notificationController.getUserNotifications(userAA + "user2", (err, notifications) => {
                        if (err) done(err);
                        assert.equal(notifications.length, 1);
                        notificationController.deleteNotification(notificationID, (err) => {
                            if (err) done(err);
                            notificationController.getUserNotifications(userAA, (err, notifications) => {
                                if (err) done(err);
                                assert.equal(notifications.length, 0);
                                notificationController.getUserNotifications(userAA + "user2", (err, notifications) => {
                                    if (err) done(err);
                                    assert.equal(notifications.length, 1);
                                    done();
                                });
                            });
                        });
                    });
                });
            });
        });
    });


});

describe('3. deleteAllNotification', function () {

    before(connectsToTestingDatabase);
    afterEach(clearDatabase);
    after(closeConnection);

    it('3.1 deletes for user without notifications', function (done) {
        this.timeout(10000);
        notificationController.deleteAllNotification(userAA, (err, res) => {
            expect(err).to.be.a('null');
            assert.equal(res.n, 0);
            done();
        })
    });

    it('3.2 deletes notifications', function (done) {
        this.timeout(10000);
        let notification = new Notification("description1", "type1");
        let notification2 = new Notification("description2", "type2");
        let notification3 = new Notification("description3", "type3");
        notificationController.addNotificationToUser(userAA, notification, (err, res) => {
            notificationController.addNotificationToUser(userAA, notification2, (err, res) => {
                notificationController.addNotificationToUser(userAA, notification3, (err, res) => {
                    notificationController.deleteAllNotification(userAA, (err, res) => {
                        expect(err).to.be.a('null');
                        assert.equal(res.n, 3);
                        notificationController.getUserNotifications(userAA, (err, res) => {
                            assert.equal(res.length, 0);
                            done();
                        });
                    });
                });
            });
        });
    });

    it('3.3 deletes and checks it didnt effected other users', function (done) {
        this.timeout(10000);
        let notification = new Notification("description1", "type1");
        notificationController.addNotificationToUser(userAA, notification, (err, res) => {
            if (err) done(err);
            let notificationID = res._id;
            notificationController.addNotificationToUser(userAA + "user2", notification, (err, res) => {
                if (err) done(err);
                notificationController.getUserNotifications(userAA, (err, notifications) => {
                    if (err) done(err);
                    assert.equal(notifications.length, 1);
                    notificationController.getUserNotifications(userAA + "user2", (err, notifications) => {
                        if (err) done(err);
                        assert.equal(notifications.length, 1);
                        notificationController.deleteAllNotification(userAA, (err) => {
                            if (err) done(err);
                            notificationController.getUserNotifications(userAA, (err, notifications) => {
                                if (err) done(err);
                                assert.equal(notifications.length, 0);
                                notificationController.getUserNotifications(userAA + "user2", (err, notifications) => {
                                    if (err) done(err);
                                    assert.equal(notifications.length, 1);
                                    done();
                                });
                            });
                        });
                    });
                });
            });
        });
    });


});

describe('4. countNotifications', function () {

    before(connectsToTestingDatabase);
    afterEach(clearDatabase);
    after(closeConnection);

    it('4.1 counts for different amounts of notifications', function (done) {
        this.timeout(10000);

        let notification = new Notification("description1", "type1");
        let notification2 = new Notification("description2", "type2");
        let notification3 = new Notification("description3", "type3");

        notificationController.countNotifications(userAA, (err, res) => {
            if (err) done(err);
            assert.equal(res, 0);
            notificationController.addNotificationToUser(userAA, notification, (err) => {
                if (err) done(err);
                notificationController.countNotifications(userAA, (err, res) => {
                    if (err) done(err);
                    assert.equal(res, 1);
                    notificationController.addNotificationToUser(userAA, notification2, (err) => {
                        if (err) done(err);
                        notificationController.countNotifications(userAA, (err, res) => {
                            if (err) done(err);
                            assert.equal(res, 2);
                            notificationController.addNotificationToUser(userAA, notification3, (err) => {
                                if (err) done(err);
                                notificationController.countNotifications(userAA, (err, res) => {
                                    if (err) done(err);
                                    assert.equal(res, 3);
                                    notificationController.addNotificationToUser(userAA + "a", notification, (err) => {
                                        if (err) done(err);
                                        notificationController.countNotifications(userAA + "a", (err, res) => {
                                            if (err) done(err);
                                            assert.equal(res, 1);
                                            notificationController.countNotifications(userAA, (err, res) => {
                                                if (err) done(err);
                                                assert.equal(res, 3);
                                                done();
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

describe('5. notifyFinishedProcess', function () {

    before(connectsToTestingDatabase);
    afterEach(clearDatabase);
    after(closeConnection);

    it('notifies to all the process participants about the finish', function (done) {
        this.timeout(10000);
        createUserAndRolesTree((err) => {
            if (err) done(err);
            createProcessStructure((err) => {
                if (err) done(err);
                createActiveProcess((err) => {
                    if (err) done(err);
                    activeProcessController.uploadFilesAndHandleProcess(userAA,
                        {
                            processName: processName,
                            1: "on",
                            comments: "הערה 1"
                        }, [], "files", () => {
                            activeProcessController.uploadFilesAndHandleProcess(userBB,
                                {
                                    processName: processName,
                                    comments: "הערה 2"
                                }, [], "files", () => {
                                    processReportsController.getAllProcessesReportsByUser(userAA, (err, process) => {
                                        if (err) done(err);
                                        notificationController.getUserNotifications(userAA, (err, notifications) => {
                                            if (err) done(err);
                                            let count = notifications.length;
                                            notificationController.notifyFinishedProcess(process[0], (err) => {
                                                if (err) done(err);
                                                notificationController.getUserNotifications(userAA, (err, notifications) => {
                                                    if (err) done(err);
                                                    assert.equal(notifications.length, count + 1);
                                                    assert.equal(notifications[count].notificationType, "תהליך נגמר בהצלחה");
                                                    notificationController.getUserNotifications(userBB, (err, notifications) => {
                                                        if (err) done(err);
                                                        assert.equal(notifications[notifications.length - 1].notificationType, "תהליך נגמר בהצלחה");
                                                        done();
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                        });
                });
            });
        });
    });
});


describe('6. notifyNotFinishedProcess', function () {

    before(connectsToTestingDatabase);
    afterEach(clearDatabase);
    after(closeConnection);

    it('notifies the next user about his pending process', function (done) {
        this.timeout(10000);
        createUserAndRolesTree((err) => {
            if (err) done(err);
            createProcessStructure((err) => {
                if (err) done(err);
                createActiveProcess((err) => {
                    if (err) done(err);
                    notificationController.countNotifications(userBB, (err, num) => {
                        if (err) done(err);
                        activeProcessController.getActiveProcessByProcessName(processName, (err, process) => {
                            if (err) done(err);
                            notificationController.notifyNotFinishedProcess(process, [1], (err) => {
                                if (err) done(err);
                                notificationController.countNotifications(userBB, (err, num2) => {
                                    if (err) done(err);
                                    assert.equal(num2, num + 1);
                                    notificationController.getUserNotifications(userBB, (err, notis) => {
                                        if (err) done(err);
                                        assert.equal(notis[num].notificationType, "תהליך זמין");
                                        done();
                                    })
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});


describe('7. notifyCancelledProcess', function () {

    before(connectsToTestingDatabase);
    afterEach(clearDatabase);
    after(closeConnection);

    it('notifies to all the process participants about the cancel', function (done) {
        this.timeout(10000);
        createUserAndRolesTree((err) => {
            if (err) done(err);
            createProcessStructure((err) => {
                if (err) done(err);
                createActiveProcess((err) => {
                    if (err) done(err);
                    activeProcessController.uploadFilesAndHandleProcess(userAA,
                        {
                            processName: processName,
                            1: "on",
                            comments: "הערה 1"
                        }, [], "files", () => {
                            activeProcessController.getActiveProcessByProcessName(processName, (err, process) => {
                                if (err) done(err);
                                notificationController.notifyCancelledProcess(process, (err) => {
                                    if (err) done(err);
                                    notificationController.getUserNotifications(userAA, (err, notifications) => {
                                        if (err) done(err);
                                        assert.equal(notifications[notifications.length - 1].notificationType, "תהליך בוטל");
                                        notificationController.getUserNotifications(userBB, (err, notifications) => {
                                            if (err) done(err);
                                            assert.equal(notifications[notifications.length - 1].notificationType, "תהליך בוטל");
                                            done();
                                        });
                                    });
                                });
                            });
                        });
                });
            });
        });
    });
});