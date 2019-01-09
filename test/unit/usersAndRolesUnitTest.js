let mocha = require('mocha');
let describe = mocha.describe;
let it = mocha.it;
let assert = require('chai').assert;

let usersAndRolesTree = require('../../domainObjects/usersAndRolesTree');
let usersAndRolesTreeSankey = require('../../domainObjects/usersAndRolesTreeSankey');
let processStructureSankey = require('../../domainObjects/processStructureSankey');

describe('1. users and roles tree', function ()
{
    it('1.1.1 get role to emails', function (done)
    {
        assert.deepEqual(new usersAndRolesTree([]).getRoleToEmails(), {});
        done();
    });
    it('1.1.2 get role to emails', function (done)
    {
        assert.deepEqual(new usersAndRolesTree([
            {
                _id: '',
                roleName: 'AA',
                userEmail: [],
                children: [],
            }
        ]).getRoleToEmails(), {'AA': []});
        done();
    });
    it('1.1.3 get role to emails', function (done)
    {
        assert.deepEqual(new usersAndRolesTree([
            {
                _id: '',
                roleName: 'ROLE_A',
                userEmail: ['shalom@gmail.com'],
                children: [],
            },
            {
                _id: '',
                roleName: 'ROLE_B',
                userEmail: [],
                children: [],
            },
            {
                _id: '',
                roleName: 'ROLE_C',
                userEmail: ['a', '', 'c', 'd'],
                children: [],
            },
            {
                _id: '',
                roleName: 'ROLE_D',
                userEmail: [],
                children: [],
            },
            {
                _id: '',
                roleName: 'ROLE_E',
                userEmail: ['acadef1ef123eg2r4g24g@aef23f@235!#%#%'],
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
});

describe('2. users and roles tree sankey', function ()
{
    it('2.1.1 users and roles tree sankey get roles', function (done)
    {
        assert.deepEqual(new usersAndRolesTreeSankey(JSON.parse(tree1)).getRoles(), []);
        done();
    });
    it('2.1.2 users and roles tree sankey get roles', function (done)
    {
        assert.deepEqual(new usersAndRolesTreeSankey(JSON.parse(tree2)).getRoles(), JSON.parse(tree2_roles));
        done();
    });
    it('2.1.3 users and roles tree sankey get roles', function (done)
    {
        assert.deepEqual(new usersAndRolesTreeSankey(JSON.parse(tree3)).getRoles(), JSON.parse(tree3_roles));
        done();
    });
    it('2.2.1 users and roles tree sankey get connections', function (done)
    {
        assert.deepEqual(new usersAndRolesTreeSankey(JSON.parse(tree1)).getConnections(), []);
        done();
    });
    it('2.2.2 users and roles tree sankey get connections', function (done)
    {
        assert.deepEqual(new usersAndRolesTreeSankey(JSON.parse(tree2)).getConnections(), JSON.parse(tree2_connections));
        done();
    });
    it('2.2.3 users and roles tree sankey get connections', function (done)
    {
        assert.deepEqual(new usersAndRolesTreeSankey(JSON.parse(tree3)).getConnections(), []);
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


let tree1 = '{\n' +
    '  "content": {\n' +
    '  "diagram": []  }  }';
let tree2 = '{\n' +
    '  "content": {\n' +
    '    "diagram": [\n' +
    '      {\n' +
    '        "type": "sankey.shape.State",\n' +
    '        "id": "ccf67efd-d809-4d6d-e35e-6e54c4ea0b4e",\n' +
    '        "x": 1049,\n' +
    '        "y": 351,\n' +
    '        "width": 50,\n' +
    '        "height": 50,\n' +
    '        "alpha": 1,\n' +
    '        "angle": 0,\n' +
    '        "userData": {},\n' +
    '        "cssClass": "sankey_shape_State",\n' +
    '        "bgColor": "#FFB224",\n' +
    '        "color": "#000000",\n' +
    '        "stroke": 1,\n' +
    '        "radius": 0,\n' +
    '        "dasharray": null,\n' +
    '        "labels": [\n' +
    '          {\n' +
    '            "type": "draw2d.shape.basic.Label",\n' +
    '            "id": "19f7336d-8762-eec4-17ab-3bf2b8389861",\n' +
    '            "x": 9.5,\n' +
    '            "y": 11.5,\n' +
    '            "width": 25,\n' +
    '            "height": 19,\n' +
    '            "alpha": 1,\n' +
    '            "angle": 270,\n' +
    '            "userData": {},\n' +
    '            "cssClass": "draw2d_shape_basic_Label",\n' +
    '            "ports": [],\n' +
    '            "bgColor": "none",\n' +
    '            "color": "#1B1B1B",\n' +
    '            "stroke": 0,\n' +
    '            "radius": 0,\n' +
    '            "dasharray": null,\n' +
    '            "text": "AA",\n' +
    '            "outlineStroke": 0,\n' +
    '            "outlineColor": "none",\n' +
    '            "fontSize": 18,\n' +
    '            "fontColor": "#FFFFFF",\n' +
    '            "fontFamily": null,\n' +
    '            "editor": "draw2d.ui.LabelInplaceEditor",\n' +
    '            "locator": "draw2d.layout.locator.CenterLocator"\n' +
    '          }\n' +
    '        ]\n' +
    '      },\n' +
    '      {\n' +
    '        "type": "sankey.shape.State",\n' +
    '        "id": "601e6f35-92a3-42e3-8e4f-aff052eb2d92",\n' +
    '        "x": 1328,\n' +
    '        "y": 351,\n' +
    '        "width": 50,\n' +
    '        "height": 50,\n' +
    '        "alpha": 1,\n' +
    '        "angle": 0,\n' +
    '        "userData": {},\n' +
    '        "cssClass": "sankey_shape_State",\n' +
    '        "bgColor": "#FFB224",\n' +
    '        "color": "#000000",\n' +
    '        "stroke": 1,\n' +
    '        "radius": 0,\n' +
    '        "dasharray": null,\n' +
    '        "labels": [\n' +
    '          {\n' +
    '            "type": "draw2d.shape.basic.Label",\n' +
    '            "id": "034aff7d-09b4-23a5-d218-a52e93d657c1",\n' +
    '            "x": 9.5,\n' +
    '            "y": 11.5,\n' +
    '            "width": 25,\n' +
    '            "height": 19,\n' +
    '            "alpha": 1,\n' +
    '            "angle": 270,\n' +
    '            "userData": {},\n' +
    '            "cssClass": "draw2d_shape_basic_Label",\n' +
    '            "ports": [],\n' +
    '            "bgColor": "none",\n' +
    '            "color": "#1B1B1B",\n' +
    '            "stroke": 0,\n' +
    '            "radius": 0,\n' +
    '            "dasharray": null,\n' +
    '            "text": "BB",\n' +
    '            "outlineStroke": 0,\n' +
    '            "outlineColor": "none",\n' +
    '            "fontSize": 18,\n' +
    '            "fontColor": "#FFFFFF",\n' +
    '            "fontFamily": null,\n' +
    '            "editor": "draw2d.ui.LabelInplaceEditor",\n' +
    '            "locator": "draw2d.layout.locator.CenterLocator"\n' +
    '          }\n' +
    '        ]\n' +
    '      },\n' +
    '      {\n' +
    '        "type": "sankey.shape.State",\n' +
    '        "id": "4e08b28a-1498-4c02-a5df-9975b99a6124",\n' +
    '        "x": 1552,\n' +
    '        "y": 359,\n' +
    '        "width": 40,\n' +
    '        "height": 38,\n' +
    '        "alpha": 1,\n' +
    '        "angle": 0,\n' +
    '        "userData": {},\n' +
    '        "cssClass": "sankey_shape_State",\n' +
    '        "bgColor": "#FFB224",\n' +
    '        "color": "#000000",\n' +
    '        "stroke": 1,\n' +
    '        "radius": 0,\n' +
    '        "dasharray": null,\n' +
    '        "labels": [\n' +
    '          {\n' +
    '            "type": "draw2d.shape.basic.Label",\n' +
    '            "id": "5b1dcc74-4126-9bac-fca3-acb691d6f4bc",\n' +
    '            "x": 3.5,\n' +
    '            "y": 5.5,\n' +
    '            "width": 25,\n' +
    '            "height": 19,\n' +
    '            "alpha": 1,\n' +
    '            "angle": 270,\n' +
    '            "userData": {},\n' +
    '            "cssClass": "draw2d_shape_basic_Label",\n' +
    '            "ports": [],\n' +
    '            "bgColor": "none",\n' +
    '            "color": "#1B1B1B",\n' +
    '            "stroke": 0,\n' +
    '            "radius": 0,\n' +
    '            "dasharray": null,\n' +
    '            "text": "CC",\n' +
    '            "outlineStroke": 0,\n' +
    '            "outlineColor": "none",\n' +
    '            "fontSize": 18,\n' +
    '            "fontColor": "#FFFFFF",\n' +
    '            "fontFamily": null,\n' +
    '            "editor": "draw2d.ui.LabelInplaceEditor",\n' +
    '            "locator": "draw2d.layout.locator.CenterLocator"\n' +
    '          }\n' +
    '        ]\n' +
    '      },\n' +
    '      {\n' +
    '        "type": "sankey.shape.State",\n' +
    '        "id": "7f8a030d-d158-446e-74da-b5e0a8624a2a",\n' +
    '        "x": 1325,\n' +
    '        "y": 441,\n' +
    '        "width": 50,\n' +
    '        "height": 50,\n' +
    '        "alpha": 1,\n' +
    '        "angle": 0,\n' +
    '        "userData": {},\n' +
    '        "cssClass": "sankey_shape_State",\n' +
    '        "bgColor": "#FFB224",\n' +
    '        "color": "#000000",\n' +
    '        "stroke": 1,\n' +
    '        "radius": 0,\n' +
    '        "dasharray": null,\n' +
    '        "labels": [\n' +
    '          {\n' +
    '            "type": "draw2d.shape.basic.Label",\n' +
    '            "id": "b9dec1a0-ac43-41f2-890a-db27d79d4db8",\n' +
    '            "x": 8.5,\n' +
    '            "y": 11.5,\n' +
    '            "width": 25,\n' +
    '            "height": 19,\n' +
    '            "alpha": 1,\n' +
    '            "angle": 270,\n' +
    '            "userData": {},\n' +
    '            "cssClass": "draw2d_shape_basic_Label",\n' +
    '            "ports": [],\n' +
    '            "bgColor": "none",\n' +
    '            "color": "#1B1B1B",\n' +
    '            "stroke": 0,\n' +
    '            "radius": 0,\n' +
    '            "dasharray": null,\n' +
    '            "text": "DD",\n' +
    '            "outlineStroke": 0,\n' +
    '            "outlineColor": "none",\n' +
    '            "fontSize": 18,\n' +
    '            "fontColor": "#FFFFFF",\n' +
    '            "fontFamily": null,\n' +
    '            "editor": "draw2d.ui.LabelInplaceEditor",\n' +
    '            "locator": "draw2d.layout.locator.CenterLocator"\n' +
    '          }\n' +
    '        ]\n' +
    '      },\n' +
    '      {\n' +
    '        "type": "sankey.shape.Connection",\n' +
    '        "id": "524e8888-8b32-94ac-74ce-e3bc6c524973",\n' +
    '        "alpha": 1,\n' +
    '        "angle": 0,\n' +
    '        "userData": {\n' +
    '          "jsonPath": ""\n' +
    '        },\n' +
    '        "cssClass": "sankey_shape_Connection",\n' +
    '        "stroke": 5,\n' +
    '        "color": "#129CE4",\n' +
    '        "outlineStroke": 0,\n' +
    '        "outlineColor": "none",\n' +
    '        "dasharray": "-",\n' +
    '        "policy": "draw2d.policy.line.OrthogonalSelectionFeedbackPolicy",\n' +
    '        "vertex": [\n' +
    '          {\n' +
    '            "x": 1099,\n' +
    '            "y": 363.5\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1213.5,\n' +
    '            "y": 363.5\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1213.5,\n' +
    '            "y": 376\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1328,\n' +
    '            "y": 376\n' +
    '          }\n' +
    '        ],\n' +
    '        "router": "draw2d.layout.connection.InteractiveManhattanConnectionRouter",\n' +
    '        "radius": 3,\n' +
    '        "routingMetaData": {\n' +
    '          "routedByUserInteraction": false,\n' +
    '          "fromDir": 1,\n' +
    '          "toDir": 3\n' +
    '        },\n' +
    '        "source": {\n' +
    '          "node": "ccf67efd-d809-4d6d-e35e-6e54c4ea0b4e",\n' +
    '          "port": "output0"\n' +
    '        },\n' +
    '        "target": {\n' +
    '          "node": "601e6f35-92a3-42e3-8e4f-aff052eb2d92",\n' +
    '          "port": "input0",\n' +
    '          "decoration": "draw2d.decoration.connection.ArrowDecorator"\n' +
    '        },\n' +
    '        "labels": []\n' +
    '      },\n' +
    '      {\n' +
    '        "type": "sankey.shape.Connection",\n' +
    '        "id": "493ad9e4-266c-5358-0f43-d694e7391ed3",\n' +
    '        "alpha": 1,\n' +
    '        "angle": 0,\n' +
    '        "userData": {\n' +
    '          "jsonPath": ""\n' +
    '        },\n' +
    '        "cssClass": "sankey_shape_Connection",\n' +
    '        "stroke": 5,\n' +
    '        "color": "#129CE4",\n' +
    '        "outlineStroke": 0,\n' +
    '        "outlineColor": "none",\n' +
    '        "dasharray": "-",\n' +
    '        "policy": "draw2d.policy.line.OrthogonalSelectionFeedbackPolicy",\n' +
    '        "vertex": [\n' +
    '          {\n' +
    '            "x": 1099,\n' +
    '            "y": 388.5\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1212,\n' +
    '            "y": 388.5\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1212,\n' +
    '            "y": 466\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1325,\n' +
    '            "y": 466\n' +
    '          }\n' +
    '        ],\n' +
    '        "router": "draw2d.layout.connection.InteractiveManhattanConnectionRouter",\n' +
    '        "radius": 3,\n' +
    '        "routingMetaData": {\n' +
    '          "routedByUserInteraction": false,\n' +
    '          "fromDir": 1,\n' +
    '          "toDir": 3\n' +
    '        },\n' +
    '        "source": {\n' +
    '          "node": "ccf67efd-d809-4d6d-e35e-6e54c4ea0b4e",\n' +
    '          "port": "output0"\n' +
    '        },\n' +
    '        "target": {\n' +
    '          "node": "7f8a030d-d158-446e-74da-b5e0a8624a2a",\n' +
    '          "port": "input0",\n' +
    '          "decoration": "draw2d.decoration.connection.ArrowDecorator"\n' +
    '        },\n' +
    '        "labels": []\n' +
    '      },\n' +
    '      {\n' +
    '        "type": "sankey.shape.Connection",\n' +
    '        "id": "82f7766a-873d-d0fc-6a09-9d81fc428117",\n' +
    '        "alpha": 1,\n' +
    '        "angle": 0,\n' +
    '        "userData": {\n' +
    '          "jsonPath": ""\n' +
    '        },\n' +
    '        "cssClass": "sankey_shape_Connection",\n' +
    '        "stroke": 5,\n' +
    '        "color": "#129CE4",\n' +
    '        "outlineStroke": 0,\n' +
    '        "outlineColor": "none",\n' +
    '        "dasharray": "-",\n' +
    '        "policy": "draw2d.policy.line.OrthogonalSelectionFeedbackPolicy",\n' +
    '        "vertex": [\n' +
    '          {\n' +
    '            "x": 1375,\n' +
    '            "y": 466\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1463.5,\n' +
    '            "y": 466\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1463.5,\n' +
    '            "y": 387.5\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1552,\n' +
    '            "y": 387.5\n' +
    '          }\n' +
    '        ],\n' +
    '        "router": "draw2d.layout.connection.InteractiveManhattanConnectionRouter",\n' +
    '        "radius": 3,\n' +
    '        "routingMetaData": {\n' +
    '          "routedByUserInteraction": false,\n' +
    '          "fromDir": 1,\n' +
    '          "toDir": 3\n' +
    '        },\n' +
    '        "source": {\n' +
    '          "node": "7f8a030d-d158-446e-74da-b5e0a8624a2a",\n' +
    '          "port": "output0"\n' +
    '        },\n' +
    '        "target": {\n' +
    '          "node": "4e08b28a-1498-4c02-a5df-9975b99a6124",\n' +
    '          "port": "input0",\n' +
    '          "decoration": "draw2d.decoration.connection.ArrowDecorator"\n' +
    '        },\n' +
    '        "labels": []\n' +
    '      },\n' +
    '      {\n' +
    '        "type": "sankey.shape.Connection",\n' +
    '        "id": "21af4e93-ec69-fed1-1906-7354ad7eb883",\n' +
    '        "alpha": 1,\n' +
    '        "angle": 0,\n' +
    '        "userData": {\n' +
    '          "jsonPath": ""\n' +
    '        },\n' +
    '        "cssClass": "sankey_shape_Connection",\n' +
    '        "stroke": 5,\n' +
    '        "color": "#129CE4",\n' +
    '        "outlineStroke": 0,\n' +
    '        "outlineColor": "none",\n' +
    '        "dasharray": "-",\n' +
    '        "policy": "draw2d.policy.line.OrthogonalSelectionFeedbackPolicy",\n' +
    '        "vertex": [\n' +
    '          {\n' +
    '            "x": 1378,\n' +
    '            "y": 376\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1465,\n' +
    '            "y": 376\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1465,\n' +
    '            "y": 368.5\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1552,\n' +
    '            "y": 368.5\n' +
    '          }\n' +
    '        ],\n' +
    '        "router": "draw2d.layout.connection.InteractiveManhattanConnectionRouter",\n' +
    '        "radius": 3,\n' +
    '        "routingMetaData": {\n' +
    '          "routedByUserInteraction": false,\n' +
    '          "fromDir": 1,\n' +
    '          "toDir": 3\n' +
    '        },\n' +
    '        "source": {\n' +
    '          "node": "601e6f35-92a3-42e3-8e4f-aff052eb2d92",\n' +
    '          "port": "output0"\n' +
    '        },\n' +
    '        "target": {\n' +
    '          "node": "4e08b28a-1498-4c02-a5df-9975b99a6124",\n' +
    '          "port": "input0",\n' +
    '          "decoration": "draw2d.decoration.connection.ArrowDecorator"\n' +
    '        },\n' +
    '        "labels": []\n' +
    '      }\n' +
    '    ]\n' +
    '  }\n' +
    '}';
let tree2_roles = '[\n' +
    '      {\n' +
    '        "type": "sankey.shape.State",\n' +
    '        "id": "ccf67efd-d809-4d6d-e35e-6e54c4ea0b4e",\n' +
    '        "x": 1049,\n' +
    '        "y": 351,\n' +
    '        "width": 50,\n' +
    '        "height": 50,\n' +
    '        "alpha": 1,\n' +
    '        "angle": 0,\n' +
    '        "userData": {},\n' +
    '        "cssClass": "sankey_shape_State",\n' +
    '        "bgColor": "#FFB224",\n' +
    '        "color": "#000000",\n' +
    '        "stroke": 1,\n' +
    '        "radius": 0,\n' +
    '        "dasharray": null,\n' +
    '        "labels": [\n' +
    '          {\n' +
    '            "type": "draw2d.shape.basic.Label",\n' +
    '            "id": "19f7336d-8762-eec4-17ab-3bf2b8389861",\n' +
    '            "x": 9.5,\n' +
    '            "y": 11.5,\n' +
    '            "width": 25,\n' +
    '            "height": 19,\n' +
    '            "alpha": 1,\n' +
    '            "angle": 270,\n' +
    '            "userData": {},\n' +
    '            "cssClass": "draw2d_shape_basic_Label",\n' +
    '            "ports": [],\n' +
    '            "bgColor": "none",\n' +
    '            "color": "#1B1B1B",\n' +
    '            "stroke": 0,\n' +
    '            "radius": 0,\n' +
    '            "dasharray": null,\n' +
    '            "text": "AA",\n' +
    '            "outlineStroke": 0,\n' +
    '            "outlineColor": "none",\n' +
    '            "fontSize": 18,\n' +
    '            "fontColor": "#FFFFFF",\n' +
    '            "fontFamily": null,\n' +
    '            "editor": "draw2d.ui.LabelInplaceEditor",\n' +
    '            "locator": "draw2d.layout.locator.CenterLocator"\n' +
    '          }\n' +
    '        ]\n' +
    '      },\n' +
    '      {\n' +
    '        "type": "sankey.shape.State",\n' +
    '        "id": "601e6f35-92a3-42e3-8e4f-aff052eb2d92",\n' +
    '        "x": 1328,\n' +
    '        "y": 351,\n' +
    '        "width": 50,\n' +
    '        "height": 50,\n' +
    '        "alpha": 1,\n' +
    '        "angle": 0,\n' +
    '        "userData": {},\n' +
    '        "cssClass": "sankey_shape_State",\n' +
    '        "bgColor": "#FFB224",\n' +
    '        "color": "#000000",\n' +
    '        "stroke": 1,\n' +
    '        "radius": 0,\n' +
    '        "dasharray": null,\n' +
    '        "labels": [\n' +
    '          {\n' +
    '            "type": "draw2d.shape.basic.Label",\n' +
    '            "id": "034aff7d-09b4-23a5-d218-a52e93d657c1",\n' +
    '            "x": 9.5,\n' +
    '            "y": 11.5,\n' +
    '            "width": 25,\n' +
    '            "height": 19,\n' +
    '            "alpha": 1,\n' +
    '            "angle": 270,\n' +
    '            "userData": {},\n' +
    '            "cssClass": "draw2d_shape_basic_Label",\n' +
    '            "ports": [],\n' +
    '            "bgColor": "none",\n' +
    '            "color": "#1B1B1B",\n' +
    '            "stroke": 0,\n' +
    '            "radius": 0,\n' +
    '            "dasharray": null,\n' +
    '            "text": "BB",\n' +
    '            "outlineStroke": 0,\n' +
    '            "outlineColor": "none",\n' +
    '            "fontSize": 18,\n' +
    '            "fontColor": "#FFFFFF",\n' +
    '            "fontFamily": null,\n' +
    '            "editor": "draw2d.ui.LabelInplaceEditor",\n' +
    '            "locator": "draw2d.layout.locator.CenterLocator"\n' +
    '          }\n' +
    '        ]\n' +
    '      },\n' +
    '      {\n' +
    '        "type": "sankey.shape.State",\n' +
    '        "id": "4e08b28a-1498-4c02-a5df-9975b99a6124",\n' +
    '        "x": 1552,\n' +
    '        "y": 359,\n' +
    '        "width": 40,\n' +
    '        "height": 38,\n' +
    '        "alpha": 1,\n' +
    '        "angle": 0,\n' +
    '        "userData": {},\n' +
    '        "cssClass": "sankey_shape_State",\n' +
    '        "bgColor": "#FFB224",\n' +
    '        "color": "#000000",\n' +
    '        "stroke": 1,\n' +
    '        "radius": 0,\n' +
    '        "dasharray": null,\n' +
    '        "labels": [\n' +
    '          {\n' +
    '            "type": "draw2d.shape.basic.Label",\n' +
    '            "id": "5b1dcc74-4126-9bac-fca3-acb691d6f4bc",\n' +
    '            "x": 3.5,\n' +
    '            "y": 5.5,\n' +
    '            "width": 25,\n' +
    '            "height": 19,\n' +
    '            "alpha": 1,\n' +
    '            "angle": 270,\n' +
    '            "userData": {},\n' +
    '            "cssClass": "draw2d_shape_basic_Label",\n' +
    '            "ports": [],\n' +
    '            "bgColor": "none",\n' +
    '            "color": "#1B1B1B",\n' +
    '            "stroke": 0,\n' +
    '            "radius": 0,\n' +
    '            "dasharray": null,\n' +
    '            "text": "CC",\n' +
    '            "outlineStroke": 0,\n' +
    '            "outlineColor": "none",\n' +
    '            "fontSize": 18,\n' +
    '            "fontColor": "#FFFFFF",\n' +
    '            "fontFamily": null,\n' +
    '            "editor": "draw2d.ui.LabelInplaceEditor",\n' +
    '            "locator": "draw2d.layout.locator.CenterLocator"\n' +
    '          }\n' +
    '        ]\n' +
    '      },\n' +
    '      {\n' +
    '        "type": "sankey.shape.State",\n' +
    '        "id": "7f8a030d-d158-446e-74da-b5e0a8624a2a",\n' +
    '        "alpha": 1,\n' +
    '        "angle": 0,\n' +
    '        "userData": {},\n' +
    '        "cssClass": "sankey_shape_State",\n' +
    '        "stroke": 1,\n' +
    '        "color": "#000000",\n' +
    '        "dasharray": null,\n' +
    '        "radius": 0,\n' +
    '        "labels": [\n' +
    '          {\n' +
    '            "type": "draw2d.shape.basic.Label",\n' +
    '            "id": "b9dec1a0-ac43-41f2-890a-db27d79d4db8",\n' +
    '            "x": 8.5,\n' +
    '            "y": 11.5,\n' +
    '            "width": 25,\n' +
    '            "height": 19,\n' +
    '            "alpha": 1,\n' +
    '            "angle": 270,\n' +
    '            "userData": {},\n' +
    '            "cssClass": "draw2d_shape_basic_Label",\n' +
    '            "ports": [],\n' +
    '            "bgColor": "none",\n' +
    '            "color": "#1B1B1B",\n' +
    '            "stroke": 0,\n' +
    '            "radius": 0,\n' +
    '            "dasharray": null,\n' +
    '            "text": "DD",\n' +
    '            "outlineStroke": 0,\n' +
    '            "outlineColor": "none",\n' +
    '            "fontSize": 18,\n' +
    '            "fontColor": "#FFFFFF",\n' +
    '            "fontFamily": null,\n' +
    '            "editor": "draw2d.ui.LabelInplaceEditor",\n' +
    '            "locator": "draw2d.layout.locator.CenterLocator"\n' +
    '          }\n' +
    '        ],\n' +
    '        "x": 1325,\n' +
    '        "y": 441,\n' +
    '        "width": 50,\n' +
    '        "height": 50,\n' +
    '        "bgColor": "#FFB224"\n' +
    '      }\n' +
    '    ]';

let tree2_connections = '[\n' +
    '      {\n' +
    '        "type": "sankey.shape.Connection",\n' +
    '        "id": "524e8888-8b32-94ac-74ce-e3bc6c524973",\n' +
    '        "alpha": 1,\n' +
    '        "angle": 0,\n' +
    '        "userData": {\n' +
    '          "jsonPath": ""\n' +
    '        },\n' +
    '        "cssClass": "sankey_shape_Connection",\n' +
    '        "stroke": 5,\n' +
    '        "color": "#129CE4",\n' +
    '        "outlineStroke": 0,\n' +
    '        "outlineColor": "none",\n' +
    '        "dasharray": "-",\n' +
    '        "policy": "draw2d.policy.line.OrthogonalSelectionFeedbackPolicy",\n' +
    '        "vertex": [\n' +
    '          {\n' +
    '            "x": 1099,\n' +
    '            "y": 363.5\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1213.5,\n' +
    '            "y": 363.5\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1213.5,\n' +
    '            "y": 376\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1328,\n' +
    '            "y": 376\n' +
    '          }\n' +
    '        ],\n' +
    '        "router": "draw2d.layout.connection.InteractiveManhattanConnectionRouter",\n' +
    '        "radius": 3,\n' +
    '        "routingMetaData": {\n' +
    '          "routedByUserInteraction": false,\n' +
    '          "fromDir": 1,\n' +
    '          "toDir": 3\n' +
    '        },\n' +
    '        "source": {\n' +
    '          "node": "ccf67efd-d809-4d6d-e35e-6e54c4ea0b4e",\n' +
    '          "port": "output0"\n' +
    '        },\n' +
    '        "target": {\n' +
    '          "node": "601e6f35-92a3-42e3-8e4f-aff052eb2d92",\n' +
    '          "port": "input0",\n' +
    '          "decoration": "draw2d.decoration.connection.ArrowDecorator"\n' +
    '        },\n' +
    '        "labels": []\n' +
    '      },\n' +
    '      {\n' +
    '        "type": "sankey.shape.Connection",\n' +
    '        "id": "493ad9e4-266c-5358-0f43-d694e7391ed3",\n' +
    '        "alpha": 1,\n' +
    '        "angle": 0,\n' +
    '        "userData": {\n' +
    '          "jsonPath": ""\n' +
    '        },\n' +
    '        "cssClass": "sankey_shape_Connection",\n' +
    '        "stroke": 5,\n' +
    '        "color": "#129CE4",\n' +
    '        "outlineStroke": 0,\n' +
    '        "outlineColor": "none",\n' +
    '        "dasharray": "-",\n' +
    '        "policy": "draw2d.policy.line.OrthogonalSelectionFeedbackPolicy",\n' +
    '        "vertex": [\n' +
    '          {\n' +
    '            "x": 1099,\n' +
    '            "y": 388.5\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1212,\n' +
    '            "y": 388.5\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1212,\n' +
    '            "y": 466\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1325,\n' +
    '            "y": 466\n' +
    '          }\n' +
    '        ],\n' +
    '        "router": "draw2d.layout.connection.InteractiveManhattanConnectionRouter",\n' +
    '        "radius": 3,\n' +
    '        "routingMetaData": {\n' +
    '          "routedByUserInteraction": false,\n' +
    '          "fromDir": 1,\n' +
    '          "toDir": 3\n' +
    '        },\n' +
    '        "source": {\n' +
    '          "node": "ccf67efd-d809-4d6d-e35e-6e54c4ea0b4e",\n' +
    '          "port": "output0"\n' +
    '        },\n' +
    '        "target": {\n' +
    '          "node": "7f8a030d-d158-446e-74da-b5e0a8624a2a",\n' +
    '          "port": "input0",\n' +
    '          "decoration": "draw2d.decoration.connection.ArrowDecorator"\n' +
    '        },\n' +
    '        "labels": []\n' +
    '      },\n' +
    '      {\n' +
    '        "type": "sankey.shape.Connection",\n' +
    '        "id": "82f7766a-873d-d0fc-6a09-9d81fc428117",\n' +
    '        "alpha": 1,\n' +
    '        "angle": 0,\n' +
    '        "userData": {\n' +
    '          "jsonPath": ""\n' +
    '        },\n' +
    '        "cssClass": "sankey_shape_Connection",\n' +
    '        "stroke": 5,\n' +
    '        "color": "#129CE4",\n' +
    '        "outlineStroke": 0,\n' +
    '        "outlineColor": "none",\n' +
    '        "dasharray": "-",\n' +
    '        "policy": "draw2d.policy.line.OrthogonalSelectionFeedbackPolicy",\n' +
    '        "vertex": [\n' +
    '          {\n' +
    '            "x": 1375,\n' +
    '            "y": 466\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1463.5,\n' +
    '            "y": 466\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1463.5,\n' +
    '            "y": 387.5\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1552,\n' +
    '            "y": 387.5\n' +
    '          }\n' +
    '        ],\n' +
    '        "router": "draw2d.layout.connection.InteractiveManhattanConnectionRouter",\n' +
    '        "radius": 3,\n' +
    '        "routingMetaData": {\n' +
    '          "routedByUserInteraction": false,\n' +
    '          "fromDir": 1,\n' +
    '          "toDir": 3\n' +
    '        },\n' +
    '        "source": {\n' +
    '          "node": "7f8a030d-d158-446e-74da-b5e0a8624a2a",\n' +
    '          "port": "output0"\n' +
    '        },\n' +
    '        "target": {\n' +
    '          "node": "4e08b28a-1498-4c02-a5df-9975b99a6124",\n' +
    '          "port": "input0",\n' +
    '          "decoration": "draw2d.decoration.connection.ArrowDecorator"\n' +
    '        },\n' +
    '        "labels": []\n' +
    '      },\n' +
    '      {\n' +
    '        "type": "sankey.shape.Connection",\n' +
    '        "id": "21af4e93-ec69-fed1-1906-7354ad7eb883",\n' +
    '        "alpha": 1,\n' +
    '        "angle": 0,\n' +
    '        "userData": {\n' +
    '          "jsonPath": ""\n' +
    '        },\n' +
    '        "cssClass": "sankey_shape_Connection",\n' +
    '        "stroke": 5,\n' +
    '        "color": "#129CE4",\n' +
    '        "outlineStroke": 0,\n' +
    '        "outlineColor": "none",\n' +
    '        "dasharray": "-",\n' +
    '        "policy": "draw2d.policy.line.OrthogonalSelectionFeedbackPolicy",\n' +
    '        "vertex": [\n' +
    '          {\n' +
    '            "x": 1378,\n' +
    '            "y": 376\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1465,\n' +
    '            "y": 376\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1465,\n' +
    '            "y": 368.5\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1552,\n' +
    '            "y": 368.5\n' +
    '          }\n' +
    '        ],\n' +
    '        "router": "draw2d.layout.connection.InteractiveManhattanConnectionRouter",\n' +
    '        "radius": 3,\n' +
    '        "routingMetaData": {\n' +
    '          "routedByUserInteraction": false,\n' +
    '          "fromDir": 1,\n' +
    '          "toDir": 3\n' +
    '        },\n' +
    '        "source": {\n' +
    '          "node": "601e6f35-92a3-42e3-8e4f-aff052eb2d92",\n' +
    '          "port": "output0"\n' +
    '        },\n' +
    '        "target": {\n' +
    '          "node": "4e08b28a-1498-4c02-a5df-9975b99a6124",\n' +
    '          "port": "input0",\n' +
    '          "decoration": "draw2d.decoration.connection.ArrowDecorator"\n' +
    '        },\n' +
    '        "labels": []\n' +
    '      }\n' +
    '    ]';

let tree3 = '{\n' +
    '  "content": {\n' +
    '    "diagram": [\n' +
    '      {\n' +
    '        "type": "sankey.shape.State",\n' +
    '        "id": "311a7ff0-1ee6-ce84-5a45-ea79fe468401",\n' +
    '        "x": 1098,\n' +
    '        "y": 355,\n' +
    '        "width": 50,\n' +
    '        "height": 50,\n' +
    '        "alpha": 1,\n' +
    '        "angle": 0,\n' +
    '        "userData": {},\n' +
    '        "cssClass": "sankey_shape_State",\n' +
    '        "bgColor": "#FFB224",\n' +
    '        "color": "#000000",\n' +
    '        "stroke": 1,\n' +
    '        "radius": 0,\n' +
    '        "dasharray": null,\n' +
    '        "labels": [\n' +
    '          {\n' +
    '            "type": "draw2d.shape.basic.Label",\n' +
    '            "id": "8f60f635-f2d8-1608-f8e2-3e6a3203c4ab",\n' +
    '            "x": 8.5,\n' +
    '            "y": 11.5,\n' +
    '            "width": 25,\n' +
    '            "height": 19,\n' +
    '            "alpha": 1,\n' +
    '            "angle": 270,\n' +
    '            "userData": {},\n' +
    '            "cssClass": "draw2d_shape_basic_Label",\n' +
    '            "ports": [],\n' +
    '            "bgColor": "none",\n' +
    '            "color": "#1B1B1B",\n' +
    '            "stroke": 0,\n' +
    '            "radius": 0,\n' +
    '            "dasharray": null,\n' +
    '            "text": "RR",\n' +
    '            "outlineStroke": 0,\n' +
    '            "outlineColor": "none",\n' +
    '            "fontSize": 18,\n' +
    '            "fontColor": "#FFFFFF",\n' +
    '            "fontFamily": null,\n' +
    '            "editor": "draw2d.ui.LabelInplaceEditor",\n' +
    '            "locator": "draw2d.layout.locator.CenterLocator"\n' +
    '          }\n' +
    '        ]\n' +
    '      },\n' +
    '      {\n' +
    '        "type": "sankey.shape.State",\n' +
    '        "id": "bc75a6b4-8553-02e6-ba5b-af4b120b847a",\n' +
    '        "x": 1353,\n' +
    '        "y": 402,\n' +
    '        "width": 50,\n' +
    '        "height": 50,\n' +
    '        "alpha": 1,\n' +
    '        "angle": 0,\n' +
    '        "userData": {},\n' +
    '        "cssClass": "sankey_shape_State",\n' +
    '        "bgColor": "#FFB224",\n' +
    '        "color": "#000000",\n' +
    '        "stroke": 1,\n' +
    '        "radius": 0,\n' +
    '        "dasharray": null,\n' +
    '        "labels": [\n' +
    '          {\n' +
    '            "type": "draw2d.shape.basic.Label",\n' +
    '            "id": "7bbd936e-a57d-d53d-c344-d7efcad07daa",\n' +
    '            "x": 8.5,\n' +
    '            "y": 11.5,\n' +
    '            "width": 25,\n' +
    '            "height": 19,\n' +
    '            "alpha": 1,\n' +
    '            "angle": 270,\n' +
    '            "userData": {},\n' +
    '            "cssClass": "draw2d_shape_basic_Label",\n' +
    '            "ports": [],\n' +
    '            "bgColor": "none",\n' +
    '            "color": "#1B1B1B",\n' +
    '            "stroke": 0,\n' +
    '            "radius": 0,\n' +
    '            "dasharray": null,\n' +
    '            "text": "CC",\n' +
    '            "outlineStroke": 0,\n' +
    '            "outlineColor": "none",\n' +
    '            "fontSize": 18,\n' +
    '            "fontColor": "#FFFFFF",\n' +
    '            "fontFamily": null,\n' +
    '            "editor": "draw2d.ui.LabelInplaceEditor",\n' +
    '            "locator": "draw2d.layout.locator.CenterLocator"\n' +
    '          }\n' +
    '        ]\n' +
    '      },\n' +
    '      {\n' +
    '        "type": "sankey.shape.State",\n' +
    '        "id": "e014086e-f272-7700-7244-99ab30437dff",\n' +
    '        "x": 1252,\n' +
    '        "y": 273,\n' +
    '        "width": 50,\n' +
    '        "height": 50,\n' +
    '        "alpha": 1,\n' +
    '        "angle": 0,\n' +
    '        "userData": {},\n' +
    '        "cssClass": "sankey_shape_State",\n' +
    '        "bgColor": "#FFB224",\n' +
    '        "color": "#000000",\n' +
    '        "stroke": 1,\n' +
    '        "radius": 0,\n' +
    '        "dasharray": null,\n' +
    '        "labels": [\n' +
    '          {\n' +
    '            "type": "draw2d.shape.basic.Label",\n' +
    '            "id": "810f81c2-4386-d795-74ff-68326446f7c3",\n' +
    '            "x": 8.5,\n' +
    '            "y": 11.5,\n' +
    '            "width": 25,\n' +
    '            "height": 19,\n' +
    '            "alpha": 1,\n' +
    '            "angle": 270,\n' +
    '            "userData": {},\n' +
    '            "cssClass": "draw2d_shape_basic_Label",\n' +
    '            "ports": [],\n' +
    '            "bgColor": "none",\n' +
    '            "color": "#1B1B1B",\n' +
    '            "stroke": 0,\n' +
    '            "radius": 0,\n' +
    '            "dasharray": null,\n' +
    '            "text": "DD",\n' +
    '            "outlineStroke": 0,\n' +
    '            "outlineColor": "none",\n' +
    '            "fontSize": 18,\n' +
    '            "fontColor": "#FFFFFF",\n' +
    '            "fontFamily": null,\n' +
    '            "editor": "draw2d.ui.LabelInplaceEditor",\n' +
    '            "locator": "draw2d.layout.locator.CenterLocator"\n' +
    '          }\n' +
    '        ]\n' +
    '      }\n' +
    '    ]\n' +
    '  }\n' +
    '}';

let tree3_roles = '[\n' +
    '      {\n' +
    '        "type": "sankey.shape.State",\n' +
    '        "id": "311a7ff0-1ee6-ce84-5a45-ea79fe468401",\n' +
    '        "x": 1098,\n' +
    '        "y": 355,\n' +
    '        "width": 50,\n' +
    '        "height": 50,\n' +
    '        "alpha": 1,\n' +
    '        "angle": 0,\n' +
    '        "userData": {},\n' +
    '        "cssClass": "sankey_shape_State",\n' +
    '        "bgColor": "#FFB224",\n' +
    '        "color": "#000000",\n' +
    '        "stroke": 1,\n' +
    '        "radius": 0,\n' +
    '        "dasharray": null,\n' +
    '        "labels": [\n' +
    '          {\n' +
    '            "type": "draw2d.shape.basic.Label",\n' +
    '            "id": "8f60f635-f2d8-1608-f8e2-3e6a3203c4ab",\n' +
    '            "x": 8.5,\n' +
    '            "y": 11.5,\n' +
    '            "width": 25,\n' +
    '            "height": 19,\n' +
    '            "alpha": 1,\n' +
    '            "angle": 270,\n' +
    '            "userData": {},\n' +
    '            "cssClass": "draw2d_shape_basic_Label",\n' +
    '            "ports": [],\n' +
    '            "bgColor": "none",\n' +
    '            "color": "#1B1B1B",\n' +
    '            "stroke": 0,\n' +
    '            "radius": 0,\n' +
    '            "dasharray": null,\n' +
    '            "text": "RR",\n' +
    '            "outlineStroke": 0,\n' +
    '            "outlineColor": "none",\n' +
    '            "fontSize": 18,\n' +
    '            "fontColor": "#FFFFFF",\n' +
    '            "fontFamily": null,\n' +
    '            "editor": "draw2d.ui.LabelInplaceEditor",\n' +
    '            "locator": "draw2d.layout.locator.CenterLocator"\n' +
    '          }\n' +
    '        ]\n' +
    '      },\n' +
    '      {\n' +
    '        "type": "sankey.shape.State",\n' +
    '        "id": "bc75a6b4-8553-02e6-ba5b-af4b120b847a",\n' +
    '        "x": 1353,\n' +
    '        "y": 402,\n' +
    '        "width": 50,\n' +
    '        "height": 50,\n' +
    '        "alpha": 1,\n' +
    '        "angle": 0,\n' +
    '        "userData": {},\n' +
    '        "cssClass": "sankey_shape_State",\n' +
    '        "bgColor": "#FFB224",\n' +
    '        "color": "#000000",\n' +
    '        "stroke": 1,\n' +
    '        "radius": 0,\n' +
    '        "dasharray": null,\n' +
    '        "labels": [\n' +
    '          {\n' +
    '            "type": "draw2d.shape.basic.Label",\n' +
    '            "id": "7bbd936e-a57d-d53d-c344-d7efcad07daa",\n' +
    '            "x": 8.5,\n' +
    '            "y": 11.5,\n' +
    '            "width": 25,\n' +
    '            "height": 19,\n' +
    '            "alpha": 1,\n' +
    '            "angle": 270,\n' +
    '            "userData": {},\n' +
    '            "cssClass": "draw2d_shape_basic_Label",\n' +
    '            "ports": [],\n' +
    '            "bgColor": "none",\n' +
    '            "color": "#1B1B1B",\n' +
    '            "stroke": 0,\n' +
    '            "radius": 0,\n' +
    '            "dasharray": null,\n' +
    '            "text": "CC",\n' +
    '            "outlineStroke": 0,\n' +
    '            "outlineColor": "none",\n' +
    '            "fontSize": 18,\n' +
    '            "fontColor": "#FFFFFF",\n' +
    '            "fontFamily": null,\n' +
    '            "editor": "draw2d.ui.LabelInplaceEditor",\n' +
    '            "locator": "draw2d.layout.locator.CenterLocator"\n' +
    '          }\n' +
    '        ]\n' +
    '      },\n' +
    '      {\n' +
    '        "type": "sankey.shape.State",\n' +
    '        "id": "e014086e-f272-7700-7244-99ab30437dff",\n' +
    '        "x": 1252,\n' +
    '        "y": 273,\n' +
    '        "width": 50,\n' +
    '        "height": 50,\n' +
    '        "alpha": 1,\n' +
    '        "angle": 0,\n' +
    '        "userData": {},\n' +
    '        "cssClass": "sankey_shape_State",\n' +
    '        "bgColor": "#FFB224",\n' +
    '        "color": "#000000",\n' +
    '        "stroke": 1,\n' +
    '        "radius": 0,\n' +
    '        "dasharray": null,\n' +
    '        "labels": [\n' +
    '          {\n' +
    '            "type": "draw2d.shape.basic.Label",\n' +
    '            "id": "810f81c2-4386-d795-74ff-68326446f7c3",\n' +
    '            "x": 8.5,\n' +
    '            "y": 11.5,\n' +
    '            "width": 25,\n' +
    '            "height": 19,\n' +
    '            "alpha": 1,\n' +
    '            "angle": 270,\n' +
    '            "userData": {},\n' +
    '            "cssClass": "draw2d_shape_basic_Label",\n' +
    '            "ports": [],\n' +
    '            "bgColor": "none",\n' +
    '            "color": "#1B1B1B",\n' +
    '            "stroke": 0,\n' +
    '            "radius": 0,\n' +
    '            "dasharray": null,\n' +
    '            "text": "DD",\n' +
    '            "outlineStroke": 0,\n' +
    '            "outlineColor": "none",\n' +
    '            "fontSize": 18,\n' +
    '            "fontColor": "#FFFFFF",\n' +
    '            "fontFamily": null,\n' +
    '            "editor": "draw2d.ui.LabelInplaceEditor",\n' +
    '            "locator": "draw2d.layout.locator.CenterLocator"\n' +
    '          }\n' +
    '        ]\n' +
    '      }\n' +
    '    ]';


let process_structure_sankey1 = '{\n' +
    '  "content": {\n' +
    '    "diagram": [\n' +
    '      {\n' +
    '        "type": "sankey.shape.State",\n' +
    '        "id": "9b33151d-bddf-c52f-7c3f-ab3852930080",\n' +
    '        "x": 1109,\n' +
    '        "y": 420,\n' +
    '        "width": 50,\n' +
    '        "height": 50,\n' +
    '        "alpha": 1,\n' +
    '        "angle": 0,\n' +
    '        "userData": {},\n' +
    '        "cssClass": "sankey_shape_State",\n' +
    '        "bgColor": "#5957FF",\n' +
    '        "color": "#000000",\n' +
    '        "stroke": 1,\n' +
    '        "radius": 0,\n' +
    '        "dasharray": null,\n' +
    '        "labels": [\n' +
    '          {\n' +
    '            "type": "draw2d.shape.basic.Label",\n' +
    '            "id": "929d7421-2255-1000-0691-0361f1366f8d",\n' +
    '            "x": 8.5,\n' +
    '            "y": 11.5,\n' +
    '            "width": 25,\n' +
    '            "height": 19,\n' +
    '            "alpha": 1,\n' +
    '            "angle": 270,\n' +
    '            "userData": {},\n' +
    '            "cssClass": "draw2d_shape_basic_Label",\n' +
    '            "ports": [],\n' +
    '            "bgColor": "none",\n' +
    '            "color": "#1B1B1B",\n' +
    '            "stroke": 0,\n' +
    '            "radius": 0,\n' +
    '            "dasharray": null,\n' +
    '            "text": "DD",\n' +
    '            "outlineStroke": 0,\n' +
    '            "outlineColor": "none",\n' +
    '            "fontSize": 18,\n' +
    '            "fontColor": "#FFFFFF",\n' +
    '            "fontFamily": null,\n' +
    '            "editor": "draw2d.ui.LabelInplaceEditor",\n' +
    '            "locator": "draw2d.layout.locator.CenterLocator"\n' +
    '          }\n' +
    '        ]\n' +
    '      },\n' +
    '      {\n' +
    '        "type": "sankey.shape.State",\n' +
    '        "id": "d4943c41-f3a0-1f4b-3b16-786a3144f2c8",\n' +
    '        "x": 1307,\n' +
    '        "y": 426,\n' +
    '        "width": 50,\n' +
    '        "height": 50,\n' +
    '        "alpha": 1,\n' +
    '        "angle": 0,\n' +
    '        "userData": {},\n' +
    '        "cssClass": "sankey_shape_State",\n' +
    '        "bgColor": "#FFB224",\n' +
    '        "color": "#000000",\n' +
    '        "stroke": 1,\n' +
    '        "radius": 0,\n' +
    '        "dasharray": null,\n' +
    '        "labels": [\n' +
    '          {\n' +
    '            "type": "draw2d.shape.basic.Label",\n' +
    '            "id": "4d6e3c8a-2ad2-8f60-96a7-2c630a4ad423",\n' +
    '            "x": 8.5,\n' +
    '            "y": 11.5,\n' +
    '            "width": 25,\n' +
    '            "height": 19,\n' +
    '            "alpha": 1,\n' +
    '            "angle": 270,\n' +
    '            "userData": {},\n' +
    '            "cssClass": "draw2d_shape_basic_Label",\n' +
    '            "ports": [],\n' +
    '            "bgColor": "none",\n' +
    '            "color": "#1B1B1B",\n' +
    '            "stroke": 0,\n' +
    '            "radius": 0,\n' +
    '            "dasharray": null,\n' +
    '            "text": "CC",\n' +
    '            "outlineStroke": 0,\n' +
    '            "outlineColor": "none",\n' +
    '            "fontSize": 18,\n' +
    '            "fontColor": "#FFFFFF",\n' +
    '            "fontFamily": null,\n' +
    '            "editor": "draw2d.ui.LabelInplaceEditor",\n' +
    '            "locator": "draw2d.layout.locator.CenterLocator"\n' +
    '          }\n' +
    '        ]\n' +
    '      },\n' +
    '      {\n' +
    '        "type": "sankey.shape.State",\n' +
    '        "id": "7a224d28-bcbd-c2da-bb06-20cb880eb3c7",\n' +
    '        "x": 1495,\n' +
    '        "y": 429,\n' +
    '        "width": 50,\n' +
    '        "height": 50,\n' +
    '        "alpha": 1,\n' +
    '        "angle": 0,\n' +
    '        "userData": {},\n' +
    '        "cssClass": "sankey_shape_State",\n' +
    '        "bgColor": "#FFB224",\n' +
    '        "color": "#000000",\n' +
    '        "stroke": 1,\n' +
    '        "radius": 0,\n' +
    '        "dasharray": null,\n' +
    '        "labels": [\n' +
    '          {\n' +
    '            "type": "draw2d.shape.basic.Label",\n' +
    '            "id": "4560ff43-81e0-c791-b393-ec482ef90ab6",\n' +
    '            "x": 8.5,\n' +
    '            "y": 11.5,\n' +
    '            "width": 25,\n' +
    '            "height": 19,\n' +
    '            "alpha": 1,\n' +
    '            "angle": 270,\n' +
    '            "userData": {},\n' +
    '            "cssClass": "draw2d_shape_basic_Label",\n' +
    '            "ports": [],\n' +
    '            "bgColor": "none",\n' +
    '            "color": "#1B1B1B",\n' +
    '            "stroke": 0,\n' +
    '            "radius": 0,\n' +
    '            "dasharray": null,\n' +
    '            "text": "RR",\n' +
    '            "outlineStroke": 0,\n' +
    '            "outlineColor": "none",\n' +
    '            "fontSize": 18,\n' +
    '            "fontColor": "#FFFFFF",\n' +
    '            "fontFamily": null,\n' +
    '            "editor": "draw2d.ui.LabelInplaceEditor",\n' +
    '            "locator": "draw2d.layout.locator.CenterLocator"\n' +
    '          }\n' +
    '        ]\n' +
    '      },\n' +
    '      {\n' +
    '        "type": "sankey.shape.Connection",\n' +
    '        "id": "0108700a-7dc3-a15b-b912-21769d8ab7ae",\n' +
    '        "alpha": 1,\n' +
    '        "angle": 0,\n' +
    '        "userData": {\n' +
    '          "jsonPath": ""\n' +
    '        },\n' +
    '        "cssClass": "sankey_shape_Connection",\n' +
    '        "stroke": 5,\n' +
    '        "color": "#129CE4",\n' +
    '        "outlineStroke": 0,\n' +
    '        "outlineColor": "none",\n' +
    '        "dasharray": "-",\n' +
    '        "policy": "draw2d.policy.line.OrthogonalSelectionFeedbackPolicy",\n' +
    '        "vertex": [\n' +
    '          {\n' +
    '            "x": 1159,\n' +
    '            "y": 445\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1233,\n' +
    '            "y": 445\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1233,\n' +
    '            "y": 451\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1307,\n' +
    '            "y": 451\n' +
    '          }\n' +
    '        ],\n' +
    '        "router": "draw2d.layout.connection.InteractiveManhattanConnectionRouter",\n' +
    '        "radius": 3,\n' +
    '        "routingMetaData": {\n' +
    '          "routedByUserInteraction": false,\n' +
    '          "fromDir": 1,\n' +
    '          "toDir": 3\n' +
    '        },\n' +
    '        "source": {\n' +
    '          "node": "9b33151d-bddf-c52f-7c3f-ab3852930080",\n' +
    '          "port": "output0"\n' +
    '        },\n' +
    '        "target": {\n' +
    '          "node": "d4943c41-f3a0-1f4b-3b16-786a3144f2c8",\n' +
    '          "port": "input0",\n' +
    '          "decoration": "draw2d.decoration.connection.ArrowDecorator"\n' +
    '        },\n' +
    '        "labels": []\n' +
    '      },\n' +
    '      {\n' +
    '        "type": "sankey.shape.Connection",\n' +
    '        "id": "b7ca839f-a1ae-4580-a936-6c43fcb4fd9e",\n' +
    '        "alpha": 1,\n' +
    '        "angle": 0,\n' +
    '        "userData": {\n' +
    '          "jsonPath": ""\n' +
    '        },\n' +
    '        "cssClass": "sankey_shape_Connection",\n' +
    '        "stroke": 5,\n' +
    '        "color": "#129CE4",\n' +
    '        "outlineStroke": 0,\n' +
    '        "outlineColor": "none",\n' +
    '        "dasharray": "-",\n' +
    '        "policy": "draw2d.policy.line.OrthogonalSelectionFeedbackPolicy",\n' +
    '        "vertex": [\n' +
    '          {\n' +
    '            "x": 1357,\n' +
    '            "y": 451\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1426,\n' +
    '            "y": 451\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1426,\n' +
    '            "y": 454\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1495,\n' +
    '            "y": 454\n' +
    '          }\n' +
    '        ],\n' +
    '        "router": "draw2d.layout.connection.InteractiveManhattanConnectionRouter",\n' +
    '        "radius": 3,\n' +
    '        "routingMetaData": {\n' +
    '          "routedByUserInteraction": false,\n' +
    '          "fromDir": 1,\n' +
    '          "toDir": 3\n' +
    '        },\n' +
    '        "source": {\n' +
    '          "node": "d4943c41-f3a0-1f4b-3b16-786a3144f2c8",\n' +
    '          "port": "output0"\n' +
    '        },\n' +
    '        "target": {\n' +
    '          "node": "7a224d28-bcbd-c2da-bb06-20cb880eb3c7",\n' +
    '          "port": "input0",\n' +
    '          "decoration": "draw2d.decoration.connection.ArrowDecorator"\n' +
    '        },\n' +
    '        "labels": []\n' +
    '      }\n' +
    '    ]\n' +
    '  }\n' +
    '}';


let process_structure_sankey1_sankey_stages = '[\n' +
    '      {\n' +
    '        "type": "sankey.shape.State",\n' +
    '        "id": "9b33151d-bddf-c52f-7c3f-ab3852930080",\n' +
    '        "x": 1109,\n' +
    '        "y": 420,\n' +
    '        "width": 50,\n' +
    '        "height": 50,\n' +
    '        "alpha": 1,\n' +
    '        "angle": 0,\n' +
    '        "userData": {},\n' +
    '        "cssClass": "sankey_shape_State",\n' +
    '        "bgColor": "#5957FF",\n' +
    '        "color": "#000000",\n' +
    '        "stroke": 1,\n' +
    '        "radius": 0,\n' +
    '        "dasharray": null,\n' +
    '        "labels": [\n' +
    '          {\n' +
    '            "type": "draw2d.shape.basic.Label",\n' +
    '            "id": "929d7421-2255-1000-0691-0361f1366f8d",\n' +
    '            "x": 8.5,\n' +
    '            "y": 11.5,\n' +
    '            "width": 25,\n' +
    '            "height": 19,\n' +
    '            "alpha": 1,\n' +
    '            "angle": 270,\n' +
    '            "userData": {},\n' +
    '            "cssClass": "draw2d_shape_basic_Label",\n' +
    '            "ports": [],\n' +
    '            "bgColor": "none",\n' +
    '            "color": "#1B1B1B",\n' +
    '            "stroke": 0,\n' +
    '            "radius": 0,\n' +
    '            "dasharray": null,\n' +
    '            "text": "DD",\n' +
    '            "outlineStroke": 0,\n' +
    '            "outlineColor": "none",\n' +
    '            "fontSize": 18,\n' +
    '            "fontColor": "#FFFFFF",\n' +
    '            "fontFamily": null,\n' +
    '            "editor": "draw2d.ui.LabelInplaceEditor",\n' +
    '            "locator": "draw2d.layout.locator.CenterLocator"\n' +
    '          }\n' +
    '        ]\n' +
    '      },\n' +
    '      {\n' +
    '        "type": "sankey.shape.State",\n' +
    '        "id": "d4943c41-f3a0-1f4b-3b16-786a3144f2c8",\n' +
    '        "x": 1307,\n' +
    '        "y": 426,\n' +
    '        "width": 50,\n' +
    '        "height": 50,\n' +
    '        "alpha": 1,\n' +
    '        "angle": 0,\n' +
    '        "userData": {},\n' +
    '        "cssClass": "sankey_shape_State",\n' +
    '        "bgColor": "#FFB224",\n' +
    '        "color": "#000000",\n' +
    '        "stroke": 1,\n' +
    '        "radius": 0,\n' +
    '        "dasharray": null,\n' +
    '        "labels": [\n' +
    '          {\n' +
    '            "type": "draw2d.shape.basic.Label",\n' +
    '            "id": "4d6e3c8a-2ad2-8f60-96a7-2c630a4ad423",\n' +
    '            "x": 8.5,\n' +
    '            "y": 11.5,\n' +
    '            "width": 25,\n' +
    '            "height": 19,\n' +
    '            "alpha": 1,\n' +
    '            "angle": 270,\n' +
    '            "userData": {},\n' +
    '            "cssClass": "draw2d_shape_basic_Label",\n' +
    '            "ports": [],\n' +
    '            "bgColor": "none",\n' +
    '            "color": "#1B1B1B",\n' +
    '            "stroke": 0,\n' +
    '            "radius": 0,\n' +
    '            "dasharray": null,\n' +
    '            "text": "CC",\n' +
    '            "outlineStroke": 0,\n' +
    '            "outlineColor": "none",\n' +
    '            "fontSize": 18,\n' +
    '            "fontColor": "#FFFFFF",\n' +
    '            "fontFamily": null,\n' +
    '            "editor": "draw2d.ui.LabelInplaceEditor",\n' +
    '            "locator": "draw2d.layout.locator.CenterLocator"\n' +
    '          }\n' +
    '        ]\n' +
    '      },\n' +
    '      {\n' +
    '        "type": "sankey.shape.State",\n' +
    '        "id": "7a224d28-bcbd-c2da-bb06-20cb880eb3c7",\n' +
    '        "x": 1495,\n' +
    '        "y": 429,\n' +
    '        "width": 50,\n' +
    '        "height": 50,\n' +
    '        "alpha": 1,\n' +
    '        "angle": 0,\n' +
    '        "userData": {},\n' +
    '        "cssClass": "sankey_shape_State",\n' +
    '        "bgColor": "#FFB224",\n' +
    '        "color": "#000000",\n' +
    '        "stroke": 1,\n' +
    '        "radius": 0,\n' +
    '        "dasharray": null,\n' +
    '        "labels": [\n' +
    '          {\n' +
    '            "type": "draw2d.shape.basic.Label",\n' +
    '            "id": "4560ff43-81e0-c791-b393-ec482ef90ab6",\n' +
    '            "x": 8.5,\n' +
    '            "y": 11.5,\n' +
    '            "width": 25,\n' +
    '            "height": 19,\n' +
    '            "alpha": 1,\n' +
    '            "angle": 270,\n' +
    '            "userData": {},\n' +
    '            "cssClass": "draw2d_shape_basic_Label",\n' +
    '            "ports": [],\n' +
    '            "bgColor": "none",\n' +
    '            "color": "#1B1B1B",\n' +
    '            "stroke": 0,\n' +
    '            "radius": 0,\n' +
    '            "dasharray": null,\n' +
    '            "text": "RR",\n' +
    '            "outlineStroke": 0,\n' +
    '            "outlineColor": "none",\n' +
    '            "fontSize": 18,\n' +
    '            "fontColor": "#FFFFFF",\n' +
    '            "fontFamily": null,\n' +
    '            "editor": "draw2d.ui.LabelInplaceEditor",\n' +
    '            "locator": "draw2d.layout.locator.CenterLocator"\n' +
    '          }\n' +
    '        ]\n' +
    '      }\n' +
    '    ]';

let process_structure_sankey1_connections = '[\n' +
    '      {\n' +
    '        "type": "sankey.shape.Connection",\n' +
    '        "id": "0108700a-7dc3-a15b-b912-21769d8ab7ae",\n' +
    '        "alpha": 1,\n' +
    '        "angle": 0,\n' +
    '        "userData": {\n' +
    '          "jsonPath": ""\n' +
    '        },\n' +
    '        "cssClass": "sankey_shape_Connection",\n' +
    '        "stroke": 5,\n' +
    '        "color": "#129CE4",\n' +
    '        "outlineStroke": 0,\n' +
    '        "outlineColor": "none",\n' +
    '        "dasharray": "-",\n' +
    '        "policy": "draw2d.policy.line.OrthogonalSelectionFeedbackPolicy",\n' +
    '        "vertex": [\n' +
    '          {\n' +
    '            "x": 1159,\n' +
    '            "y": 445\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1233,\n' +
    '            "y": 445\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1233,\n' +
    '            "y": 451\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1307,\n' +
    '            "y": 451\n' +
    '          }\n' +
    '        ],\n' +
    '        "router": "draw2d.layout.connection.InteractiveManhattanConnectionRouter",\n' +
    '        "radius": 3,\n' +
    '        "routingMetaData": {\n' +
    '          "routedByUserInteraction": false,\n' +
    '          "fromDir": 1,\n' +
    '          "toDir": 3\n' +
    '        },\n' +
    '        "source": {\n' +
    '          "node": "9b33151d-bddf-c52f-7c3f-ab3852930080",\n' +
    '          "port": "output0"\n' +
    '        },\n' +
    '        "target": {\n' +
    '          "node": "d4943c41-f3a0-1f4b-3b16-786a3144f2c8",\n' +
    '          "port": "input0",\n' +
    '          "decoration": "draw2d.decoration.connection.ArrowDecorator"\n' +
    '        },\n' +
    '        "labels": []\n' +
    '      },\n' +
    '      {\n' +
    '        "type": "sankey.shape.Connection",\n' +
    '        "id": "b7ca839f-a1ae-4580-a936-6c43fcb4fd9e",\n' +
    '        "alpha": 1,\n' +
    '        "angle": 0,\n' +
    '        "userData": {\n' +
    '          "jsonPath": ""\n' +
    '        },\n' +
    '        "cssClass": "sankey_shape_Connection",\n' +
    '        "stroke": 5,\n' +
    '        "color": "#129CE4",\n' +
    '        "outlineStroke": 0,\n' +
    '        "outlineColor": "none",\n' +
    '        "dasharray": "-",\n' +
    '        "policy": "draw2d.policy.line.OrthogonalSelectionFeedbackPolicy",\n' +
    '        "vertex": [\n' +
    '          {\n' +
    '            "x": 1357,\n' +
    '            "y": 451\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1426,\n' +
    '            "y": 451\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1426,\n' +
    '            "y": 454\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1495,\n' +
    '            "y": 454\n' +
    '          }\n' +
    '        ],\n' +
    '        "router": "draw2d.layout.connection.InteractiveManhattanConnectionRouter",\n' +
    '        "radius": 3,\n' +
    '        "routingMetaData": {\n' +
    '          "routedByUserInteraction": false,\n' +
    '          "fromDir": 1,\n' +
    '          "toDir": 3\n' +
    '        },\n' +
    '        "source": {\n' +
    '          "node": "d4943c41-f3a0-1f4b-3b16-786a3144f2c8",\n' +
    '          "port": "output0"\n' +
    '        },\n' +
    '        "target": {\n' +
    '          "node": "7a224d28-bcbd-c2da-bb06-20cb880eb3c7",\n' +
    '          "port": "input0",\n' +
    '          "decoration": "draw2d.decoration.connection.ArrowDecorator"\n' +
    '        },\n' +
    '        "labels": []\n' +
    '      }\n' +
    '    ]';

let process_structure_sankey2 = '{\n' +
    '  "content": {\n' +
    '    "diagram": [\n' +
    '      {\n' +
    '        "type": "sankey.shape.State",\n' +
    '        "id": "477a0f8b-e78b-b691-fde4-1bf6ac89d3f9",\n' +
    '        "x": 1012,\n' +
    '        "y": 400,\n' +
    '        "width": 50,\n' +
    '        "height": 50,\n' +
    '        "alpha": 1,\n' +
    '        "angle": 0,\n' +
    '        "userData": {},\n' +
    '        "cssClass": "sankey_shape_State",\n' +
    '        "bgColor": "#5957FF",\n' +
    '        "color": "#000000",\n' +
    '        "stroke": 1,\n' +
    '        "radius": 0,\n' +
    '        "dasharray": null,\n' +
    '        "labels": [\n' +
    '          {\n' +
    '            "type": "draw2d.shape.basic.Label",\n' +
    '            "id": "b6e2c6e3-85fa-a987-95ab-000b1527c79b",\n' +
    '            "x": 8.5,\n' +
    '            "y": 11.5,\n' +
    '            "width": 25,\n' +
    '            "height": 19,\n' +
    '            "alpha": 1,\n' +
    '            "angle": 270,\n' +
    '            "userData": {},\n' +
    '            "cssClass": "draw2d_shape_basic_Label",\n' +
    '            "ports": [],\n' +
    '            "bgColor": "none",\n' +
    '            "color": "#1B1B1B",\n' +
    '            "stroke": 0,\n' +
    '            "radius": 0,\n' +
    '            "dasharray": null,\n' +
    '            "text": "RR",\n' +
    '            "outlineStroke": 0,\n' +
    '            "outlineColor": "none",\n' +
    '            "fontSize": 18,\n' +
    '            "fontColor": "#FFFFFF",\n' +
    '            "fontFamily": null,\n' +
    '            "editor": "draw2d.ui.LabelInplaceEditor",\n' +
    '            "locator": "draw2d.layout.locator.CenterLocator"\n' +
    '          }\n' +
    '        ]\n' +
    '      },\n' +
    '      {\n' +
    '        "type": "sankey.shape.State",\n' +
    '        "id": "c178c350-a0a8-ab7f-2c25-b174b0b021ae",\n' +
    '        "x": 1193,\n' +
    '        "y": 399,\n' +
    '        "width": 50,\n' +
    '        "height": 50,\n' +
    '        "alpha": 1,\n' +
    '        "angle": 0,\n' +
    '        "userData": {},\n' +
    '        "cssClass": "sankey_shape_State",\n' +
    '        "bgColor": "#FFB224",\n' +
    '        "color": "#000000",\n' +
    '        "stroke": 1,\n' +
    '        "radius": 0,\n' +
    '        "dasharray": null,\n' +
    '        "labels": [\n' +
    '          {\n' +
    '            "type": "draw2d.shape.basic.Label",\n' +
    '            "id": "ed38efd4-5d3c-bf10-cad2-9477209c15dc",\n' +
    '            "x": 8.5,\n' +
    '            "y": 11.5,\n' +
    '            "width": 25,\n' +
    '            "height": 19,\n' +
    '            "alpha": 1,\n' +
    '            "angle": 270,\n' +
    '            "userData": {},\n' +
    '            "cssClass": "draw2d_shape_basic_Label",\n' +
    '            "ports": [],\n' +
    '            "bgColor": "none",\n' +
    '            "color": "#1B1B1B",\n' +
    '            "stroke": 0,\n' +
    '            "radius": 0,\n' +
    '            "dasharray": null,\n' +
    '            "text": "DD",\n' +
    '            "outlineStroke": 0,\n' +
    '            "outlineColor": "none",\n' +
    '            "fontSize": 18,\n' +
    '            "fontColor": "#FFFFFF",\n' +
    '            "fontFamily": null,\n' +
    '            "editor": "draw2d.ui.LabelInplaceEditor",\n' +
    '            "locator": "draw2d.layout.locator.CenterLocator"\n' +
    '          }\n' +
    '        ]\n' +
    '      },\n' +
    '      {\n' +
    '        "type": "sankey.shape.State",\n' +
    '        "id": "dd29d8cb-7264-24e3-707c-14aed6de4213",\n' +
    '        "x": 1386,\n' +
    '        "y": 400,\n' +
    '        "width": 50,\n' +
    '        "height": 50,\n' +
    '        "alpha": 1,\n' +
    '        "angle": 0,\n' +
    '        "userData": {},\n' +
    '        "cssClass": "sankey_shape_State",\n' +
    '        "bgColor": "#5957FF",\n' +
    '        "color": "#000000",\n' +
    '        "stroke": 1,\n' +
    '        "radius": 0,\n' +
    '        "dasharray": null,\n' +
    '        "labels": [\n' +
    '          {\n' +
    '            "type": "draw2d.shape.basic.Label",\n' +
    '            "id": "2eac22db-2ea7-9832-178f-e08f7f5bdcfd",\n' +
    '            "x": 8.5,\n' +
    '            "y": 11.5,\n' +
    '            "width": 25,\n' +
    '            "height": 19,\n' +
    '            "alpha": 1,\n' +
    '            "angle": 270,\n' +
    '            "userData": {},\n' +
    '            "cssClass": "draw2d_shape_basic_Label",\n' +
    '            "ports": [],\n' +
    '            "bgColor": "none",\n' +
    '            "color": "#1B1B1B",\n' +
    '            "stroke": 0,\n' +
    '            "radius": 0,\n' +
    '            "dasharray": null,\n' +
    '            "text": "CC",\n' +
    '            "outlineStroke": 0,\n' +
    '            "outlineColor": "none",\n' +
    '            "fontSize": 18,\n' +
    '            "fontColor": "#FFFFFF",\n' +
    '            "fontFamily": null,\n' +
    '            "editor": "draw2d.ui.LabelInplaceEditor",\n' +
    '            "locator": "draw2d.layout.locator.CenterLocator"\n' +
    '          }\n' +
    '        ]\n' +
    '      },\n' +
    '      {\n' +
    '        "type": "sankey.shape.State",\n' +
    '        "id": "f8966633-5a4f-23a9-6003-a315cec7c7ff",\n' +
    '        "x": 1614,\n' +
    '        "y": 323,\n' +
    '        "width": 50,\n' +
    '        "height": 50,\n' +
    '        "alpha": 1,\n' +
    '        "angle": 0,\n' +
    '        "userData": {},\n' +
    '        "cssClass": "sankey_shape_State",\n' +
    '        "bgColor": "#FFB224",\n' +
    '        "color": "#000000",\n' +
    '        "stroke": 1,\n' +
    '        "radius": 0,\n' +
    '        "dasharray": null,\n' +
    '        "labels": [\n' +
    '          {\n' +
    '            "type": "draw2d.shape.basic.Label",\n' +
    '            "id": "91f7ab2e-1912-fe72-3693-31f01a65e8fd",\n' +
    '            "x": 8.5,\n' +
    '            "y": 11.5,\n' +
    '            "width": 25,\n' +
    '            "height": 19,\n' +
    '            "alpha": 1,\n' +
    '            "angle": 270,\n' +
    '            "userData": {},\n' +
    '            "cssClass": "draw2d_shape_basic_Label",\n' +
    '            "ports": [],\n' +
    '            "bgColor": "none",\n' +
    '            "color": "#1B1B1B",\n' +
    '            "stroke": 0,\n' +
    '            "radius": 0,\n' +
    '            "dasharray": null,\n' +
    '            "text": "DD",\n' +
    '            "outlineStroke": 0,\n' +
    '            "outlineColor": "none",\n' +
    '            "fontSize": 18,\n' +
    '            "fontColor": "#FFFFFF",\n' +
    '            "fontFamily": null,\n' +
    '            "editor": "draw2d.ui.LabelInplaceEditor",\n' +
    '            "locator": "draw2d.layout.locator.CenterLocator"\n' +
    '          }\n' +
    '        ]\n' +
    '      },\n' +
    '      {\n' +
    '        "type": "sankey.shape.State",\n' +
    '        "id": "2af387cf-59ae-b0e4-853c-427b5f9de14b",\n' +
    '        "x": 1613,\n' +
    '        "y": 481,\n' +
    '        "width": 50,\n' +
    '        "height": 50,\n' +
    '        "alpha": 1,\n' +
    '        "angle": 0,\n' +
    '        "userData": {},\n' +
    '        "cssClass": "sankey_shape_State",\n' +
    '        "bgColor": "#FFB224",\n' +
    '        "color": "#000000",\n' +
    '        "stroke": 1,\n' +
    '        "radius": 0,\n' +
    '        "dasharray": null,\n' +
    '        "labels": [\n' +
    '          {\n' +
    '            "type": "draw2d.shape.basic.Label",\n' +
    '            "id": "e059838f-113f-b9ec-f1de-13cd0482fff9",\n' +
    '            "x": 8.5,\n' +
    '            "y": 11.5,\n' +
    '            "width": 25,\n' +
    '            "height": 19,\n' +
    '            "alpha": 1,\n' +
    '            "angle": 270,\n' +
    '            "userData": {},\n' +
    '            "cssClass": "draw2d_shape_basic_Label",\n' +
    '            "ports": [],\n' +
    '            "bgColor": "none",\n' +
    '            "color": "#1B1B1B",\n' +
    '            "stroke": 0,\n' +
    '            "radius": 0,\n' +
    '            "dasharray": null,\n' +
    '            "text": "RR",\n' +
    '            "outlineStroke": 0,\n' +
    '            "outlineColor": "none",\n' +
    '            "fontSize": 18,\n' +
    '            "fontColor": "#FFFFFF",\n' +
    '            "fontFamily": null,\n' +
    '            "editor": "draw2d.ui.LabelInplaceEditor",\n' +
    '            "locator": "draw2d.layout.locator.CenterLocator"\n' +
    '          }\n' +
    '        ]\n' +
    '      },\n' +
    '      {\n' +
    '        "type": "sankey.shape.State",\n' +
    '        "id": "5baccc2c-891b-549f-f9ad-680f738d9103",\n' +
    '        "x": 1834,\n' +
    '        "y": 399,\n' +
    '        "width": 50,\n' +
    '        "height": 50,\n' +
    '        "alpha": 1,\n' +
    '        "angle": 0,\n' +
    '        "userData": {},\n' +
    '        "cssClass": "sankey_shape_State",\n' +
    '        "bgColor": "#FFB224",\n' +
    '        "color": "#000000",\n' +
    '        "stroke": 1,\n' +
    '        "radius": 0,\n' +
    '        "dasharray": null,\n' +
    '        "labels": [\n' +
    '          {\n' +
    '            "type": "draw2d.shape.basic.Label",\n' +
    '            "id": "7ca49628-ca80-48b6-a951-fb61ec853b20",\n' +
    '            "x": 8.5,\n' +
    '            "y": 11.5,\n' +
    '            "width": 25,\n' +
    '            "height": 19,\n' +
    '            "alpha": 1,\n' +
    '            "angle": 270,\n' +
    '            "userData": {},\n' +
    '            "cssClass": "draw2d_shape_basic_Label",\n' +
    '            "ports": [],\n' +
    '            "bgColor": "none",\n' +
    '            "color": "#1B1B1B",\n' +
    '            "stroke": 0,\n' +
    '            "radius": 0,\n' +
    '            "dasharray": null,\n' +
    '            "text": "CC",\n' +
    '            "outlineStroke": 0,\n' +
    '            "outlineColor": "none",\n' +
    '            "fontSize": 18,\n' +
    '            "fontColor": "#FFFFFF",\n' +
    '            "fontFamily": null,\n' +
    '            "editor": "draw2d.ui.LabelInplaceEditor",\n' +
    '            "locator": "draw2d.layout.locator.CenterLocator"\n' +
    '          }\n' +
    '        ]\n' +
    '      },\n' +
    '      {\n' +
    '        "type": "sankey.shape.Connection",\n' +
    '        "id": "8d1eca53-089b-e2ac-0c5e-3df132b85e28",\n' +
    '        "alpha": 1,\n' +
    '        "angle": 0,\n' +
    '        "userData": {\n' +
    '          "jsonPath": ""\n' +
    '        },\n' +
    '        "cssClass": "sankey_shape_Connection",\n' +
    '        "stroke": 5,\n' +
    '        "color": "#129CE4",\n' +
    '        "outlineStroke": 0,\n' +
    '        "outlineColor": "none",\n' +
    '        "dasharray": "-",\n' +
    '        "policy": "draw2d.policy.line.OrthogonalSelectionFeedbackPolicy",\n' +
    '        "vertex": [\n' +
    '          {\n' +
    '            "x": 1062,\n' +
    '            "y": 425\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1127.5,\n' +
    '            "y": 425\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1127.5,\n' +
    '            "y": 424\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1193,\n' +
    '            "y": 424\n' +
    '          }\n' +
    '        ],\n' +
    '        "router": "draw2d.layout.connection.InteractiveManhattanConnectionRouter",\n' +
    '        "radius": 3,\n' +
    '        "routingMetaData": {\n' +
    '          "routedByUserInteraction": false,\n' +
    '          "fromDir": 1,\n' +
    '          "toDir": 3\n' +
    '        },\n' +
    '        "source": {\n' +
    '          "node": "477a0f8b-e78b-b691-fde4-1bf6ac89d3f9",\n' +
    '          "port": "output0"\n' +
    '        },\n' +
    '        "target": {\n' +
    '          "node": "c178c350-a0a8-ab7f-2c25-b174b0b021ae",\n' +
    '          "port": "input0",\n' +
    '          "decoration": "draw2d.decoration.connection.ArrowDecorator"\n' +
    '        },\n' +
    '        "labels": []\n' +
    '      },\n' +
    '      {\n' +
    '        "type": "sankey.shape.Connection",\n' +
    '        "id": "cc26a068-8901-93f3-14c6-9c171d91aa29",\n' +
    '        "alpha": 1,\n' +
    '        "angle": 0,\n' +
    '        "userData": {\n' +
    '          "jsonPath": ""\n' +
    '        },\n' +
    '        "cssClass": "sankey_shape_Connection",\n' +
    '        "stroke": 5,\n' +
    '        "color": "#129CE4",\n' +
    '        "outlineStroke": 0,\n' +
    '        "outlineColor": "none",\n' +
    '        "dasharray": "-",\n' +
    '        "policy": "draw2d.policy.line.OrthogonalSelectionFeedbackPolicy",\n' +
    '        "vertex": [\n' +
    '          {\n' +
    '            "x": 1243,\n' +
    '            "y": 424\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1314.5,\n' +
    '            "y": 424\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1314.5,\n' +
    '            "y": 425\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1386,\n' +
    '            "y": 425\n' +
    '          }\n' +
    '        ],\n' +
    '        "router": "draw2d.layout.connection.InteractiveManhattanConnectionRouter",\n' +
    '        "radius": 3,\n' +
    '        "routingMetaData": {\n' +
    '          "routedByUserInteraction": false,\n' +
    '          "fromDir": 1,\n' +
    '          "toDir": 3\n' +
    '        },\n' +
    '        "source": {\n' +
    '          "node": "c178c350-a0a8-ab7f-2c25-b174b0b021ae",\n' +
    '          "port": "output0"\n' +
    '        },\n' +
    '        "target": {\n' +
    '          "node": "dd29d8cb-7264-24e3-707c-14aed6de4213",\n' +
    '          "port": "input0",\n' +
    '          "decoration": "draw2d.decoration.connection.ArrowDecorator"\n' +
    '        },\n' +
    '        "labels": []\n' +
    '      },\n' +
    '      {\n' +
    '        "type": "sankey.shape.Connection",\n' +
    '        "id": "f462002f-59e6-ca97-4891-d3ddd3b3bf59",\n' +
    '        "alpha": 1,\n' +
    '        "angle": 0,\n' +
    '        "userData": {\n' +
    '          "jsonPath": ""\n' +
    '        },\n' +
    '        "cssClass": "sankey_shape_Connection",\n' +
    '        "stroke": 5,\n' +
    '        "color": "#129CE4",\n' +
    '        "outlineStroke": 0,\n' +
    '        "outlineColor": "none",\n' +
    '        "dasharray": "-",\n' +
    '        "policy": "draw2d.policy.line.OrthogonalSelectionFeedbackPolicy",\n' +
    '        "vertex": [\n' +
    '          {\n' +
    '            "x": 1436,\n' +
    '            "y": 437.5\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1524.5,\n' +
    '            "y": 437.5\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1524.5,\n' +
    '            "y": 506\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1613,\n' +
    '            "y": 506\n' +
    '          }\n' +
    '        ],\n' +
    '        "router": "draw2d.layout.connection.InteractiveManhattanConnectionRouter",\n' +
    '        "radius": 3,\n' +
    '        "routingMetaData": {\n' +
    '          "routedByUserInteraction": false,\n' +
    '          "fromDir": 1,\n' +
    '          "toDir": 3\n' +
    '        },\n' +
    '        "source": {\n' +
    '          "node": "dd29d8cb-7264-24e3-707c-14aed6de4213",\n' +
    '          "port": "output0"\n' +
    '        },\n' +
    '        "target": {\n' +
    '          "node": "2af387cf-59ae-b0e4-853c-427b5f9de14b",\n' +
    '          "port": "input0",\n' +
    '          "decoration": "draw2d.decoration.connection.ArrowDecorator"\n' +
    '        },\n' +
    '        "labels": []\n' +
    '      },\n' +
    '      {\n' +
    '        "type": "sankey.shape.Connection",\n' +
    '        "id": "ef2cd5e9-a1cb-0888-3783-28041e2d4916",\n' +
    '        "alpha": 1,\n' +
    '        "angle": 0,\n' +
    '        "userData": {\n' +
    '          "jsonPath": ""\n' +
    '        },\n' +
    '        "cssClass": "sankey_shape_Connection",\n' +
    '        "stroke": 5,\n' +
    '        "color": "#129CE4",\n' +
    '        "outlineStroke": 0,\n' +
    '        "outlineColor": "none",\n' +
    '        "dasharray": "-",\n' +
    '        "policy": "draw2d.policy.line.OrthogonalSelectionFeedbackPolicy",\n' +
    '        "vertex": [\n' +
    '          {\n' +
    '            "x": 1436,\n' +
    '            "y": 412.5\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1525,\n' +
    '            "y": 412.5\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1525,\n' +
    '            "y": 348\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1614,\n' +
    '            "y": 348\n' +
    '          }\n' +
    '        ],\n' +
    '        "router": "draw2d.layout.connection.InteractiveManhattanConnectionRouter",\n' +
    '        "radius": 3,\n' +
    '        "routingMetaData": {\n' +
    '          "routedByUserInteraction": false,\n' +
    '          "fromDir": 1,\n' +
    '          "toDir": 3\n' +
    '        },\n' +
    '        "source": {\n' +
    '          "node": "dd29d8cb-7264-24e3-707c-14aed6de4213",\n' +
    '          "port": "output0"\n' +
    '        },\n' +
    '        "target": {\n' +
    '          "node": "f8966633-5a4f-23a9-6003-a315cec7c7ff",\n' +
    '          "port": "input0",\n' +
    '          "decoration": "draw2d.decoration.connection.ArrowDecorator"\n' +
    '        },\n' +
    '        "labels": []\n' +
    '      },\n' +
    '      {\n' +
    '        "type": "sankey.shape.Connection",\n' +
    '        "id": "7a44ee8e-2599-83aa-41f2-45be8032663b",\n' +
    '        "alpha": 1,\n' +
    '        "angle": 0,\n' +
    '        "userData": {\n' +
    '          "jsonPath": ""\n' +
    '        },\n' +
    '        "cssClass": "sankey_shape_Connection",\n' +
    '        "stroke": 5,\n' +
    '        "color": "#129CE4",\n' +
    '        "outlineStroke": 0,\n' +
    '        "outlineColor": "none",\n' +
    '        "dasharray": "-",\n' +
    '        "policy": "draw2d.policy.line.OrthogonalSelectionFeedbackPolicy",\n' +
    '        "vertex": [\n' +
    '          {\n' +
    '            "x": 1663,\n' +
    '            "y": 506\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1748.5,\n' +
    '            "y": 506\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1748.5,\n' +
    '            "y": 436.5\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1834,\n' +
    '            "y": 436.5\n' +
    '          }\n' +
    '        ],\n' +
    '        "router": "draw2d.layout.connection.InteractiveManhattanConnectionRouter",\n' +
    '        "radius": 3,\n' +
    '        "routingMetaData": {\n' +
    '          "routedByUserInteraction": false,\n' +
    '          "fromDir": 1,\n' +
    '          "toDir": 3\n' +
    '        },\n' +
    '        "source": {\n' +
    '          "node": "2af387cf-59ae-b0e4-853c-427b5f9de14b",\n' +
    '          "port": "output0"\n' +
    '        },\n' +
    '        "target": {\n' +
    '          "node": "5baccc2c-891b-549f-f9ad-680f738d9103",\n' +
    '          "port": "input0",\n' +
    '          "decoration": "draw2d.decoration.connection.ArrowDecorator"\n' +
    '        },\n' +
    '        "labels": []\n' +
    '      },\n' +
    '      {\n' +
    '        "type": "sankey.shape.Connection",\n' +
    '        "id": "e5773c2e-869c-df5b-1785-718c12ae36ff",\n' +
    '        "alpha": 1,\n' +
    '        "angle": 0,\n' +
    '        "userData": {\n' +
    '          "jsonPath": ""\n' +
    '        },\n' +
    '        "cssClass": "sankey_shape_Connection",\n' +
    '        "stroke": 5,\n' +
    '        "color": "#129CE4",\n' +
    '        "outlineStroke": 0,\n' +
    '        "outlineColor": "none",\n' +
    '        "dasharray": "-",\n' +
    '        "policy": "draw2d.policy.line.OrthogonalSelectionFeedbackPolicy",\n' +
    '        "vertex": [\n' +
    '          {\n' +
    '            "x": 1664,\n' +
    '            "y": 348\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1749,\n' +
    '            "y": 348\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1749,\n' +
    '            "y": 411.5\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1834,\n' +
    '            "y": 411.5\n' +
    '          }\n' +
    '        ],\n' +
    '        "router": "draw2d.layout.connection.InteractiveManhattanConnectionRouter",\n' +
    '        "radius": 3,\n' +
    '        "routingMetaData": {\n' +
    '          "routedByUserInteraction": false,\n' +
    '          "fromDir": 1,\n' +
    '          "toDir": 3\n' +
    '        },\n' +
    '        "source": {\n' +
    '          "node": "f8966633-5a4f-23a9-6003-a315cec7c7ff",\n' +
    '          "port": "output0"\n' +
    '        },\n' +
    '        "target": {\n' +
    '          "node": "5baccc2c-891b-549f-f9ad-680f738d9103",\n' +
    '          "port": "input0",\n' +
    '          "decoration": "draw2d.decoration.connection.ArrowDecorator"\n' +
    '        },\n' +
    '        "labels": []\n' +
    '      }\n' +
    '    ]\n' +
    '  }\n' +
    '}';

let process_structure_sankey2_sankey_stages = '[\n' +
    '      {\n' +
    '        "type": "sankey.shape.State",\n' +
    '        "id": "477a0f8b-e78b-b691-fde4-1bf6ac89d3f9",\n' +
    '        "alpha": 1,\n' +
    '        "angle": 0,\n' +
    '        "userData": {},\n' +
    '        "cssClass": "sankey_shape_State",\n' +
    '        "stroke": 1,\n' +
    '        "color": "#000000",\n' +
    '        "dasharray": null,\n' +
    '        "radius": 0,\n' +
    '        "labels": [\n' +
    '          {\n' +
    '            "type": "draw2d.shape.basic.Label",\n' +
    '            "id": "b6e2c6e3-85fa-a987-95ab-000b1527c79b",\n' +
    '            "x": 8.5,\n' +
    '            "y": 11.5,\n' +
    '            "width": 25,\n' +
    '            "height": 19,\n' +
    '            "alpha": 1,\n' +
    '            "angle": 270,\n' +
    '            "userData": {},\n' +
    '            "cssClass": "draw2d_shape_basic_Label",\n' +
    '            "ports": [],\n' +
    '            "bgColor": "none",\n' +
    '            "color": "#1B1B1B",\n' +
    '            "stroke": 0,\n' +
    '            "radius": 0,\n' +
    '            "dasharray": null,\n' +
    '            "text": "RR",\n' +
    '            "outlineStroke": 0,\n' +
    '            "outlineColor": "none",\n' +
    '            "fontSize": 18,\n' +
    '            "fontColor": "#FFFFFF",\n' +
    '            "fontFamily": null,\n' +
    '            "editor": "draw2d.ui.LabelInplaceEditor",\n' +
    '            "locator": "draw2d.layout.locator.CenterLocator"\n' +
    '          }\n' +
    '        ],\n' +
    '        "x": 1012,\n' +
    '        "y": 400,\n' +
    '        "width": 50,\n' +
    '        "height": 50,\n' +
    '        "bgColor": "#5957FF"\n' +
    '      },\n' +
    '      {\n' +
    '        "type": "sankey.shape.State",\n' +
    '        "id": "c178c350-a0a8-ab7f-2c25-b174b0b021ae",\n' +
    '        "alpha": 1,\n' +
    '        "angle": 0,\n' +
    '        "userData": {},\n' +
    '        "cssClass": "sankey_shape_State",\n' +
    '        "stroke": 1,\n' +
    '        "color": "#000000",\n' +
    '        "dasharray": null,\n' +
    '        "radius": 0,\n' +
    '        "labels": [\n' +
    '          {\n' +
    '            "type": "draw2d.shape.basic.Label",\n' +
    '            "id": "ed38efd4-5d3c-bf10-cad2-9477209c15dc",\n' +
    '            "x": 8.5,\n' +
    '            "y": 11.5,\n' +
    '            "width": 25,\n' +
    '            "height": 19,\n' +
    '            "alpha": 1,\n' +
    '            "angle": 270,\n' +
    '            "userData": {},\n' +
    '            "cssClass": "draw2d_shape_basic_Label",\n' +
    '            "ports": [],\n' +
    '            "bgColor": "none",\n' +
    '            "color": "#1B1B1B",\n' +
    '            "stroke": 0,\n' +
    '            "radius": 0,\n' +
    '            "dasharray": null,\n' +
    '            "text": "DD",\n' +
    '            "outlineStroke": 0,\n' +
    '            "outlineColor": "none",\n' +
    '            "fontSize": 18,\n' +
    '            "fontColor": "#FFFFFF",\n' +
    '            "fontFamily": null,\n' +
    '            "editor": "draw2d.ui.LabelInplaceEditor",\n' +
    '            "locator": "draw2d.layout.locator.CenterLocator"\n' +
    '          }\n' +
    '        ],\n' +
    '        "x": 1193,\n' +
    '        "y": 399,\n' +
    '        "width": 50,\n' +
    '        "height": 50,\n' +
    '        "bgColor": "#FFB224"\n' +
    '      },\n' +
    '      {\n' +
    '        "type": "sankey.shape.State",\n' +
    '        "id": "dd29d8cb-7264-24e3-707c-14aed6de4213",\n' +
    '        "x": 1386,\n' +
    '        "y": 400,\n' +
    '        "width": 50,\n' +
    '        "height": 50,\n' +
    '        "alpha": 1,\n' +
    '        "angle": 0,\n' +
    '        "userData": {},\n' +
    '        "cssClass": "sankey_shape_State",\n' +
    '        "bgColor": "#5957FF",\n' +
    '        "color": "#000000",\n' +
    '        "stroke": 1,\n' +
    '        "radius": 0,\n' +
    '        "dasharray": null,\n' +
    '        "labels": [\n' +
    '          {\n' +
    '            "type": "draw2d.shape.basic.Label",\n' +
    '            "id": "2eac22db-2ea7-9832-178f-e08f7f5bdcfd",\n' +
    '            "x": 8.5,\n' +
    '            "y": 11.5,\n' +
    '            "width": 25,\n' +
    '            "height": 19,\n' +
    '            "alpha": 1,\n' +
    '            "angle": 270,\n' +
    '            "userData": {},\n' +
    '            "cssClass": "draw2d_shape_basic_Label",\n' +
    '            "ports": [],\n' +
    '            "bgColor": "none",\n' +
    '            "color": "#1B1B1B",\n' +
    '            "stroke": 0,\n' +
    '            "radius": 0,\n' +
    '            "dasharray": null,\n' +
    '            "text": "CC",\n' +
    '            "outlineStroke": 0,\n' +
    '            "outlineColor": "none",\n' +
    '            "fontSize": 18,\n' +
    '            "fontColor": "#FFFFFF",\n' +
    '            "fontFamily": null,\n' +
    '            "editor": "draw2d.ui.LabelInplaceEditor",\n' +
    '            "locator": "draw2d.layout.locator.CenterLocator"\n' +
    '          }\n' +
    '        ]\n' +
    '      },\n' +
    '      {\n' +
    '        "type": "sankey.shape.State",\n' +
    '        "id": "f8966633-5a4f-23a9-6003-a315cec7c7ff",\n' +
    '        "x": 1614,\n' +
    '        "y": 323,\n' +
    '        "width": 50,\n' +
    '        "height": 50,\n' +
    '        "alpha": 1,\n' +
    '        "angle": 0,\n' +
    '        "userData": {},\n' +
    '        "cssClass": "sankey_shape_State",\n' +
    '        "bgColor": "#FFB224",\n' +
    '        "color": "#000000",\n' +
    '        "stroke": 1,\n' +
    '        "radius": 0,\n' +
    '        "dasharray": null,\n' +
    '        "labels": [\n' +
    '          {\n' +
    '            "type": "draw2d.shape.basic.Label",\n' +
    '            "id": "91f7ab2e-1912-fe72-3693-31f01a65e8fd",\n' +
    '            "x": 8.5,\n' +
    '            "y": 11.5,\n' +
    '            "width": 25,\n' +
    '            "height": 19,\n' +
    '            "alpha": 1,\n' +
    '            "angle": 270,\n' +
    '            "userData": {},\n' +
    '            "cssClass": "draw2d_shape_basic_Label",\n' +
    '            "ports": [],\n' +
    '            "bgColor": "none",\n' +
    '            "color": "#1B1B1B",\n' +
    '            "stroke": 0,\n' +
    '            "radius": 0,\n' +
    '            "dasharray": null,\n' +
    '            "text": "DD",\n' +
    '            "outlineStroke": 0,\n' +
    '            "outlineColor": "none",\n' +
    '            "fontSize": 18,\n' +
    '            "fontColor": "#FFFFFF",\n' +
    '            "fontFamily": null,\n' +
    '            "editor": "draw2d.ui.LabelInplaceEditor",\n' +
    '            "locator": "draw2d.layout.locator.CenterLocator"\n' +
    '          }\n' +
    '        ]\n' +
    '      },\n' +
    '      {\n' +
    '        "type": "sankey.shape.State",\n' +
    '        "id": "2af387cf-59ae-b0e4-853c-427b5f9de14b",\n' +
    '        "x": 1613,\n' +
    '        "y": 481,\n' +
    '        "width": 50,\n' +
    '        "height": 50,\n' +
    '        "alpha": 1,\n' +
    '        "angle": 0,\n' +
    '        "userData": {},\n' +
    '        "cssClass": "sankey_shape_State",\n' +
    '        "bgColor": "#FFB224",\n' +
    '        "color": "#000000",\n' +
    '        "stroke": 1,\n' +
    '        "radius": 0,\n' +
    '        "dasharray": null,\n' +
    '        "labels": [\n' +
    '          {\n' +
    '            "type": "draw2d.shape.basic.Label",\n' +
    '            "id": "e059838f-113f-b9ec-f1de-13cd0482fff9",\n' +
    '            "x": 8.5,\n' +
    '            "y": 11.5,\n' +
    '            "width": 25,\n' +
    '            "height": 19,\n' +
    '            "alpha": 1,\n' +
    '            "angle": 270,\n' +
    '            "userData": {},\n' +
    '            "cssClass": "draw2d_shape_basic_Label",\n' +
    '            "ports": [],\n' +
    '            "bgColor": "none",\n' +
    '            "color": "#1B1B1B",\n' +
    '            "stroke": 0,\n' +
    '            "radius": 0,\n' +
    '            "dasharray": null,\n' +
    '            "text": "RR",\n' +
    '            "outlineStroke": 0,\n' +
    '            "outlineColor": "none",\n' +
    '            "fontSize": 18,\n' +
    '            "fontColor": "#FFFFFF",\n' +
    '            "fontFamily": null,\n' +
    '            "editor": "draw2d.ui.LabelInplaceEditor",\n' +
    '            "locator": "draw2d.layout.locator.CenterLocator"\n' +
    '          }\n' +
    '        ]\n' +
    '      },\n' +
    '      {\n' +
    '        "type": "sankey.shape.State",\n' +
    '        "id": "5baccc2c-891b-549f-f9ad-680f738d9103",\n' +
    '        "x": 1834,\n' +
    '        "y": 399,\n' +
    '        "width": 50,\n' +
    '        "height": 50,\n' +
    '        "alpha": 1,\n' +
    '        "angle": 0,\n' +
    '        "userData": {},\n' +
    '        "cssClass": "sankey_shape_State",\n' +
    '        "bgColor": "#FFB224",\n' +
    '        "color": "#000000",\n' +
    '        "stroke": 1,\n' +
    '        "radius": 0,\n' +
    '        "dasharray": null,\n' +
    '        "labels": [\n' +
    '          {\n' +
    '            "type": "draw2d.shape.basic.Label",\n' +
    '            "id": "7ca49628-ca80-48b6-a951-fb61ec853b20",\n' +
    '            "x": 8.5,\n' +
    '            "y": 11.5,\n' +
    '            "width": 25,\n' +
    '            "height": 19,\n' +
    '            "alpha": 1,\n' +
    '            "angle": 270,\n' +
    '            "userData": {},\n' +
    '            "cssClass": "draw2d_shape_basic_Label",\n' +
    '            "ports": [],\n' +
    '            "bgColor": "none",\n' +
    '            "color": "#1B1B1B",\n' +
    '            "stroke": 0,\n' +
    '            "radius": 0,\n' +
    '            "dasharray": null,\n' +
    '            "text": "CC",\n' +
    '            "outlineStroke": 0,\n' +
    '            "outlineColor": "none",\n' +
    '            "fontSize": 18,\n' +
    '            "fontColor": "#FFFFFF",\n' +
    '            "fontFamily": null,\n' +
    '            "editor": "draw2d.ui.LabelInplaceEditor",\n' +
    '            "locator": "draw2d.layout.locator.CenterLocator"\n' +
    '          }\n' +
    '        ]\n' +
    '      }\n' +
    '    ]';

let process_structure_sankey2_connections = '[\n' +
    '      {\n' +
    '        "type": "sankey.shape.Connection",\n' +
    '        "id": "8d1eca53-089b-e2ac-0c5e-3df132b85e28",\n' +
    '        "alpha": 1,\n' +
    '        "angle": 0,\n' +
    '        "userData": {\n' +
    '          "jsonPath": ""\n' +
    '        },\n' +
    '        "cssClass": "sankey_shape_Connection",\n' +
    '        "stroke": 5,\n' +
    '        "color": "#129CE4",\n' +
    '        "outlineStroke": 0,\n' +
    '        "outlineColor": "none",\n' +
    '        "dasharray": "-",\n' +
    '        "policy": "draw2d.policy.line.OrthogonalSelectionFeedbackPolicy",\n' +
    '        "vertex": [\n' +
    '          {\n' +
    '            "x": 1062,\n' +
    '            "y": 425\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1127.5,\n' +
    '            "y": 425\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1127.5,\n' +
    '            "y": 424\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1193,\n' +
    '            "y": 424\n' +
    '          }\n' +
    '        ],\n' +
    '        "router": "draw2d.layout.connection.InteractiveManhattanConnectionRouter",\n' +
    '        "radius": 3,\n' +
    '        "routingMetaData": {\n' +
    '          "routedByUserInteraction": false,\n' +
    '          "fromDir": 1,\n' +
    '          "toDir": 3\n' +
    '        },\n' +
    '        "source": {\n' +
    '          "node": "477a0f8b-e78b-b691-fde4-1bf6ac89d3f9",\n' +
    '          "port": "output0"\n' +
    '        },\n' +
    '        "target": {\n' +
    '          "node": "c178c350-a0a8-ab7f-2c25-b174b0b021ae",\n' +
    '          "port": "input0",\n' +
    '          "decoration": "draw2d.decoration.connection.ArrowDecorator"\n' +
    '        },\n' +
    '        "labels": []\n' +
    '      },\n' +
    '      {\n' +
    '        "type": "sankey.shape.Connection",\n' +
    '        "id": "cc26a068-8901-93f3-14c6-9c171d91aa29",\n' +
    '        "alpha": 1,\n' +
    '        "angle": 0,\n' +
    '        "userData": {\n' +
    '          "jsonPath": ""\n' +
    '        },\n' +
    '        "cssClass": "sankey_shape_Connection",\n' +
    '        "stroke": 5,\n' +
    '        "color": "#129CE4",\n' +
    '        "outlineStroke": 0,\n' +
    '        "outlineColor": "none",\n' +
    '        "dasharray": "-",\n' +
    '        "policy": "draw2d.policy.line.OrthogonalSelectionFeedbackPolicy",\n' +
    '        "vertex": [\n' +
    '          {\n' +
    '            "x": 1243,\n' +
    '            "y": 424\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1314.5,\n' +
    '            "y": 424\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1314.5,\n' +
    '            "y": 425\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1386,\n' +
    '            "y": 425\n' +
    '          }\n' +
    '        ],\n' +
    '        "router": "draw2d.layout.connection.InteractiveManhattanConnectionRouter",\n' +
    '        "radius": 3,\n' +
    '        "routingMetaData": {\n' +
    '          "routedByUserInteraction": false,\n' +
    '          "fromDir": 1,\n' +
    '          "toDir": 3\n' +
    '        },\n' +
    '        "source": {\n' +
    '          "node": "c178c350-a0a8-ab7f-2c25-b174b0b021ae",\n' +
    '          "port": "output0"\n' +
    '        },\n' +
    '        "target": {\n' +
    '          "node": "dd29d8cb-7264-24e3-707c-14aed6de4213",\n' +
    '          "port": "input0",\n' +
    '          "decoration": "draw2d.decoration.connection.ArrowDecorator"\n' +
    '        },\n' +
    '        "labels": []\n' +
    '      },\n' +
    '      {\n' +
    '        "type": "sankey.shape.Connection",\n' +
    '        "id": "f462002f-59e6-ca97-4891-d3ddd3b3bf59",\n' +
    '        "alpha": 1,\n' +
    '        "angle": 0,\n' +
    '        "userData": {\n' +
    '          "jsonPath": ""\n' +
    '        },\n' +
    '        "cssClass": "sankey_shape_Connection",\n' +
    '        "stroke": 5,\n' +
    '        "color": "#129CE4",\n' +
    '        "outlineStroke": 0,\n' +
    '        "outlineColor": "none",\n' +
    '        "dasharray": "-",\n' +
    '        "policy": "draw2d.policy.line.OrthogonalSelectionFeedbackPolicy",\n' +
    '        "vertex": [\n' +
    '          {\n' +
    '            "x": 1436,\n' +
    '            "y": 437.5\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1524.5,\n' +
    '            "y": 437.5\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1524.5,\n' +
    '            "y": 506\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1613,\n' +
    '            "y": 506\n' +
    '          }\n' +
    '        ],\n' +
    '        "router": "draw2d.layout.connection.InteractiveManhattanConnectionRouter",\n' +
    '        "radius": 3,\n' +
    '        "routingMetaData": {\n' +
    '          "routedByUserInteraction": false,\n' +
    '          "fromDir": 1,\n' +
    '          "toDir": 3\n' +
    '        },\n' +
    '        "source": {\n' +
    '          "node": "dd29d8cb-7264-24e3-707c-14aed6de4213",\n' +
    '          "port": "output0"\n' +
    '        },\n' +
    '        "target": {\n' +
    '          "node": "2af387cf-59ae-b0e4-853c-427b5f9de14b",\n' +
    '          "port": "input0",\n' +
    '          "decoration": "draw2d.decoration.connection.ArrowDecorator"\n' +
    '        },\n' +
    '        "labels": []\n' +
    '      },\n' +
    '      {\n' +
    '        "type": "sankey.shape.Connection",\n' +
    '        "id": "ef2cd5e9-a1cb-0888-3783-28041e2d4916",\n' +
    '        "alpha": 1,\n' +
    '        "angle": 0,\n' +
    '        "userData": {\n' +
    '          "jsonPath": ""\n' +
    '        },\n' +
    '        "cssClass": "sankey_shape_Connection",\n' +
    '        "stroke": 5,\n' +
    '        "color": "#129CE4",\n' +
    '        "outlineStroke": 0,\n' +
    '        "outlineColor": "none",\n' +
    '        "dasharray": "-",\n' +
    '        "policy": "draw2d.policy.line.OrthogonalSelectionFeedbackPolicy",\n' +
    '        "vertex": [\n' +
    '          {\n' +
    '            "x": 1436,\n' +
    '            "y": 412.5\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1525,\n' +
    '            "y": 412.5\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1525,\n' +
    '            "y": 348\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1614,\n' +
    '            "y": 348\n' +
    '          }\n' +
    '        ],\n' +
    '        "router": "draw2d.layout.connection.InteractiveManhattanConnectionRouter",\n' +
    '        "radius": 3,\n' +
    '        "routingMetaData": {\n' +
    '          "routedByUserInteraction": false,\n' +
    '          "fromDir": 1,\n' +
    '          "toDir": 3\n' +
    '        },\n' +
    '        "source": {\n' +
    '          "node": "dd29d8cb-7264-24e3-707c-14aed6de4213",\n' +
    '          "port": "output0"\n' +
    '        },\n' +
    '        "target": {\n' +
    '          "node": "f8966633-5a4f-23a9-6003-a315cec7c7ff",\n' +
    '          "port": "input0",\n' +
    '          "decoration": "draw2d.decoration.connection.ArrowDecorator"\n' +
    '        },\n' +
    '        "labels": []\n' +
    '      },\n' +
    '      {\n' +
    '        "type": "sankey.shape.Connection",\n' +
    '        "id": "7a44ee8e-2599-83aa-41f2-45be8032663b",\n' +
    '        "alpha": 1,\n' +
    '        "angle": 0,\n' +
    '        "userData": {\n' +
    '          "jsonPath": ""\n' +
    '        },\n' +
    '        "cssClass": "sankey_shape_Connection",\n' +
    '        "stroke": 5,\n' +
    '        "color": "#129CE4",\n' +
    '        "outlineStroke": 0,\n' +
    '        "outlineColor": "none",\n' +
    '        "dasharray": "-",\n' +
    '        "policy": "draw2d.policy.line.OrthogonalSelectionFeedbackPolicy",\n' +
    '        "vertex": [\n' +
    '          {\n' +
    '            "x": 1663,\n' +
    '            "y": 506\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1748.5,\n' +
    '            "y": 506\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1748.5,\n' +
    '            "y": 436.5\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1834,\n' +
    '            "y": 436.5\n' +
    '          }\n' +
    '        ],\n' +
    '        "router": "draw2d.layout.connection.InteractiveManhattanConnectionRouter",\n' +
    '        "radius": 3,\n' +
    '        "routingMetaData": {\n' +
    '          "routedByUserInteraction": false,\n' +
    '          "fromDir": 1,\n' +
    '          "toDir": 3\n' +
    '        },\n' +
    '        "source": {\n' +
    '          "node": "2af387cf-59ae-b0e4-853c-427b5f9de14b",\n' +
    '          "port": "output0"\n' +
    '        },\n' +
    '        "target": {\n' +
    '          "node": "5baccc2c-891b-549f-f9ad-680f738d9103",\n' +
    '          "port": "input0",\n' +
    '          "decoration": "draw2d.decoration.connection.ArrowDecorator"\n' +
    '        },\n' +
    '        "labels": []\n' +
    '      },\n' +
    '      {\n' +
    '        "type": "sankey.shape.Connection",\n' +
    '        "id": "e5773c2e-869c-df5b-1785-718c12ae36ff",\n' +
    '        "alpha": 1,\n' +
    '        "angle": 0,\n' +
    '        "userData": {\n' +
    '          "jsonPath": ""\n' +
    '        },\n' +
    '        "cssClass": "sankey_shape_Connection",\n' +
    '        "stroke": 5,\n' +
    '        "color": "#129CE4",\n' +
    '        "outlineStroke": 0,\n' +
    '        "outlineColor": "none",\n' +
    '        "dasharray": "-",\n' +
    '        "policy": "draw2d.policy.line.OrthogonalSelectionFeedbackPolicy",\n' +
    '        "vertex": [\n' +
    '          {\n' +
    '            "x": 1664,\n' +
    '            "y": 348\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1749,\n' +
    '            "y": 348\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1749,\n' +
    '            "y": 411.5\n' +
    '          },\n' +
    '          {\n' +
    '            "x": 1834,\n' +
    '            "y": 411.5\n' +
    '          }\n' +
    '        ],\n' +
    '        "router": "draw2d.layout.connection.InteractiveManhattanConnectionRouter",\n' +
    '        "radius": 3,\n' +
    '        "routingMetaData": {\n' +
    '          "routedByUserInteraction": false,\n' +
    '          "fromDir": 1,\n' +
    '          "toDir": 3\n' +
    '        },\n' +
    '        "source": {\n' +
    '          "node": "f8966633-5a4f-23a9-6003-a315cec7c7ff",\n' +
    '          "port": "output0"\n' +
    '        },\n' +
    '        "target": {\n' +
    '          "node": "5baccc2c-891b-549f-f9ad-680f738d9103",\n' +
    '          "port": "input0",\n' +
    '          "decoration": "draw2d.decoration.connection.ArrowDecorator"\n' +
    '        },\n' +
    '        "labels": []\n' +
    '      }\n' +
    '    ]';