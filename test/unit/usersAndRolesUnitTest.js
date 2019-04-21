let mocha = require('mocha');
let describe = mocha.describe;
let it = mocha.it;
let assert = require('chai').assert;
let fs = require("fs");

let usersAndRolesTree = require('../../domainObjects/usersAndRolesTree');
let usersAndRolesTreeSankey = require('../../domainObjects/usersAndRolesTreeSankey');
let processStructureSankey = require('../../domainObjects/processStructureSankey');

let tree1 = JSON.parse(fs.readFileSync("./test/inputs/trees/tree1/tree1.json"));
let tree2 = JSON.parse(fs.readFileSync("./test/inputs/trees/tree2/tree2.json"));
let tree2_connections = JSON.parse(fs.readFileSync("./test/inputs/trees/tree2/tree2_connections.json"));
let tree2_roles = JSON.parse(fs.readFileSync("./test/inputs/trees/tree2/tree2_roles.json"));
let tree3 = JSON.parse(fs.readFileSync("./test/inputs/trees/tree3/tree3.json"));
let tree3_roles = JSON.parse(fs.readFileSync("./test/inputs/trees/tree3/tree3_roles.json"));
let tree4 = JSON.parse(fs.readFileSync("./test/inputs/trees/tree4/tree4.json"));
let tree5 = JSON.parse(fs.readFileSync("./test/inputs/trees/tree5/tree5.json"));
let tree6 = JSON.parse(fs.readFileSync("./test/inputs/trees/tree6/tree6.json"));


describe('1. users and roles tree', function ()
{
    it('1.1.1 get role to emails', function (done)
    {
        assert.deepEqual(new usersAndRolesTree([]).getRoleToEmails(), {});
        done();
    });
    it('1.1.1 get role to emails', function (done)
    {
        assert.deepEqual(new usersAndRolesTree([
            {
                _id: '',
                roleName: 'AA',
                userEmail: [],
                dereg:"1",
                children: [],
            }
        ]).getRoleToEmails(), {'AA': []});
        done();
    });
    it('1.1.1 get role to emails', function (done)
    {
        assert.deepEqual(new usersAndRolesTree([
            {
                _id: '',
                roleName: 'ROLE_A',
                userEmail: ['shalom@gmail.com'],
                dereg:"1",
                children: [],
            },
            {
                _id: '',
                roleName: 'ROLE_B',
                userEmail: [],
                dereg:"1",
                children: [],
            },
            {
                _id: '',
                roleName: 'ROLE_C',
                userEmail: ['a', '', 'c', 'd'],
                dereg:"1",
                children: [],
            },
            {
                _id: '',
                roleName: 'ROLE_D',
                userEmail: [],
                dereg:"1",
                children: [],
            },
            {
                _id: '',
                roleName: 'ROLE_E',
                userEmail: ['acadef1ef123eg2r4g24g@aef23f@235!#%#%'],
                dereg:"1",
                children: [],
            }
        ]).getRoleToEmails(), {
            'ROLE_A': ['shalom@gmail.com'],
            'ROLE_B': [],
            'ROLE_C': ['a', '', 'c', 'd'],
            'ROLE_D': [],
            'ROLE_E': ['acadef1ef123eg2r4g24g@aef23f@235!#%#%']
        });
        done();
    });
    it('1.2 get role to dereg', function (done)
    {
        assert.deepEqual(new usersAndRolesTree([]).getRoleToDereg(), {});
        assert.deepEqual(new usersAndRolesTree([
            {
                _id: '',
                roleName: 'ROLE_A',
                userEmail: ['shalom@gmail.com'],
                dereg:"1",
                children: [],
            },
            {
                _id: '',
                roleName: 'ROLE_B',
                userEmail: [],
                dereg:"2",
                children: [],
            },
            {
                _id: '',
                roleName: 'ROLE_C',
                userEmail: ['a', '', 'c', 'd'],
                dereg:"1",
                children: [],
            },
            {
                _id: '',
                roleName: 'ROLE_D',
                userEmail: [],
                dereg:"3",
                children: [],
            },
            {
                _id: '',
                roleName: 'ROLE_E',
                userEmail: ['acadef1ef123eg2r4g24g@aef23f@235!#%#%'],
                dereg:"4",
                children: [],
            }
        ]).getRoleToDereg(), {
            'ROLE_A': "1",
            'ROLE_B': "2",
            'ROLE_C': "1",
            'ROLE_D': "3",
            'ROLE_E': "4"
        });
        done();
    });
    it('1.3 get id by role name', function (done)
    {
        assert.deepEqual(new usersAndRolesTree([]).getIdByRoleName(), undefined);
        let _tree = new usersAndRolesTree([
            {
                _id: '111',
                roleName: 'ROLE_A',
                userEmail: ['shalom@gmail.com'],
                dereg:"1",
                children: [],
            },
            {
                _id: '222',
                roleName: 'ROLE_B',
                userEmail: [],
                dereg:"2",
                children: [],
            },
            {
                _id: '333',
                roleName: 'ROLE_C',
                userEmail: ['a', '', 'c', 'd'],
                dereg:"1",
                children: [],
            },
            {
                _id: '444',
                roleName: 'ROLE_D',
                userEmail: [],
                dereg:"3",
                children: [],
            },
            {
                _id: '555',
                roleName: 'ROLE_E',
                userEmail: ['acadef1ef123eg2r4g24g@aef23f@235!#%#%'],
                dereg:"4",
                children: [],
            }
        ]);
        assert.deepEqual(_tree.getIdByRoleName("ROLE_E"), '555');
        assert.deepEqual(_tree.getIdByRoleName("ROLE_D"), '444');
        assert.deepEqual(_tree.getIdByRoleName("asd"), undefined);
        done();
    });
    it('1.4 get father of', function (done)
    {
        assert.deepEqual(new usersAndRolesTree([]).getFatherOf(""), undefined);
        let _tree = new usersAndRolesTree([
            {
                _id: '111',
                roleName: 'ROLE_A',
                userEmail: ['shalom@gmail.com'],
                dereg:"1",
                children: ['444'],
            },
            {
                _id: '222',
                roleName: 'ROLE_B',
                userEmail: [],
                dereg:"2",
                children: ['111'],
            },
            {
                _id: '333',
                roleName: 'ROLE_C',
                userEmail: ['a', '', 'c', 'd'],
                dereg:"1",
                children: ['222','111'],
            },
            {
                _id: '444',
                roleName: 'ROLE_D',
                userEmail: [],
                dereg:"3",
                children: ['555'],
            },
            {
                _id: '555',
                roleName: 'ROLE_E',
                userEmail: ['acadef1ef123eg2r4g24g@aef23f@235!#%#%'],
                dereg:"4",
                children: [],
            }
        ]);
        assert.deepEqual(_tree.getFatherOf("555"), '444');
        assert.deepEqual(_tree.getFatherOf("444"), '111');
        assert.deepEqual(_tree.getFatherOf("000"), undefined);
        done();
    });
});

