let UsersAndRoles = require('../../controllers/users/UsersAndRoles');
let ProcessStructure = require('../../controllers/processes/processStructure');

// variables
exports.noFather = '';
exports.role1 = 'role 1';
exports.role2 = 'role 2';
exports.role3 = 'role 3';
exports.role4 = 'role 4';
exports.role5 = 'role 5';
exports.username1 = 'username1@bgu.aguda.ac.il';
exports.username21 = 'username21@bgu.aguda.ac.il';
exports.username22 = 'username22@bgu.aguda.ac.il';
exports.username31 = 'username31@bgu.aguda.ac.il';
exports.username32 = 'username3@2bgu.aguda.ac.il';
exports.username4 = 'username4@bgu.aguda.ac.il';
exports.username5 = 'username5@bgu.aguda.ac.il';
exports.processStructureName = 'my process structure';
exports.processStructureName2 = 'my process structure 2';
exports.processName = 'active process name';
exports.processName2 = 'active process name 2';

/*
            <<<INIT ROLE TREE>>>

               +--------+
               | role 1 |
            +--+--------+--+
            |              |
        +---v----+     +---v----+
        | role 2 |     | role 3 |
        +---+----+     +--------+
            |
            v
        +---+----+
        | role 4 |
        +---+----+
            |
            v
        +---+----+
        | role 5 |
        +--------+
 */
exports.initRoleTree = function (done) {
    UsersAndRoles.addNewRole(this.role1, this.noFather, () => {
        UsersAndRoles.addNewRole(this.role2, this.role1, () => {
            UsersAndRoles.addNewRole(this.role3, this.role1, () => {
                UsersAndRoles.addNewRole(this.role4, this.role2, () => {
                    UsersAndRoles.addNewRole(this.role5, this.role4, () => {
                        done();
                    });
                });
            });
        });
    });
};

/*
               <<< MATCH USERS TO ROLES >>>

                +----------------------------+
                |          role 1            |
                |  username1@bgu.aguda.ac.il |
                +-----+------------------+---+
                      |                  |
                      |                  |
                      v                  v
+----------------------------+     +------------------------------+
|          role 2            |     |          role 3              |
| username21@bgu.aguda.ac.il |     | username31@bgu.aguda.ac.il   |
| username22@bgu.aguda.ac.il |     | username3@2bgu.aguda.ac.il   |
+-------------+--------------+     +------------------------------+
              |
              v
+---------------------------+
|          role 4           |
| username4@bgu.aguda.ac.il |
+-------------+-------------+
              |
              v
+---------------------------+
|          role 5           |
| username5@bgu.aguda.ac.il |
+---------------------------+
 */

exports.initMatchUsersToRoles = function (done) {
    UsersAndRoles.addNewUserToRole(this.username1, this.role1,
        () => UsersAndRoles.addNewUserToRole(this.username21, this.role2,
            () => UsersAndRoles.addNewUserToRole(this.username22, this.role2,
                () => UsersAndRoles.addNewUserToRole(this.username31, this.role3,
                    () => UsersAndRoles.addNewUserToRole(this.username32, this.role3,
                        () => UsersAndRoles.addNewUserToRole(this.username4, this.role4,
                            () => UsersAndRoles.addNewUserToRole(this.username5, this.role5, () => done())))))));
};


/*
        Simple Process Structure

            +------------+
            |   role 1   | <-----+
            +-----+------+
                  |
                  v
            +-----+------+
            |   role 2   | <-----+
            +-----+------+
                  |
                  v
            +-----+------+
            |   role 3   |
            +-----+------+
                  |
                  v
            +-----+------+
            |   role 4   |
            +-----+------+
                  |
                  v
            +-----+------+
            |   role 5   |
            +------------+

 */
