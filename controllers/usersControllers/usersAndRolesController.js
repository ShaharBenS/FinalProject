let userAccessor = require('../../models/accessors/usersAccessor');
let processStructureController = require('../processesControllers/processStructureController');
let activeProcessController = require('../processesControllers/activeProcessController');
let activeProcessAccessor = require('../../models/accessors/activeProcessesAccessor');
let usersAndRolesTree = require('../../domainObjects/usersAndRolesTree');
let usersAndRolesTreeSankey = require('../../domainObjects/usersAndRolesTreeSankey');
let userPermissionsController = require('../usersControllers/UsersPermissionsController');
let userPermissionsAccessor = require('../../models/accessors/usersPermissionsAccessor');
let UserPermissions = require('../../domainObjects/UserPermissions');
let notificationsAccessor = require('../../models/accessors/notificationsAccessor');
let Notification = require('../../domainObjects/notification');
let fs = require("fs");

module.exports.getRoleToEmails = (callback) =>
{
    userAccessor.findRole({}, (err, roles) =>
    {
        if (err) {
            callback(err);
        }
        else {
            callback(null, new usersAndRolesTree(roles).getRoleToEmails());
        }
    })
};

module.exports.getRoleToDereg = (callback) =>
{
    userAccessor.findRole({}, (err, roles) =>
    {
        if (err) {
            callback(err);
        }
        else {
            callback(null, new usersAndRolesTree(roles).getRoleToDereg())
        }
    })
};

module.exports.getEmailToFullName = (callback) =>
{
    userAccessor.findUsernames((err, result) =>
    {
        if (err) {
            callback(err);
        }
        else {
            let emailToFullName = {};
            result.forEach((entry) =>
            {
                emailToFullName[entry.userEmail] = entry.userName;
            });
            callback(null, emailToFullName);
        }
    });
};

module.exports.getIdToRole = (callback) =>
{
    userAccessor.findInSankeyTree({}, (err, sankeyTree) =>
    {
        if (err) {
            callback(err);
        }
        else {
            if (sankeyTree.length === 0) {
                callback(null, {})
            }
            else {
                let sankey = new usersAndRolesTreeSankey(JSON.parse(sankeyTree[0].sankey));
                callback(null, sankey.getIdToRole())
            }
        }
    });
};

module.exports.getAllRoles = (callback) =>
{
    return userAccessor.findRole({}, callback).select(['roleName']);
};

module.exports.getUsersAndRolesTree = (callback) =>
{
    userAccessor.findInSankeyTree({}, (err, result) =>
    {
        if (err) {
            callback(err);
        }
        else if (result.length === 0) {
            userAccessor.createSankeyTree({sankey: JSON.stringify({content: {diagram: []}})}, (err, result) =>
            {
                if (err) {
                    callback(err);
                }
                else {
                    callback(null, result);
                }
            });
        }
        else {
            callback(null, result[0]);
        }
    });
};

