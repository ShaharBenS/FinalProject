let userAccessor = require('../../models/accessors/usersAccessor');
let processStructureController = require('../processesControllers/processStructureController');
let usersAndRolesTree = require('../../domainObjects/usersAndRolesTree');
let usersAndRolesTreeSankey = require('../../domainObjects/usersAndRolesTreeSankey');

module.exports.getRoleToEmails = (callback) => {
    userAccessor.findRole({}, (err, roles) => {
        if (err) {
            callback(err);
        }
        callback(null, new usersAndRolesTree(roles).getRoleToEmails())
    })
};

module.exports.getIdToRole = (callback) => {
    userAccessor.findInSankeyTree({}, (err, sankeyTree) => {
        if (err) {
            callback(err);
        } else {
            if (sankeyTree.length === 0) {
                callback(null, {})
            } else {
                let sankey = new usersAndRolesTreeSankey(JSON.parse(sankeyTree[0].sankey));
                callback(null, sankey.getIdToRole())
            }
        }
    });
};

module.exports.addChildrenToRole = (roleObjectID, childrenObjectID, callback) => {
    userAccessor.updateRole({_id: roleObjectID}, {$push: {children: childrenObjectID}}, callback);
};

module.exports.addUsersAndRole = (_id, roleName, usersEmail, callback) => {
    let countsArray = {};
    usersEmail.forEach((email) => {
        if (countsArray[email] === undefined)
            countsArray[email] = 1;
        else countsArray[email] = countsArray[email] + 1
    });
    let dupEmails = false;
    usersEmail.every((email) => {
        if (countsArray[email] > 1) dupEmails = true;
        return !dupEmails;
    });

    if (dupEmails)
        callback(new Error("should not allow duplicated emails"));
    else {
        let params = {roleName: roleName, userEmail: usersEmail, children: []};
        let params_id = {_id: _id, roleName: roleName, userEmail: usersEmail, children: []};
        userAccessor.createRole(_id === undefined ? params : params_id, (err, usersAndRole) => {
            if (err) {
                callback(err);
            } else {
                callback(null, usersAndRole)
            }
        });
    }
};

module.exports.getAllRoles = (callback) => {
    return userAccessor.findRole({}, callback).select('roleName');
};

module.exports.getUsersAndRolesTree = (callback) => {
    userAccessor.findInSankeyTree({}, (err, result) => {
        if (err) {
            callback(err);
        } else if (result.length === 0) {
            userAccessor.createSankeyTree({sankey: JSON.stringify({content: {diagram: []}})}, (err, result) => {
                if (err) {
                    callback(err);
                } else {
                    callback(null, result);
                }
            });
        } else {
            callback(null, result[0]);
        }
    });
};