exports.initSimpleProcessStructure = function (done) {
    ProcessStructure.addProcessStructure(this.processStructureName, JSON.stringify({
        "content": {
            "diagram": [
                {
                    "type": "sankey.shape.State",
                    "id": "567cc4ff-fc8b-6780-1579-ef7f66adb014",
                    "x": 968,
                    "y": 342.40000915527344,
                    "width": 50,
                    "height": 57.015625,
                    "alpha": 1,
                    "angle": 0,
                    "userData": {},
                    "cssClass": "sankey_shape_State",
                    "bgColor": "#5957FF",
                    "color": "#000000",
                    "stroke": 1,
                    "radius": 0,
                    "dasharray": null,
                    "labels": [
                        {
                            "type": "draw2d.shape.basic.Label",
                            "id": "96a57927-73bc-01fe-3bcb-9edcfb407e89",
                            "x": -0.5,
                            "y": 14.5,
                            "width": 35.234375,
                            "height": 19.1875,
                            "alpha": 1,
                            "angle": 270,
                            "userData": {},
                            "cssClass": "draw2d_shape_basic_Label",
                            "ports": [],
                            "bgColor": "none",
                            "color": "#1B1B1B",
                            "stroke": 0,
                            "radius": 0,
                            "dasharray": null,
                            "text": "role 1",
                            "outlineStroke": 0,
                            "outlineColor": "none",
                            "fontSize": 18,
                            "fontColor": "#FFFFFF",
                            "fontFamily": null,
                            "editor": "draw2d.ui.LabelInplaceEditor",
                            "locator": "draw2d.layout.locator.CenterLocator"
                        }
                    ]
                },
                {
                    "type": "sankey.shape.State",
                    "id": "32e7c51d-2fd5-49c6-5253-b0f7268ef7e8",
                    "x": 1111,
                    "y": 342.40000915527344,
                    "width": 50,
                    "height": 57.015625,
                    "alpha": 1,
                    "angle": 0,
                    "userData": {},
                    "cssClass": "sankey_shape_State",
                    "bgColor": "#5957FF",
                    "color": "#000000",
                    "stroke": 1,
                    "radius": 0,
                    "dasharray": null,
                    "labels": [
                        {
                            "type": "draw2d.shape.basic.Label",
                            "id": "70b9e23c-4b9b-0b3e-f026-59744732e118",
                            "x": -0.5,
                            "y": 14.5,
                            "width": 35.265625,
                            "height": 19.1875,
                            "alpha": 1,
                            "angle": 270,
                            "userData": {},
                            "cssClass": "draw2d_shape_basic_Label",
                            "ports": [],
                            "bgColor": "none",
                            "color": "#1B1B1B",
                            "stroke": 0,
                            "radius": 0,
                            "dasharray": null,
                            "text": "role 2",
                            "outlineStroke": 0,
                            "outlineColor": "none",
                            "fontSize": 18,
                            "fontColor": "#FFFFFF",
                            "fontFamily": null,
                            "editor": "draw2d.ui.LabelInplaceEditor",
                            "locator": "draw2d.layout.locator.CenterLocator"
                        }
                    ]
                },
                {
                    "type": "sankey.shape.State",
                    "id": "7083237b-5bef-3d15-8a3f-a9e182c29817",
                    "x": 1226,
                    "y": 343.40000915527344,
                    "width": 50,
                    "height": 57.015625,
                    "alpha": 1,
                    "angle": 0,
                    "userData": {},
                    "cssClass": "sankey_shape_State",
                    "bgColor": "#FFB224",
                    "color": "#000000",
                    "stroke": 1,
                    "radius": 0,
                    "dasharray": null,
                    "labels": [
                        {
                            "type": "draw2d.shape.basic.Label",
                            "id": "fe5b5515-e15b-e294-83da-ecbd1d7eb770",
                            "x": -0.5,
                            "y": 14.5,
                            "width": 35.265625,
                            "height": 19.1875,
                            "alpha": 1,
                            "angle": 270,
                            "userData": {},
                            "cssClass": "draw2d_shape_basic_Label",
                            "ports": [],
                            "bgColor": "none",
                            "color": "#1B1B1B",
                            "stroke": 0,
                            "radius": 0,
                            "dasharray": null,
                            "text": "role 3",
                            "outlineStroke": 0,
                            "outlineColor": "none",
                            "fontSize": 18,
                            "fontColor": "#FFFFFF",
                            "fontFamily": null,
                            "editor": "draw2d.ui.LabelInplaceEditor",
                            "locator": "draw2d.layout.locator.CenterLocator"
                        }
                    ]
                },
                {
                    "type": "sankey.shape.State",
                    "id": "9477d308-4c05-789c-23c9-7ad4a1f45ce8",
                    "x": 1355,
                    "y": 343.40000915527344,
                    "width": 50,
                    "height": 57.015625,
                    "alpha": 1,
                    "angle": 0,
                    "userData": {},
                    "cssClass": "sankey_shape_State",
                    "bgColor": "#FFB224",
                    "color": "#000000",
                    "stroke": 1,
                    "radius": 0,
                    "dasharray": null,
                    "labels": [
                        {
                            "type": "draw2d.shape.basic.Label",
                            "id": "65748a38-ad4f-5819-08d7-47ef8e2f9438",
                            "x": -0.5,
                            "y": 14.5,
                            "width": 35.265625,
                            "height": 19.1875,
                            "alpha": 1,
                            "angle": 270,
                            "userData": {},
                            "cssClass": "draw2d_shape_basic_Label",
                            "ports": [],
                            "bgColor": "none",
                            "color": "#1B1B1B",
                            "stroke": 0,
                            "radius": 0,
                            "dasharray": null,
                            "text": "role 4",
                            "outlineStroke": 0,
                            "outlineColor": "none",
                            "fontSize": 18,
                            "fontColor": "#FFFFFF",
                            "fontFamily": null,
                            "editor": "draw2d.ui.LabelInplaceEditor",
                            "locator": "draw2d.layout.locator.CenterLocator"
                        }
                    ]
                },
                {
                    "type": "sankey.shape.State",
                    "id": "92a14d04-85fd-acc9-1dd8-a1e9b74d6caf",
                    "x": 1483,
                    "y": 344.40000915527344,
                    "width": 50,
                    "height": 57.015625,
                    "alpha": 1,
                    "angle": 0,
                    "userData": {},
                    "cssClass": "sankey_shape_State",
                    "bgColor": "#FFB224",
                    "color": "#000000",
                    "stroke": 1,
                    "radius": 0,
                    "dasharray": null,
                    "labels": [
                        {
                            "type": "draw2d.shape.basic.Label",
                            "id": "c7f3bf84-8f9b-10df-3a7a-4339c5e5e295",
                            "x": -0.5,
                            "y": 14.5,
                            "width": 35.265625,
                            "height": 19.1875,
                            "alpha": 1,
                            "angle": 270,
                            "userData": {},
                            "cssClass": "draw2d_shape_basic_Label",
                            "ports": [],
                            "bgColor": "none",
                            "color": "#1B1B1B",
                            "stroke": 0,
                            "radius": 0,
                            "dasharray": null,
                            "text": "role 5",
                            "outlineStroke": 0,
                            "outlineColor": "none",
                            "fontSize": 18,
                            "fontColor": "#FFFFFF",
                            "fontFamily": null,
                            "editor": "draw2d.ui.LabelInplaceEditor",
                            "locator": "draw2d.layout.locator.CenterLocator"
                        }
                    ]
                },
                {
                    "type": "sankey.shape.Connection",
                    "id": "be9abf62-ca24-f417-7a39-c9c2357b528d",
                    "alpha": 1,
                    "angle": 0,
                    "userData": {
                        "jsonPath": ""
                    },
                    "cssClass": "sankey_shape_Connection",
                    "stroke": 5,
                    "color": "#129CE4",
                    "outlineStroke": 0,
                    "outlineColor": "none",
                    "dasharray": "-",
                    "policy": "draw2d.policy.line.OrthogonalSelectionFeedbackPolicy",
                    "vertex": [
                        {
                            "x": 1405,
                            "y": 371.90782165527344
                        },
                        {
                            "x": 1444,
                            "y": 371.90782165527344
                        },
                        {
                            "x": 1444,
                            "y": 372.90782165527344
                        },
                        {
                            "x": 1483,
                            "y": 372.90782165527344
                        }
                    ],
                    "router": "draw2d.layout.connection.InteractiveManhattanConnectionRouter",
                    "radius": 3,
                    "routingMetaData": {
                        "routedByUserInteraction": false,
                        "fromDir": 1,
                        "toDir": 3
                    },
                    "source": {
                        "node": "9477d308-4c05-789c-23c9-7ad4a1f45ce8",
                        "port": "output0"
                    },
                    "target": {
                        "node": "92a14d04-85fd-acc9-1dd8-a1e9b74d6caf",
                        "port": "input0",
                        "decoration": "draw2d.decoration.connection.ArrowDecorator"
                    },
                    "labels": []
                },
                {
                    "type": "sankey.shape.Connection",
                    "id": "35a38202-f03e-a022-0c9d-348611cce9b7",
                    "alpha": 1,
                    "angle": 0,
                    "userData": {
                        "jsonPath": ""
                    },
                    "cssClass": "sankey_shape_Connection",
                    "stroke": 5,
                    "color": "#129CE4",
                    "outlineStroke": 0,
                    "outlineColor": "none",
                    "dasharray": "-",
                    "policy": "draw2d.policy.line.OrthogonalSelectionFeedbackPolicy",
                    "vertex": [
                        {
                            "x": 1276,
                            "y": 371.90782165527344
                        },
                        {
                            "x": 1355,
                            "y": 371.90782165527344
                        }
                    ],
                    "router": "draw2d.layout.connection.InteractiveManhattanConnectionRouter",
                    "radius": 3,
                    "routingMetaData": {
                        "routedByUserInteraction": false,
                        "fromDir": 1,
                        "toDir": 3
                    },
                    "source": {
                        "node": "7083237b-5bef-3d15-8a3f-a9e182c29817",
                        "port": "output0"
                    },
                    "target": {
                        "node": "9477d308-4c05-789c-23c9-7ad4a1f45ce8",
                        "port": "input0",
                        "decoration": "draw2d.decoration.connection.ArrowDecorator"
                    },
                    "labels": []
                },
                {
                    "type": "sankey.shape.Connection",
                    "id": "dde6610d-0ee5-a230-7a1a-41565c4e4598",
                    "alpha": 1,
                    "angle": 0,
                    "userData": {
                        "jsonPath": ""
                    },
                    "cssClass": "sankey_shape_Connection",
                    "stroke": 5,
                    "color": "#129CE4",
                    "outlineStroke": 0,
                    "outlineColor": "none",
                    "dasharray": "-",
                    "policy": "draw2d.policy.line.OrthogonalSelectionFeedbackPolicy",
                    "vertex": [
                        {
                            "x": 1018,
                            "y": 370.90782165527344
                        },
                        {
                            "x": 1111,
                            "y": 370.90782165527344
                        }
                    ],
                    "router": "draw2d.layout.connection.InteractiveManhattanConnectionRouter",
                    "radius": 3,
                    "routingMetaData": {
                        "routedByUserInteraction": false,
                        "fromDir": 1,
                        "toDir": 3
                    },
                    "source": {
                        "node": "567cc4ff-fc8b-6780-1579-ef7f66adb014",
                        "port": "output0"
                    },
                    "target": {
                        "node": "32e7c51d-2fd5-49c6-5253-b0f7268ef7e8",
                        "port": "input0",
                        "decoration": "draw2d.decoration.connection.ArrowDecorator"
                    },
                    "labels": []
                },
                {
                    "type": "sankey.shape.Connection",
                    "id": "820bd9d8-1eb9-c300-67ac-c4598692479b",
                    "alpha": 1,
                    "angle": 0,
                    "userData": {
                        "jsonPath": ""
                    },
                    "cssClass": "sankey_shape_Connection",
                    "stroke": 5,
                    "color": "#129CE4",
                    "outlineStroke": 0,
                    "outlineColor": "none",
                    "dasharray": "-",
                    "policy": "draw2d.policy.line.OrthogonalSelectionFeedbackPolicy",
                    "vertex": [
                        {
                            "x": 1161,
                            "y": 370.90782165527344
                        },
                        {
                            "x": 1193.5,
                            "y": 370.90782165527344
                        },
                        {
                            "x": 1193.5,
                            "y": 371.90782165527344
                        },
                        {
                            "x": 1226,
                            "y": 371.90782165527344
                        }
                    ],
                    "router": "draw2d.layout.connection.InteractiveManhattanConnectionRouter",
                    "radius": 3,
                    "routingMetaData": {
                        "routedByUserInteraction": false,
                        "fromDir": 1,
                        "toDir": 3
                    },
                    "source": {
                        "node": "32e7c51d-2fd5-49c6-5253-b0f7268ef7e8",
                        "port": "output0"
                    },
                    "target": {
                        "node": "7083237b-5bef-3d15-8a3f-a9e182c29817",
                        "port": "input0",
                        "decoration": "draw2d.decoration.connection.ArrowDecorator"
                    },
                    "labels": []
                }
            ]
        }
    }), () => done());
};