describe('2. users and roles tree sankey', function ()
{
    it('2.1.1 users and roles tree sankey get roles', function (done)
    {
        assert.deepEqual(new usersAndRolesTreeSankey(tree1).getRoles(), []);
        done();
    });
    it('2.1.2 users and roles tree sankey get roles', function (done)
    {
        assert.deepEqual(new usersAndRolesTreeSankey(tree2).getRoles(), tree2_roles);
        done();
    });
    it('2.1.3 users and roles tree sankey get roles', function (done)
    {
        assert.deepEqual(new usersAndRolesTreeSankey(tree3).getRoles(), tree3_roles);
        done();
    });
    it('2.2.1 users and roles tree sankey get connections', function (done)
    {
        assert.deepEqual(new usersAndRolesTreeSankey(tree1).getConnections(), []);
        done();
    });
    it('2.2.2 users and roles tree sankey get connections', function (done)
    {
        assert.deepEqual(new usersAndRolesTreeSankey(tree2).getConnections(), tree2_connections);
        done();
    });
    it('2.2.3 users and roles tree sankey get connections', function (done)
    {
        assert.deepEqual(new usersAndRolesTreeSankey(tree3).getConnections(), []);
        done();
    });

    it('2.3.1 users and roles tree sankey get id to Role', function (done)
    {
        assert.deepEqual(new usersAndRolesTreeSankey(tree1).getIdToRole(), {});
        done();
    });

    it('2.3.2 users and roles tree sankey get id to Role', function (done)
    {
        assert.deepEqual(new usersAndRolesTreeSankey(tree2).getIdToRole(),
            {"ccf67efd-d809-4d6d-e35e-6e54c4ea0b4e":"AA",
                "601e6f35-92a3-42e3-8e4f-aff052eb2d92":"BB",
                "4e08b28a-1498-4c02-a5df-9975b99a6124":"CC",
                "7f8a030d-d158-446e-74da-b5e0a8624a2a":"DD"
        });
        done();
    });

    it('2.4.1 users and roles tree sankey has cycles', function (done)
    {
        assert.deepEqual(new usersAndRolesTreeSankey(tree1).hasCycles(), false);
        done();
    });

    it('2.4.2 users and roles tree sankey has cycles', function (done)
    {
        assert.deepEqual(new usersAndRolesTreeSankey(tree2).hasCycles(), true);
        done();
    });

    it('2.4.3 users and roles tree sankey has cycles', function (done)
    {
        assert.deepEqual(new usersAndRolesTreeSankey(tree4).hasCycles(), true);
        done();
    });

    it('2.5.1 users and roles tree sankey has cycles', function (done)
    {
        assert.deepEqual(new usersAndRolesTreeSankey(tree6).hasMultipleConnections(), true);
        done();
    });

    it('2.5.2 users and roles tree sankey has cycles', function (done)
    {
        assert.deepEqual(new usersAndRolesTreeSankey(tree5).hasMultipleConnections(), false);
        done();
    });

    it('2.5.3 users and roles tree sankey has cycles', function (done)
    {
        assert.deepEqual(new usersAndRolesTreeSankey(tree4).hasMultipleConnections(), false);
        done();
    });

    it('2.6.1 users and roles tree sankey has more than one tree', function (done)
    {
        assert.deepEqual(new usersAndRolesTreeSankey(tree4).hasMoreThanOneTree(), true);
        done();
    });

    it('2.6.2 users and roles tree sankey has more than one tree', function (done)
    {
        assert.deepEqual(new usersAndRolesTreeSankey(tree5).hasMoreThanOneTree(), true);
        done();
    });

    it('2.6.3 users and roles tree sankey has more than one tree', function (done)
    {
        assert.deepEqual(new usersAndRolesTreeSankey(tree6).hasMoreThanOneTree(), true);
        done();
    });
});