module.exports.setUsersAndRolesTree = (sankey, roleToEmails, callback) => {
    let sankeyTree = new usersAndRolesTreeSankey(JSON.parse(sankey));

    if (sankeyTree.hasMoreThanOneTree()) {
        callback('ERROR: there are two trees in the graph');
    } else if (sankeyTree.hasMultipleConnections()) {
        callback('ERROR: there are multiple connections between two nodes')
    } else if (sankeyTree.hasCycles()) {
        callback('ERROR: tree contains cycles');
    } else {
        userAccessor.findRole({}, (err, roles) => {
            if (err) {
                callback(err);
            } else {
                let oldUsersAndRoles = new usersAndRolesTree(roles);
                userAccessor.findInSankeyTree({}, (err, _sankeyTree) => {
                    if (err) {
                        callback(err);
                    } else {
                        let oldSankey = new usersAndRolesTreeSankey(JSON.parse(_sankeyTree[0].sankey));
                        userAccessor.updateSankeyTree({}, {sankey: sankey}, (err) => {
                            if (err) {
                                callback(err);
                            } else {
                                userAccessor.deleteAllRoles((err) => {
                                    if (err) {
                                        callback(err);
                                    } else {
                                        let roles = sankeyTree.getRoles();
                                        let connections = sankeyTree.getConnections();
                                        let usersAndRoleDocuments = [];
                                        roles.reduce((acc, role_figure) => {
                                            return (err) => {
                                                if (err) {
                                                    acc(err);
                                                } else {
                                                    let _id = undefined;
                                                    let roleName = role_figure.labels[0].text;
                                                    let existingRoleIndex = oldSankey.getRoles().findIndex(role => {
                                                        return role.id === role_figure.id;

                                                    });
                                                    if (existingRoleIndex > -1) {
                                                        let _roleName = oldSankey.getRoles()[existingRoleIndex].labels[0].text;
                                                        _id = oldUsersAndRoles.getIdByRoleName(_roleName);

                                                    }
                                                    this.addUsersAndRole(_id, roleName, roleToEmails[roleName], (_err, usersAndRole) => {
                                                        if (err) {
                                                            acc(err);
                                                        } else {
                                                            usersAndRoleDocuments.push(usersAndRole);
                                                            acc(null)
                                                        }
                                                    })
                                                }
                                            };
                                        }, (err) => {
                                            if (err) {
                                                callback(err);
                                            } else {
                                                let roleNames = usersAndRoleDocuments.map(usersAndRoleDocument => {
                                                    return usersAndRoleDocument.roleName;
                                                });
                                                let roleIDs = roles.map(role => role.id);

                                                connections.reduce((acc, connection) => {
                                                    return (err) => {
                                                        if (err) {
                                                            acc(err);
                                                        } else {
                                                            let fromNodeIndex = roleIDs.indexOf(connection.source.node);
                                                            let toNodeIndex = roleIDs.indexOf(connection.target.node);

                                                            let fromNodeRoleName = roles[fromNodeIndex].labels[0].text;
                                                            let toNodeRoleName = roles[toNodeIndex].labels[0].text;

                                                            let fromNodeRoleIndex = roleNames.indexOf(fromNodeRoleName);
                                                            let toNodeRoleIndex = roleNames.indexOf(toNodeRoleName);
                                                            // TODO: RoleIndex check if -1
                                                            let fromNodeID = usersAndRoleDocuments[fromNodeRoleIndex]._id;
                                                            let toNodeID = usersAndRoleDocuments[toNodeRoleIndex]._id;

                                                            this.addChildrenToRole(fromNodeID, toNodeID, (err) => {
                                                                if (err) {
                                                                    acc(err);
                                                                } else {
                                                                    acc(null);
                                                                }
                                                            })
                                                        }
                                                    };
                                                }, (err) => {
                                                    if (err) {
                                                        callback(err);
                                                    } else {
                                                        // All done here

                                                        // Looking for roles that have been removed.
                                                        let deletedRoles = [];
                                                        oldSankey.getRoles().forEach(role => {
                                                            if (sankeyTree.getRoles().every(n_role => {
                                                                return role.id !== n_role.id;
                                                            })) {
                                                                deletedRoles.push(role);
                                                            }
                                                        });
                                                        let deletedRolesIds = deletedRoles.map(role => {
                                                            return oldUsersAndRoles.getIdByRoleName(role.labels[0].text);
                                                        });
                                                        processStructureController.setProcessStructuresUnavailable(deletedRolesIds, (err) => {
                                                            if (err) {
                                                                callback(err);
                                                            } else {
                                                                callback(null);
                                                            }
                                                        });
                                                    }
                                                })(null);
                                            }
                                        })(null);
                                    }
                                });
                            }
                        })
                    }
                });
            }
        });
    }
};

module.exports.getRoleIdByUsername = function (username, callback) {
    userAccessor.findRole({userEmail: username}, (err, user) => {
        if (err) callback(err);
        else {
            if (user.length === 0) callback(new Error("no role found for username: " + username));
            else callback(null, user[0]._id);
        }
    });
};

module.exports.getRoleNameByRoleID = function (roleID, callback) {
    userAccessor.findRole({_id: roleID}, (err, user) => {
        if (err) callback(err);
        else {
            if (user.length === 0) callback(null, null);
            else callback(null, user[0].roleName);
        }
    });
};

module.exports.getAllUsers = (callback) =>
{
    let toReturn = [];
    userAccessor.findUser({}, (err, res) => {
        if (err) callback(err);
        else {
            for (let i = 0; i < res.length; i++) {
                for (let j = 0; j < res[i].userEmail.length; j++) {
                    toReturn.push(res[i].userEmail[j]);
                }
            }
            callback(null, toReturn);
        }
    });
};

module.exports.getRoleByRoleName = function (roleName, callback) {
    userAccessor.findRole({roleName: roleName}, (err, role) => {
        if (err) callback(err);
        else if (role.length === 0) callback(null, null);
        else callback(null, role[0]);
    })
};






