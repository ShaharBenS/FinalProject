let mongoose = require('mongoose');
let mocha = require('mocha');
let describe = mocha.describe;
let it = mocha.it;
let assert = require('chai').assert;
let UsersAndRolesTreeSankey = require('../../controllers/usersControllers/usersAndRolesController');
let sankeyContent = require('../inputs/trees/treesForActiveProcessTest/usersTree1sankey');
let emailsToFullName = require('../inputs/trees/treesForActiveProcessTest/usersTree1EmailsToFullNames');
let rolesToDereg = require('../inputs/trees/treesForActiveProcessTest/usersTree1RolesToDeregs');
let rolesToEmails = require('../inputs/trees/treesForActiveProcessTest/usersTree1RolesToEmails');
let modelUsersAndRoles = require('../../models/schemas/usersSchemas/UsersAndRolesSchema');
let usersAndRolesTreeSankey = require('../../models/schemas/usersSchemas/UsersAndRolesTreeSankeySchema');
let userAccessor = require('../../models/accessors/usersAccessor');
let processStructureController = require('../../controllers/processesControllers/processStructureController');
let processStructureSankeyJSON = require('../inputs/processStructures/processStructuresForActiveProcessTest/processStructure1');
let activeProcessController = require('../../controllers/processesControllers/activeProcessController');
let usersAndRolesContoller = require('../../controllers/usersControllers/usersAndRolesController');
let processStructureAccessor = require('../../models/accessors/processStructureAccessor');
let filledOnlineFormsController = require('../../controllers/onlineFormsControllers/filledOnlineFormController');
let onlineFormsController = require('../../controllers/onlineFormsControllers/onlineFormController');
let usersPermissionsController = require('../../controllers/usersControllers/UsersPermissionsController');
let UserPermissions = require('../../domainObjects/UserPermissions');

let beforeGlobal = async function () {
    this.enableTimeouts(false);
    mongoose.set('useCreateIndex', true);
    await mongoose.connect('mongodb://localhost:27017/Tests', {useNewUrlParser: true});
};

let beforeEachTest = function (done) {
    this.enableTimeouts(false);
    mongoose.connection.db.dropDatabase();
    userAccessor.createSankeyTree({sankey: JSON.stringify({content: {diagram: []}})}, (err, result) => {
        if (err) {
            done(err);
        }
        else {
            UsersAndRolesTreeSankey.setUsersAndRolesTree('chairman@outlook.co.il', JSON.stringify(sankeyContent),
                rolesToEmails, emailsToFullName,
                rolesToDereg, (err) => {
                    if (err) {
                        done(err);
                    }
                    else {
                        done();
                    }
                });
        }
    });
};

let afterGlobal = function () {
    mongoose.connection.close();
};

describe('1. Users Permissions Controller', function () {
    before(beforeGlobal);
    beforeEach(beforeEachTest);
    after(afterGlobal);
    describe('1.1 set users permissions', function () {
        it('1.1.1 set users permissions correct', function (done) {
            usersPermissionsController.setUserPermissions('chairman@outlook.co.il', new UserPermissions("graphicartist@outlook.com", [false, true, false, true]), (err) => {
                if (err) done(err);
                else {
                    usersPermissionsController.getUserPermissions('graphicartist@outlook.com', (err, permissions) => {
                        if (err) done(err);
                        else {
                            assert.deepEqual(permissions.userEmail, 'graphicartist@outlook.com');
                            assert.deepEqual(permissions.usersManagementPermission, false);
                            assert.deepEqual(permissions.structureManagementPermission, true);
                            assert.deepEqual(permissions.observerPermission, false);
                            assert.deepEqual(permissions.permissionsManagementPermission, true);
                            done();
                        }
                    });
                }
            });
        }).timeout(30000);

        it('1.1.2 set users permissions user no authorized to grant permissions', function (done) {
            usersPermissionsController.setUserPermissions('spokesperson@outlook.co.il', new UserPermissions("graphicartist@outlook.com", [false, true, false, true]), (err) => {
                assert.deepEqual(true, err !== null);
                assert.deepEqual(err.message, 'user isnt authorized to grant permissions');
                done();
            });
        }).timeout(30000);

        it('1.1.3 set users permissions user no authorized to grant permissions to admin', function (done) {
            usersPermissionsController.setUserPermissions('chairman@outlook.co.il', new UserPermissions("graphicartist@outlook.co.il", [false, true, false, true]), (err) => {
                if (err) done(err);
                else {
                    usersPermissionsController.setUserPermissions('graphicartist@outlook.co.il', new UserPermissions("chairman@outlook.co.il", [false, true, false, true]), (err) => {
                        assert.deepEqual(true, err !== null);
                        assert.deepEqual(err.message, 'Can\'t change the permissions of an admin');
                        done();
                    });
                }
            });

        }).timeout(30000);
    });
    describe('1.2 get users permissions', function () {
        it('1.2.1 get users permissions', function (done) {
            usersPermissionsController.getUserPermissions('graphicartist@outlook.com', (err, permissions) => {
                if(err) done(err);
                else
                {
                    assert.deepEqual(permissions.userEmail, 'graphicartist@outlook.com');
                    assert.deepEqual(permissions.usersManagementPermission, false);
                    assert.deepEqual(permissions.structureManagementPermission, false);
                    assert.deepEqual(permissions.observerPermission, false);
                    assert.deepEqual(permissions.permissionsManagementPermission, false);
                    usersPermissionsController.setUserPermissions('chairman@outlook.co.il', new UserPermissions("graphicartist@outlook.com", [false, true, false, true]), (err) => {
                        if (err) done(err);
                        else {
                            usersPermissionsController.getUserPermissions('graphicartist@outlook.com', (err, permissions) => {
                                if (err) done(err);
                                else {
                                    assert.deepEqual(permissions.userEmail, 'graphicartist@outlook.com');
                                    assert.deepEqual(permissions.usersManagementPermission, false);
                                    assert.deepEqual(permissions.structureManagementPermission, true);
                                    assert.deepEqual(permissions.observerPermission, false);
                                    assert.deepEqual(permissions.permissionsManagementPermission, true);
                                    done();
                                }
                            });
                        }
                    });
                }
            });

        }).timeout(30000);
    });
});