describe('3. process structure sankey', function ()
{
    it('3.1.1 process structure sankey get sankey stages', function (done)
    {
        assert.deepEqual(new processStructureSankey(JSON.parse(tree1)).getSankeyStages(),[]);
        done();
    });

    it('3.1.2 process structure sankey get sankey stages', function (done)
    {
        assert.deepEqual(new processStructureSankey(JSON.parse(process_structure_sankey1)).getSankeyStages(),JSON.parse(process_structure_sankey1_sankey_stages));
        done();
    });

    it('3.2.1 process structure sankey get stages', function (done)
    {
        assert.deepEqual(new processStructureSankey(JSON.parse(tree1)).getStages(),[]);
        done();
    });

    it('3.2.2 process structure sankey get stages', function (done)
    {
        let rolesToId = {'DD':'1','CC':'2','RR':'3'};
        assert.deepEqual(new processStructureSankey(JSON.parse(process_structure_sankey1)).getStages((roleName)=>rolesToId[roleName]),[
            {
                "attachedFilesNames": [],
                "nextStages": [
                    1
                ],
                "onlineForms": [],
                "roleID": "1",
                "stageNum": 0,
                "stagesToWaitFor": []
            },
            {
                "attachedFilesNames": [],
                "nextStages": [
                    2
                ],
                "onlineForms": [],
                "roleID": "2",
                "stageNum": 1,
                "stagesToWaitFor": [
                    0
                ],
            },
            {
                "attachedFilesNames": [],
                "nextStages": [],
                "onlineForms": [],
                "roleID": "3",
                "stageNum": 2,
                "stagesToWaitFor": [
                    1
                ]
            }
        ]);
        done();
    });

    it('3.2.3 process structure sankey get stages', function (done)
    {
        let rolesToId = {'DD':'1','CC':'2','RR':'3'};
        assert.deepEqual(new processStructureSankey(JSON.parse(process_structure_sankey2)).getStages((roleName)=>rolesToId[roleName]),[
            {
                "attachedFilesNames": [],
                "nextStages": [
                    1
                ],
                "onlineForms": [],
                "roleID": "3",
                "stageNum": 0,
                "stagesToWaitFor": [],
            },
            {
                "attachedFilesNames": [],
                "nextStages": [
                    2
                ],
                "onlineForms": [],
                "roleID": "1",
                "stageNum": 1,
                "stagesToWaitFor": [
                    0
                ],
            },
            {
                "attachedFilesNames": [],
                "nextStages": [
                    4,
                    3
                ],
                "onlineForms": [],
                "roleID": "2",
                "stageNum": 2,
                "stagesToWaitFor": [
                    1
                ]
            },
            {
                "attachedFilesNames": [],
                "nextStages": [
                    5
                ],
                "onlineForms": [],
                "roleID": "1",
                "stageNum": 3,
                "stagesToWaitFor": [
                    2
                ]
            },
            {
                "attachedFilesNames": [],
                "nextStages": [
                    5
                ],
                "onlineForms": [],
                "roleID": "3",
                "stageNum": 4,
                "stagesToWaitFor": [
                    2
                ],
            },
            {
                "attachedFilesNames": [],
                "nextStages": [],
                "onlineForms": [],
                "roleID": "2",
                "stageNum": 5,
                "stagesToWaitFor": [
                    4,
                    3
                ]
            }
        ]);
        done();
    });

    it('3.3.1 process structure sankey get connections', function (done)
    {
        assert.deepEqual(new processStructureSankey(JSON.parse(tree1)).getConnections(),[]);
        done();
    });

    it('3.3.2 process structure sankey get connections', function (done)
    {
        assert.deepEqual(new processStructureSankey(JSON.parse(process_structure_sankey1)).getConnections(),JSON.parse(process_structure_sankey1_connections));
        done();
    });

    it('3.4.1 process structure sankey get initials', function (done)
    {
        assert.deepEqual(new processStructureSankey(JSON.parse(tree1)).getInitials(),[]);
        done();
    });

    it('3.4.2 process structure sankey get initials', function (done)
    {
        assert.deepEqual(new processStructureSankey(JSON.parse(process_structure_sankey1)).getInitials(),[0]);
        done();
    });

    it('3.4.3 process structure sankey get initials', function (done)
    {
        assert.deepEqual(new processStructureSankey(JSON.parse(process_structure_sankey2)).getInitials(),[0,2]);
        done();
    });
});