module.exports.setUsersAndRolesTree = (userEmail, sankey, roleToEmails, emailToFullName, roleToDereg, callback) =>
{
    let firstTime = false;
    let commonCallback = () =>
    {
        userPermissionsController.getUserPermissions(userEmail, (err, permissions) =>
        {
            if (err) {
                callback(err);
            }
            else {
                if (firstTime || permissions.usersManagementPermission) {
                    let sankeyTree = new usersAndRolesTreeSankey(JSON.parse(sankey));
                    let emails = Object.values(roleToEmails).reduce((prev, curr) =>
                    {
                        return prev.concat(curr);
                    }, []);

                    if (sankeyTree.hasNoRoot()) {
                        callback('שגיאה: חייב להיות לפחות תפקיד אחד בעץ.');
                    }
                    else if (sankeyTree.hasMoreThanOneTree()) {
                        callback('שגיאה: יש יותר מעץ אחד.');
                    }
                    else if (Object.keys(roleToEmails).some(key =>
                    {
                        return roleToEmails[key].length === 0;
                    })) {
                        callback('שגיאה: לכל תפקיד חייב היות מקושר לפחות עובד אחד.')
                    }
                    else if (sankeyTree.hasMultipleConnections()) {
                        callback('שגיאה: יש 2 קשרים בין 2 צמתים.')
                    }
                    else if (sankeyTree.hasCycles()) {
                        callback('שגיאה: העץ מכיל מעגלים.');
                    }
                    else if (!sankeyTree.isTree()) {
                        callback('שגיאה: אין מבנה של עץ.');
                    }
                    else if (emails.filter(emailValidator).length !== emails.length) {
                        callback('שגיאה: אחד או יותר מהמיילים שצורפו לא תקינים.');
                    }
                    else {
                        userAccessor.findRole({}, (err, roles) =>
                        {
                            if (err) {
                                callback(err);
                            }
                            else {
                                let oldUsersAndRoles = new usersAndRolesTree(roles);
                                userAccessor.findInSankeyTree({}, (err, _sankeyTree) =>
                                {
                                    if (err) {
                                        callback(err);
                                    }
                                    else {
                                        let oldSankey = new usersAndRolesTreeSankey(JSON.parse(_sankeyTree[0].sankey));
                                        userAccessor.updateSankeyTree({}, {sankey: sankey}, (err) =>
                                        {
                                            if (err) {
                                                callback(err);
                                            }
                                            else {
                                                userAccessor.deleteAllRoles((err) =>
                                                {
                                                    if (err) {
                                                        callback(err);
                                                    }
                                                    else {
                                                        userAccessor.deleteAllUserNames((err) =>
                                                        {
                                                            if (err) {
                                                                callback(err);
                                                            }
                                                            else {

                                                                let roles = sankeyTree.getRoles();
                                                                let connections = sankeyTree.getConnections();
                                                                let usersAndRoleDocuments = [];
                                                                roles.reduce((acc, role_figure) =>
                                                                {
                                                                    return (err) =>
                                                                    {
                                                                        if (err) {
                                                                            acc(err);
                                                                        }
                                                                        else {
                                                                            let _id = undefined;
                                                                            let roleName = role_figure.labels[0].text;
                                                                            let existingRoleIndex = oldSankey.getRoles().findIndex(role =>
                                                                            {
                                                                                return role.id === role_figure.id;
                                                                            });
                                                                            if (existingRoleIndex > -1) {
                                                                                let _roleName = oldSankey.getRoles()[existingRoleIndex].labels[0].text;
                                                                                _id = oldUsersAndRoles.getIdByRoleName(_roleName);
                                                                            }
                                                                            existingRoleIndex = oldSankey.getRoles().findIndex(role =>
                                                                            {
                                                                                return role.labels[0].text === roleName;
                                                                            });
                                                                            if (existingRoleIndex > -1) {
                                                                                _id = oldUsersAndRoles.getIdByRoleName(roleName);
                                                                            }
                                                                            addUsersAndRole(_id, roleName, roleToEmails[roleName], roleToDereg[roleName], (_err, usersAndRole) =>
                                                                            {
                                                                                if (err) {
                                                                                    acc(err);
                                                                                }
                                                                                else {
                                                                                    roleToEmails[roleName].reduce((acc, email) =>
                                                                                    {
                                                                                        return (err) =>
                                                                                        {
                                                                                            if (err) {
                                                                                                acc(err);
                                                                                            }
                                                                                            else {
                                                                                                userAccessor.createUser({
                                                                                                    userEmail: email,
                                                                                                    userName: emailToFullName[email]
                                                                                                }, acc)
                                                                                            }
                                                                                        };
                                                                                    }, (err) =>
                                                                                    {
                                                                                        if (err) {
                                                                                            acc(err);

                                                                                        }
                                                                                        else {
                                                                                            usersAndRoleDocuments.push(usersAndRole);
                                                                                            acc(null)
                                                                                        }
                                                                                    })(null);
                                                                                }
                                                                            })
                                                                        }
                                                                    };
                                                                }, (err) =>
                                                                {
                                                                    if (err) {
                                                                        callback(err);
                                                                    }
                                                                    else {
                                                                        let roleNames = usersAndRoleDocuments.map(usersAndRoleDocument =>
                                                                        {
                                                                            return usersAndRoleDocument.roleName;
                                                                        });
                                                                        let roleIDs = roles.map(role => role.id);

                                                                        connections.reduce((acc, connection) =>
                                                                        {
                                                                            return (err) =>
                                                                            {
                                                                                if (err) {
                                                                                    acc(err);
                                                                                }
                                                                                else {
                                                                                    let fromNodeIndex = roleIDs.indexOf(connection.source.node);
                                                                                    let toNodeIndex = roleIDs.indexOf(connection.target.node);

                                                                                    let fromNodeRoleName = roles[fromNodeIndex].labels[0].text;
                                                                                    let toNodeRoleName = roles[toNodeIndex].labels[0].text;

                                                                                    let fromNodeRoleIndex = roleNames.indexOf(fromNodeRoleName);
                                                                                    let toNodeRoleIndex = roleNames.indexOf(toNodeRoleName);

                                                                                    let fromNodeID = usersAndRoleDocuments[fromNodeRoleIndex]._id;
                                                                                    let toNodeID = usersAndRoleDocuments[toNodeRoleIndex]._id;

                                                                                    addChildrenToRole(fromNodeID, toNodeID, (err) =>
                                                                                    {
                                                                                        if (err) {
                                                                                            acc(err);
                                                                                        }
                                                                                        else {
                                                                                            acc(null);
                                                                                        }
                                                                                    })
                                                                                }
                                                                            };
                                                                        }, (err) =>
                                                                        {
                                                                            if (err) {
                                                                                callback(err);
                                                                            }
                                                                            else {
                                                                                // All done here

                                                                                // Looking for roles that have been removed.
                                                                                let deletedRoles = [];
                                                                                let deletedRolesNames = [];
                                                                                oldSankey.getRoles().forEach(role =>
                                                                                {
                                                                                    if (sankeyTree.getRoles().every(n_role =>
                                                                                    {
                                                                                        return role.id !== n_role.id;
                                                                                    })) {
                                                                                        deletedRoles.push(role);
                                                                                    }
                                                                                    else if (sankeyTree.getRoles().every(n_role =>
                                                                                    {
                                                                                        if (role.id === n_role.id) {
                                                                                            return false;
                                                                                        }
                                                                                        if (n_role.labels[0].text === role.labels[0].text) {
                                                                                            return false;
                                                                                        }
                                                                                        return true;
                                                                                    })) {
                                                                                        deletedRoles.push(role);
                                                                                    }
                                                                                });
                                                                                let deletedRolesIds = deletedRoles.map(role =>
                                                                                {
                                                                                    deletedRolesNames.push(role.labels[0].text);
                                                                                    return oldUsersAndRoles.getIdByRoleName(role.labels[0].text);
                                                                                });
                                                                                let renamedRoles = {};
                                                                                oldSankey.getRoles().forEach(role =>
                                                                                {
                                                                                    let newName = -1;
                                                                                    sankeyTree.getRoles().forEach(_role =>
                                                                                    {
                                                                                        if (_role.id === role.id) {
                                                                                            if (role.labels[0].text !== _role.labels[0].text) {
                                                                                                newName = _role.labels[0].text;
                                                                                            }
                                                                                        }
                                                                                    });
                                                                                    if (newName !== -1) {
                                                                                        renamedRoles[role.labels[0].text] = newName;
                                                                                    }
                                                                                });
                                                                                processStructureController.setProcessStructuresUnavailable(deletedRolesIds, deletedRolesNames, renamedRoles, (err) =>
                                                                                {
                                                                                    if (err) {
                                                                                        callback(err);
                                                                                    }
                                                                                    else {
                                                                                        let rootName = sankeyTree.getRootName();
                                                                                        let rootID = usersAndRoleDocuments.find((usersAndRole) =>
                                                                                        {
                                                                                            if (usersAndRole.roleName === rootName) {
                                                                                                return true;
                                                                                            }
                                                                                        })._id;
                                                                                        updateDeletedRolesInEveryActiveProcess(deletedRolesIds, oldUsersAndRoles, rootID, (err) =>
                                                                                        {
                                                                                            if (err) {
                                                                                                callback(err);
                                                                                            }
                                                                                            else {
                                                                                                removeDeletedEmailsFromActiveStages(oldUsersAndRoles, usersAndRoleDocuments, (err) =>
                                                                                                {
                                                                                                    if (err) {
                                                                                                        callback(err);
                                                                                                    }
                                                                                                    else {
                                                                                                        if (firstTime) {
                                                                                                            addAdmin(userEmail, callback);
                                                                                                        }
                                                                                                        else {
                                                                                                            callback(null);
                                                                                                        }
                                                                                                    }
                                                                                                });
                                                                                            }
                                                                                        });
                                                                                    }
                                                                                });
                                                                            }
                                                                        })(null);
                                                                    }
                                                                })(null);
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        })
                                    }
                                });
                            }
                        });
                    }
                }
                else {
                    callback('שגיאה: אין לך את ההרשאות המתאימות לעריכת עץ המשתמשים.')
                }
            }
        });
    };

    userAccessor.findInSankeyTree({}, (err, _sankeyTree) =>
    {
        if (_sankeyTree[0].sankey === "{\"content\":{\"diagram\":[]}}") {
            firstTime = true;
        }
        commonCallback();
    });
};

module.exports.getRoleIdByUsername = function (username, callback)
{
    userAccessor.findRole({userEmail: username}, (err, user) =>
    {
        if (err) callback(err);
        else {
            if (user.length === 0) callback(new Error("no role found for username: " + username));
            else callback(null, user[0]._id);
        }
    });
};

module.exports.getRoleByUsername = function (username, callback)
{
    userAccessor.findRole({userEmail: username}, (err, role) =>
    {
        if (err) callback(err);
        else {
            if (role.length === 0) callback(new Error("no role found for username: " + username));
            else callback(null, {roleID: role[0]._id, dereg: role[0].dereg});
        }
    });
};

function getRoleNameByRoleID(roleID, callback)
{
    userAccessor.findRole({_id: roleID}, (err, user) =>
    {
        if (err) callback(err);
        else {
            if (user.length === 0) callback(null, null);
            else callback(null, user[0].roleName);
        }
    });
}

module.exports.findAdmins = function (callback)
{
    userAccessor.findAdmins({}, (err, admins) =>
    {
        if (err) {
            callback(err);
        }
        else {
            callback(null, admins.map(admin => admin.userEmail));
        }
    });
};

module.exports.getRoleNameByUsername = function (username, callback)
{
    userAccessor.findRole({userEmail: username}, (err, user) =>
    {
        if (err) callback(err);
        else {
            if (user.length === 0) {
                callback(new Error("no such role found"));
            }
            else {
                callback(null, user[0].roleName);
            }
        }
    });
};

module.exports.getEmailsByRoleId = (roleId, callback) =>
{
    userAccessor.findRole({_id: roleId}, (err, role) =>
    {
        if (err) {
            callback(err);
        }
        else {
            callback(null, role[0].userEmail);
        }
    });
};

module.exports.getFullNameByEmail = (email, callback) =>
{
    userAccessor.findUsername({userEmail: email}, (err, result) =>
    {
        if (err) {
            callback(err);
        }
        else if (result.length === 0) {
            callback(new Error("full name not found"));
        }
        else {
            callback(null, result[0].userName);
        }
    });
};

module.exports.findRolesByArray = (roleIDs, callback) =>
{
    userAccessor.findRolesByArray(roleIDs, callback);
};

module.exports.getAllUsers = (callback) =>
{
    userAccessor.findAdmins({}, (err, admins) =>
    {
        if (err) {
            callback(err);
        }
        else {
            userAccessor.findUsername({}, (err2, userNames) => {
                if (err2) {
                    callback(err2);
                }
                else {
                    let users = [];
                    userNames.forEach(userName => {
                        users.push({userEmail: userName.userEmail, userName: userName.userName});
                    });
                    users.reduce((acc, user) => {
                        return (err)=>{
                            if(err) {
                                acc(err);
                            }
                            else
                            {
                                this.getRoleNameByUsername(user.userEmail,(err, roleName)=>{
                                    if(err) acc(err);
                                    else
                                    {
                                        user.roleName = roleName;
                                        acc(null);
                                    }
                                });
                            }
                        };
                    },(err)=>{
                        if(err){
                            callback(err);
                        }
                        else{
                            let toReturn = [];
                            for (let i = 0; i < users.length; i++) {
                                if (!admins.map(admin => admin.userEmail).includes(users[i].userEmail)) {
                                    toReturn.push(users[i]);
                                }
                            }
                            callback(null, toReturn);
                        }
                    })(null);
                }
            });
        }
    });
};

module.exports.loadDefaultTree = (userEmail, callback) =>
{
    let demoTreeString = fs.readFileSync("./defaultTree/defaultTree.json");
    let emailsToFullName = JSON.parse(fs.readFileSync("./defaultTree/emailsToFullName.json"));
    let rolesToDereg = JSON.parse(fs.readFileSync("./defaultTree/rolesToDereg.json"));
    let rolesToEmails = JSON.parse(fs.readFileSync("./defaultTree/rolesToEmails.json"));
    this.setUsersAndRolesTree(userEmail, demoTreeString, rolesToEmails, emailsToFullName, rolesToDereg, callback);
};

module.exports.getAllChildren = (userEmail, callback) =>
{
    userAccessor.findUser({}, (err, res) =>
    {
        if (err) callback(err);
        else {
            let children = [];
            let roleOfUser = '';
            let roleMapping = {};
            for (let i = 0; i < res.length; i++) {
                roleMapping[res[i]._id] = res[i];
                for (let j = 0; j < res[i].userEmail.length; j++) {
                    if (res[i].userEmail[j] === userEmail) {
                        roleOfUser = res[i];
                    }
                }
            }
            for (let i = 0; i < roleOfUser.children.length; i++) {
                children = children.concat(getChildrenRecursive(roleMapping[roleOfUser.children[i]], roleMapping));
            }
            callback(null, children);
        }
    });
};

/*
    returns the fathers of roleID that are of a dereg that in deregs array
 */
module.exports.getFatherOfDeregByArrayOfRoleIDs = (roleID, deregs, callback) =>
{
    userAccessor.findRole({}, (err, res) =>
    {
        if (err) callback(err);
        else {
            let toReturn = {};
            for (let i = 0; i < deregs.length; i++) {
                toReturn[deregs[i]] = recursiveFatherOfDeregFinder(res, roleID, deregs[i]);
            }
            callback(null, toReturn);
        }
    });
};

function addChildrenToRole(roleObjectID, childrenObjectID, callback)
{
    userAccessor.updateRole({_id: roleObjectID}, {$push: {children: childrenObjectID}}, callback);
}

function addUsersAndRole(_id, roleName, usersEmail, dereg, callback)
{
    let countsArray = {};
    usersEmail.forEach((email) =>
    {
        if (countsArray[email] === undefined)
            countsArray[email] = 1;
        else countsArray[email] = countsArray[email] + 1
    });
    let dupEmails = false;
    usersEmail.every((email) =>
    {
        if (countsArray[email] > 1) dupEmails = true;
        return !dupEmails;
    });

    if (dupEmails)
        callback(new Error("should not allow duplicated emails"));
    else {
        let params = {roleName: roleName, userEmail: usersEmail, dereg: dereg, children: []};
        let params_id = {_id: _id, roleName: roleName, userEmail: usersEmail, dereg: dereg, children: []};
        userAccessor.createRole(_id === undefined ? params : params_id, (err, usersAndRole) =>
        {
            if (err) {
                callback(err);
            }
            else {
                callback(null, usersAndRole)
            }
        });
    }
}

function addAdmin(userEmail, callback)
{
    userAccessor.addAdmin({userEmail: userEmail}, (err) =>
    {
        if (err) {
            callback(err);
        }
        else {
            callback(null);
        }
    });
}

function includesRoleID(arr, roleID)
{
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].id.equals(roleID.id))
            return true;
    }
    return false;
}

function recursiveFatherOfDeregFinder(tree, roleID, dereg)
{
    for (let i = 0; i < tree.length; i++) {
        if (roleID.id.equals(tree[i]._id.id) && dereg === tree[i].dereg) {
            return tree[i]._id;
        }
        if (includesRoleID(tree[i].children, roleID)) {
            if (dereg === tree[i].dereg) {
                return tree[i]._id;
            }
            return recursiveFatherOfDeregFinder(tree, tree[i]._id, dereg);
        }
    }
    return null;
}

function getChildrenRecursive(role, roleMapping)
{
    let toReturn = [];
    for (let i = 0; i < role.userEmail.length; i++) {
        toReturn.push(role.userEmail[i]);
    }
    for (let i = 0; i < role.children.length; i++) {
        toReturn = toReturn.concat(getChildrenRecursive(roleMapping[role.children[i]], roleMapping));
    }
    return toReturn;
}

function updateDeletedRolesInEveryActiveProcess(deletedRolesIds, oldTree, rootID, callback)
{
    activeProcessAccessor.getActiveProcesses((err, processes) =>
    {
        if (err) {
            callback(err);
        }
        else {
            processes.forEach(process =>
            {
                process.stages.filter(stage => (stage.roleID !== undefined && stage.roleID != null)).forEach(stage =>
                {
                    if (deletedRolesIds.map(x => x.toString()).includes(stage.roleID.toString())) {
                        let findReplacement = (roleId) =>
                        {
                            let replacement = oldTree.getFatherOf(roleId);
                            if (replacement === undefined) {
                                return rootID;
                            }
                            if (deletedRolesIds.map(x => x.toString()).includes(replacement.toString())) {
                                return findReplacement(replacement);
                            }
                            else {
                                return replacement;
                            }
                        };
                        stage.roleID = findReplacement(stage.roleID);
                        stage.userEmail = null;
                        let notification = new Notification("התהליך " + process.processName + " מחכה ברשימת התהליכים הזמינים לך", "תהליך זמין");
                        module.exports.getEmailsByRoleId(stage.roleID, (err, userEmail) =>
                        {
                            if (Array.isArray(userEmail)) {
                                userEmail.forEach(userEmail =>
                                {
                                    notificationsAccessor.addNotification({
                                        userEmail: userEmail,
                                        notification: notification.getNotification(),
                                    })
                                });
                            }
                        });
                    }
                });
            });

            processes.reduce((prev, process) =>
            {
                return (err) =>
                {
                    if (err) {
                        prev(err)
                    }
                    else {
                        activeProcessAccessor.updateAllActiveProcesses({_id: process._id}, {$set: {stages: process.stages}}, prev);
                    }
                }
            }, callback)(null);
        }
    });
}

function removeDeletedEmailsFromActiveStages(oldUsersAndRoles, usersAndRoleDocuments, callback)
{
    let roleIdToDeletedEmail = {};
    usersAndRoleDocuments.forEach(usersAndRole =>
    {
        oldUsersAndRoles.usersAndRoles.forEach(_usersAndRole =>
        {
            if(_usersAndRole._id.toString() === usersAndRole._id.toString()){
                let deletedEmails = [];
                _usersAndRole.userEmail.forEach(_userEmail=>{
                    if(usersAndRole.userEmail.every(userEmail=>{
                        return userEmail !== _userEmail;
                    })){
                        deletedEmails.push(_userEmail);
                    }
                });
                if(deletedEmails.length !== 0){
                    roleIdToDeletedEmail[_usersAndRole._id.toString()] = deletedEmails;
                }
            }
        });
    });
    if(Object.keys(roleIdToDeletedEmail).length === 0){
        callback(null);
        return;
    }
    activeProcessAccessor.getActiveProcesses((err, processes) =>
    {
        if (err) {
            callback(err);
        }
        else {
            processes.forEach(process =>
            {
                process.stages.filter(stage => stage.roleID !== undefined).forEach(stage =>
                {
                    if (Object.keys(roleIdToDeletedEmail).includes(stage.roleID.toString())) {
                        if(stage.userEmail !== null){
                            if(roleIdToDeletedEmail[stage.roleID.toString()].includes(stage.userEmail)){
                                stage.userEmail = null;
                                let notification = new Notification("התהליך " + process.processName + " מחכה ברשימת התהליכים הזמינים לך", "תהליך זמין");
                                module.exports.getEmailsByRoleId(stage.roleID, (err, userEmail) =>
                                {
                                    if (Array.isArray(userEmail)) {
                                        userEmail.forEach(userEmail =>
                                        {
                                            notificationsAccessor.addNotification({
                                                userEmail: userEmail,
                                                notification: notification.getNotification(),
                                            })
                                        });
                                    }
                                });
                            }
                        }
                    }
                });
            });

            processes.reduce((prev, process) =>
            {
                return (err) =>
                {
                    if (err) {
                        prev(err)
                    }
                    else {
                        activeProcessAccessor.updateAllActiveProcesses({_id: process._id}, {$set: {stages: process.stages}}, prev);
                    }
                }
            }, callback)(null);
        }
    });
}

function emailValidator(email)
{
    let regularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regularExpression.test(String(email).toLowerCase());
}

function getRoleNamesForArray(stages, index, roleNamesArray, callback){
    if (index === stages.length) {
        callback(null, roleNamesArray);
        return;
    }
    let roleID = stages[index].roleID;
    (function (array, stageNum) {
        getRoleNameByRoleID(roleID, (err, roleName) => {
            if (err) callback(err);
            else {
                array.push([roleName, stageNum]);
                getRoleNamesForArray(stages, index + 1, roleNamesArray, callback);
            }
        });
    })(roleNamesArray, stages[index].stageNum);
}

module.exports.getRoleNamesForArray = getRoleNamesForArray;
module.exports.getRoleNameByRoleID = getRoleNameByRoleID;