/*
        another structure

        +----------+
        |  role 4  +<----+
        +-----+----+
              |
              |
              v
        +-----+----+
        |  role 5  |
        +----------+

 */

exports.initAnotherProcessStructure = function (done) {
    ProcessStructure.addProcessStructure(this.processStructureName2, JSON.stringify({
        "content": {
            "diagram": [
                {
                    "type": "sankey.shape.State",
                    "id": "de59fd59-37a7-15ac-196f-6f82f36dc7fb",
                    "x": 1424,
                    "y": 357.40000915527344,
                    "width": 50,
                    "height": 92.578125,
                    "alpha": 1,
                    "angle": 0,
                    "userData": {},
                    "cssClass": "sankey_shape_State",
                    "bgColor": "#5957FF",
                    "color": "#000000",
                    "stroke": 1,
                    "radius": 0,
                    "dasharray": null,
                    "labels": [
                        {
                            "type": "draw2d.shape.basic.Label",
                            "id": "8ffaef54-adcc-288a-af52-9944d23284c2",
                            "x": -0.5,
                            "y": 32.5,
                            "width": 54.984375,
                            "height": 19.1875,
                            "alpha": 1,
                            "angle": 270,
                            "userData": {},
                            "cssClass": "draw2d_shape_basic_Label",
                            "ports": [],
                            "bgColor": "none",
                            "color": "#1B1B1B",
                            "stroke": 0,
                            "radius": 0,
                            "dasharray": null,
                            "text": "role 4",
                            "outlineStroke": 0,
                            "outlineColor": "none",
                            "fontSize": 18,
                            "fontColor": "#FFFFFF",
                            "fontFamily": null,
                            "editor": "draw2d.ui.LabelInplaceEditor",
                            "locator": "draw2d.layout.locator.CenterLocator"
                        }
                    ]
                },
                {
                    "type": "sankey.shape.State",
                    "id": "bb23ad5e-22e8-8542-556b-d7e31ed203c2",
                    "x": 1617,
                    "y": 420.40000915527344,
                    "width": 50,
                    "height": 92.578125,
                    "alpha": 1,
                    "angle": 0,
                    "userData": {},
                    "cssClass": "sankey_shape_State",
                    "bgColor": "#FFB224",
                    "color": "#000000",
                    "stroke": 1,
                    "radius": 0,
                    "dasharray": null,
                    "labels": [
                        {
                            "type": "draw2d.shape.basic.Label",
                            "id": "2102fcb7-bb18-24c9-d3a2-e4c521e4271d",
                            "x": -0.5,
                            "y": 32.5,
                            "width": 54.984375,
                            "height": 19.1875,
                            "alpha": 1,
                            "angle": 270,
                            "userData": {},
                            "cssClass": "draw2d_shape_basic_Label",
                            "ports": [],
                            "bgColor": "none",
                            "color": "#1B1B1B",
                            "stroke": 0,
                            "radius": 0,
                            "dasharray": null,
                            "text": "role 5",
                            "outlineStroke": 0,
                            "outlineColor": "none",
                            "fontSize": 18,
                            "fontColor": "#FFFFFF",
                            "fontFamily": null,
                            "editor": "draw2d.ui.LabelInplaceEditor",
                            "locator": "draw2d.layout.locator.CenterLocator"
                        }
                    ]
                },
                {
                    "type": "sankey.shape.Connection",
                    "id": "a98f392e-cce4-b999-c816-cfc67c315d93",
                    "alpha": 1,
                    "angle": 0,
                    "userData": {
                        "jsonPath": ""
                    },
                    "cssClass": "sankey_shape_Connection",
                    "stroke": 5,
                    "color": "#129CE4",
                    "outlineStroke": 0,
                    "outlineColor": "none",
                    "dasharray": "-",
                    "policy": "draw2d.policy.line.OrthogonalSelectionFeedbackPolicy",
                    "vertex": [
                        {
                            "x": 1474,
                            "y": 403.68907165527344
                        },
                        {
                            "x": 1545.5,
                            "y": 403.68907165527344
                        },
                        {
                            "x": 1545.5,
                            "y": 466.68907165527344
                        },
                        {
                            "x": 1617,
                            "y": 466.68907165527344
                        }
                    ],
                    "router": "draw2d.layout.connection.InteractiveManhattanConnectionRouter",
                    "radius": 3,
                    "routingMetaData": {
                        "routedByUserInteraction": false,
                        "fromDir": 1,
                        "toDir": 3
                    },
                    "source": {
                        "node": "de59fd59-37a7-15ac-196f-6f82f36dc7fb",
                        "port": "output0"
                    },
                    "target": {
                        "node": "bb23ad5e-22e8-8542-556b-d7e31ed203c2",
                        "port": "input0",
                        "decoration": "draw2d.decoration.connection.ArrowDecorator"
                    },
                    "labels": []
                }
            ]
        }
    }), () => done());
};

