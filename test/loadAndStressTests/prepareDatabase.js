let mongoose = require('mongoose');
let processStructureController = require('../../controllers/processesControllers/processStructureController');
let usersAndRolesController = require('../../controllers/usersControllers/usersAndRolesController');
let userAccessor = require('../../models/accessors/usersAccessor');
let fs = require("fs");


async function setDB() {
    mongoose.set('useCreateIndex', true);
    await mongoose.connect('mongodb://localhost:27017/Tests', {useNewUrlParser: true});
    await mongoose.connection.db.dropDatabase();

    await userAccessor.addAdmin("admin@admin.com", (err) => {
        usersAndRolesController.getUsersAndRolesTree((err) => {
            /*usersAndRolesController.loadDefaultTree("admin@admin.com",(err)=>{

            });*/
            let demoTreeString = fs.readFileSync("../../defaultTree/defaultTree.json");
            let emailsToFullName = JSON.parse(fs.readFileSync("../../defaultTree/emailsToFullName.json"));
            let rolesToDereg = JSON.parse(fs.readFileSync("../../defaultTree/rolesToDereg.json"));
            let rolesToEmails = JSON.parse(fs.readFileSync("../../defaultTree/rolesToEmails.json"));
            usersAndRolesController.setUsersAndRolesTree("admin@admin.com", demoTreeString, rolesToEmails, emailsToFullName, rolesToDereg, (err) => {
                processStructureController.addProcessStructure("admin@admin.com", "TestStructure", ps, [], "10000", "10000", (err) => {
                    mongoose.connection.close();
                });
            });
        });
    });
}

let ps;
{
    ps = "{\n" +
        "  \"content\": {\n" +
        "    \"diagram\": [\n" +
        "      {\n" +
        "        \"type\": \"sankey.shape.State\",\n" +
        "        \"id\": \"5b7bfdda-cf8f-d5f5-4383-5c598cebb517\",\n" +
        "        \"x\": 984,\n" +
        "        \"y\": 365.40000915527344,\n" +
        "        \"width\": 63.28125,\n" +
        "        \"height\": 80,\n" +
        "        \"alpha\": 1,\n" +
        "        \"angle\": 0,\n" +
        "        \"userData\": {},\n" +
        "        \"cssClass\": \"sankey_shape_State\",\n" +
        "        \"bgColor\": \"#D8A2C1\",\n" +
        "        \"color\": \"#000000\",\n" +
        "        \"stroke\": 1,\n" +
        "        \"radius\": 0,\n" +
        "        \"dasharray\": null,\n" +
        "        \"labels\": [\n" +
        "          {\n" +
        "            \"type\": \"draw2d.shape.basic.Label\",\n" +
        "            \"id\": \"d6888f01-bbfc-9b8b-ea99-5d042df74cd3\",\n" +
        "            \"x\": 0.5,\n" +
        "            \"y\": 26.5,\n" +
        "            \"width\": 38.984375,\n" +
        "            \"height\": 19.1875,\n" +
        "            \"alpha\": 1,\n" +
        "            \"angle\": 0,\n" +
        "            \"userData\": {},\n" +
        "            \"cssClass\": \"draw2d_shape_basic_Label\",\n" +
        "            \"ports\": [],\n" +
        "            \"bgColor\": \"none\",\n" +
        "            \"color\": \"#1B1B1B\",\n" +
        "            \"stroke\": 0,\n" +
        "            \"radius\": 0,\n" +
        "            \"dasharray\": null,\n" +
        "            \"text\": \"דרג רכז\",\n" +
        "            \"outlineStroke\": 0,\n" +
        "            \"outlineColor\": \"none\",\n" +
        "            \"fontSize\": 18,\n" +
        "            \"fontColor\": \"#FFFFFF\",\n" +
        "            \"fontFamily\": null,\n" +
        "            \"locator\": \"draw2d.layout.locator.CenterLocator\"\n" +
        "          }\n" +
        "        ]\n" +
        "      },\n" +
        "      {\n" +
        "        \"type\": \"sankey.shape.State\",\n" +
        "        \"id\": \"d50f2259-a7bb-fb5e-db3d-2f6cc409a01a\",\n" +
        "        \"x\": 1167,\n" +
        "        \"y\": 366.40000915527344,\n" +
        "        \"width\": 75.28125,\n" +
        "        \"height\": 80,\n" +
        "        \"alpha\": 1,\n" +
        "        \"angle\": 0,\n" +
        "        \"userData\": {},\n" +
        "        \"cssClass\": \"sankey_shape_State\",\n" +
        "        \"bgColor\": \"#D8A2C2\",\n" +
        "        \"color\": \"#000000\",\n" +
        "        \"stroke\": 1,\n" +
        "        \"radius\": 0,\n" +
        "        \"dasharray\": null,\n" +
        "        \"labels\": [\n" +
        "          {\n" +
        "            \"type\": \"draw2d.shape.basic.Label\",\n" +
        "            \"id\": \"e303c02a-d716-9afd-e04b-7671e8275dc9\",\n" +
        "            \"x\": 0.5,\n" +
        "            \"y\": 26.5,\n" +
        "            \"width\": 45.640625,\n" +
        "            \"height\": 19.1875,\n" +
        "            \"alpha\": 1,\n" +
        "            \"angle\": 0,\n" +
        "            \"userData\": {},\n" +
        "            \"cssClass\": \"draw2d_shape_basic_Label\",\n" +
        "            \"ports\": [],\n" +
        "            \"bgColor\": \"none\",\n" +
        "            \"color\": \"#1B1B1B\",\n" +
        "            \"stroke\": 0,\n" +
        "            \"radius\": 0,\n" +
        "            \"dasharray\": null,\n" +
        "            \"text\": \"דרג מנהל\",\n" +
        "            \"outlineStroke\": 0,\n" +
        "            \"outlineColor\": \"none\",\n" +
        "            \"fontSize\": 18,\n" +
        "            \"fontColor\": \"#FFFFFF\",\n" +
        "            \"fontFamily\": null,\n" +
        "            \"locator\": \"draw2d.layout.locator.CenterLocator\"\n" +
        "          }\n" +
        "        ]\n" +
        "      },\n" +
        "      {\n" +
        "        \"type\": \"sankey.shape.State\",\n" +
        "        \"id\": \"0b3054b7-ec2b-2d80-7272-a6eff8e6097e\",\n" +
        "        \"x\": 1379,\n" +
        "        \"y\": 373.40000915527344,\n" +
        "        \"width\": 74.46875,\n" +
        "        \"height\": 80,\n" +
        "        \"alpha\": 1,\n" +
        "        \"angle\": 0,\n" +
        "        \"userData\": {},\n" +
        "        \"cssClass\": \"sankey_shape_State\",\n" +
        "        \"bgColor\": \"#D8A2C3\",\n" +
        "        \"color\": \"#000000\",\n" +
        "        \"stroke\": 1,\n" +
        "        \"radius\": 0,\n" +
        "        \"dasharray\": null,\n" +
        "        \"labels\": [\n" +
        "          {\n" +
        "            \"type\": \"draw2d.shape.basic.Label\",\n" +
        "            \"id\": \"216d1e84-426f-168b-1ab4-1f2840a8202e\",\n" +
        "            \"x\": 0.5,\n" +
        "            \"y\": 26.5,\n" +
        "            \"width\": 45.1875,\n" +
        "            \"height\": 19.1875,\n" +
        "            \"alpha\": 1,\n" +
        "            \"angle\": 0,\n" +
        "            \"userData\": {},\n" +
        "            \"cssClass\": \"draw2d_shape_basic_Label\",\n" +
        "            \"ports\": [],\n" +
        "            \"bgColor\": \"none\",\n" +
        "            \"color\": \"#1B1B1B\",\n" +
        "            \"stroke\": 0,\n" +
        "            \"radius\": 0,\n" +
        "            \"dasharray\": null,\n" +
        "            \"text\": \"דרג רמ\\\"ד\",\n" +
        "            \"outlineStroke\": 0,\n" +
        "            \"outlineColor\": \"none\",\n" +
        "            \"fontSize\": 18,\n" +
        "            \"fontColor\": \"#FFFFFF\",\n" +
        "            \"fontFamily\": null,\n" +
        "            \"locator\": \"draw2d.layout.locator.CenterLocator\"\n" +
        "          }\n" +
        "        ]\n" +
        "      },\n" +
        "      {\n" +
        "        \"type\": \"sankey.shape.State\",\n" +
        "        \"id\": \"c88f43f4-37b7-f20a-0bfa-79df19214603\",\n" +
        "        \"x\": 1625,\n" +
        "        \"y\": 381.40000915527344,\n" +
        "        \"width\": 73.703125,\n" +
        "        \"height\": 80,\n" +
        "        \"alpha\": 1,\n" +
        "        \"angle\": 0,\n" +
        "        \"userData\": {},\n" +
        "        \"cssClass\": \"sankey_shape_State\",\n" +
        "        \"bgColor\": \"#D8A2C4\",\n" +
        "        \"color\": \"#000000\",\n" +
        "        \"stroke\": 1,\n" +
        "        \"radius\": 0,\n" +
        "        \"dasharray\": null,\n" +
        "        \"labels\": [\n" +
        "          {\n" +
        "            \"type\": \"draw2d.shape.basic.Label\",\n" +
        "            \"id\": \"b14d9cbf-36c3-767f-641a-b8009907ff48\",\n" +
        "            \"x\": 0.5,\n" +
        "            \"y\": 26.5,\n" +
        "            \"width\": 45.5625,\n" +
        "            \"height\": 19.1875,\n" +
        "            \"alpha\": 1,\n" +
        "            \"angle\": 0,\n" +
        "            \"userData\": {},\n" +
        "            \"cssClass\": \"draw2d_shape_basic_Label\",\n" +
        "            \"ports\": [],\n" +
        "            \"bgColor\": \"none\",\n" +
        "            \"color\": \"#1B1B1B\",\n" +
        "            \"stroke\": 0,\n" +
        "            \"radius\": 0,\n" +
        "            \"dasharray\": null,\n" +
        "            \"text\": \"דרג סיו\\\"ר\",\n" +
        "            \"outlineStroke\": 0,\n" +
        "            \"outlineColor\": \"none\",\n" +
        "            \"fontSize\": 18,\n" +
        "            \"fontColor\": \"#FFFFFF\",\n" +
        "            \"fontFamily\": null,\n" +
        "            \"locator\": \"draw2d.layout.locator.CenterLocator\"\n" +
        "          }\n" +
        "        ]\n" +
        "      },\n" +
        "      {\n" +
        "        \"type\": \"sankey.shape.State\",\n" +
        "        \"id\": \"fc20693c-c3af-d76d-0935-995683889a57\",\n" +
        "        \"x\": 1841,\n" +
        "        \"y\": 381.40000915527344,\n" +
        "        \"width\": 63.375,\n" +
        "        \"height\": 80,\n" +
        "        \"alpha\": 1,\n" +
        "        \"angle\": 0,\n" +
        "        \"userData\": {},\n" +
        "        \"cssClass\": \"sankey_shape_State\",\n" +
        "        \"bgColor\": \"#D8A2C5\",\n" +
        "        \"color\": \"#000000\",\n" +
        "        \"stroke\": 1,\n" +
        "        \"radius\": 0,\n" +
        "        \"dasharray\": null,\n" +
        "        \"labels\": [\n" +
        "          {\n" +
        "            \"type\": \"draw2d.shape.basic.Label\",\n" +
        "            \"id\": \"2f29f17a-26b0-8365-edb5-b1d35015f1d4\",\n" +
        "            \"x\": 0.5,\n" +
        "            \"y\": 26.5,\n" +
        "            \"width\": 39.828125,\n" +
        "            \"height\": 19.1875,\n" +
        "            \"alpha\": 1,\n" +
        "            \"angle\": 0,\n" +
        "            \"userData\": {},\n" +
        "            \"cssClass\": \"draw2d_shape_basic_Label\",\n" +
        "            \"ports\": [],\n" +
        "            \"bgColor\": \"none\",\n" +
        "            \"color\": \"#1B1B1B\",\n" +
        "            \"stroke\": 0,\n" +
        "            \"radius\": 0,\n" +
        "            \"dasharray\": null,\n" +
        "            \"text\": \"דרג יו\\\"ר\",\n" +
        "            \"outlineStroke\": 0,\n" +
        "            \"outlineColor\": \"none\",\n" +
        "            \"fontSize\": 18,\n" +
        "            \"fontColor\": \"#FFFFFF\",\n" +
        "            \"fontFamily\": null,\n" +
        "            \"locator\": \"draw2d.layout.locator.CenterLocator\"\n" +
        "          }\n" +
        "        ]\n" +
        "      },\n" +
        "      {\n" +
        "        \"type\": \"sankey.shape.Connection\",\n" +
        "        \"id\": \"ca108980-6984-40e3-67ba-53a244402ba6\",\n" +
        "        \"alpha\": 1,\n" +
        "        \"angle\": 0,\n" +
        "        \"userData\": {\n" +
        "          \"jsonPath\": \"\"\n" +
        "        },\n" +
        "        \"cssClass\": \"sankey_shape_Connection\",\n" +
        "        \"stroke\": 5,\n" +
        "        \"color\": \"#129CE4\",\n" +
        "        \"outlineStroke\": 0,\n" +
        "        \"outlineColor\": \"none\",\n" +
        "        \"dasharray\": \"-\",\n" +
        "        \"policy\": \"draw2d.policy.line.OrthogonalSelectionFeedbackPolicy\",\n" +
        "        \"vertex\": [\n" +
        "          {\n" +
        "            \"x\": 1453.46875,\n" +
        "            \"y\": 413.40000915527344\n" +
        "          },\n" +
        "          {\n" +
        "            \"x\": 1539.234375,\n" +
        "            \"y\": 413.40000915527344\n" +
        "          },\n" +
        "          {\n" +
        "            \"x\": 1539.234375,\n" +
        "            \"y\": 421.40000915527344\n" +
        "          },\n" +
        "          {\n" +
        "            \"x\": 1625,\n" +
        "            \"y\": 421.40000915527344\n" +
        "          }\n" +
        "        ],\n" +
        "        \"router\": \"draw2d.layout.connection.InteractiveManhattanConnectionRouter\",\n" +
        "        \"radius\": 3,\n" +
        "        \"routingMetaData\": {\n" +
        "          \"routedByUserInteraction\": false,\n" +
        "          \"fromDir\": 1,\n" +
        "          \"toDir\": 3\n" +
        "        },\n" +
        "        \"source\": {\n" +
        "          \"node\": \"0b3054b7-ec2b-2d80-7272-a6eff8e6097e\",\n" +
        "          \"port\": \"output0\"\n" +
        "        },\n" +
        "        \"target\": {\n" +
        "          \"node\": \"c88f43f4-37b7-f20a-0bfa-79df19214603\",\n" +
        "          \"port\": \"input0\",\n" +
        "          \"decoration\": \"draw2d.decoration.connection.ArrowDecorator\"\n" +
        "        },\n" +
        "        \"labels\": []\n" +
        "      },\n" +
        "      {\n" +
        "        \"type\": \"sankey.shape.Connection\",\n" +
        "        \"id\": \"1a65bf36-159e-5a72-5027-2dc24ab68f3b\",\n" +
        "        \"alpha\": 1,\n" +
        "        \"angle\": 0,\n" +
        "        \"userData\": {\n" +
        "          \"jsonPath\": \"\"\n" +
        "        },\n" +
        "        \"cssClass\": \"sankey_shape_Connection\",\n" +
        "        \"stroke\": 5,\n" +
        "        \"color\": \"#129CE4\",\n" +
        "        \"outlineStroke\": 0,\n" +
        "        \"outlineColor\": \"none\",\n" +
        "        \"dasharray\": \"-\",\n" +
        "        \"policy\": \"draw2d.policy.line.OrthogonalSelectionFeedbackPolicy\",\n" +
        "        \"vertex\": [\n" +
        "          {\n" +
        "            \"x\": 1047.28125,\n" +
        "            \"y\": 405.40000915527344\n" +
        "          },\n" +
        "          {\n" +
        "            \"x\": 1107.140625,\n" +
        "            \"y\": 405.40000915527344\n" +
        "          },\n" +
        "          {\n" +
        "            \"x\": 1107.140625,\n" +
        "            \"y\": 406.40000915527344\n" +
        "          },\n" +
        "          {\n" +
        "            \"x\": 1167,\n" +
        "            \"y\": 406.40000915527344\n" +
        "          }\n" +
        "        ],\n" +
        "        \"router\": \"draw2d.layout.connection.InteractiveManhattanConnectionRouter\",\n" +
        "        \"radius\": 3,\n" +
        "        \"routingMetaData\": {\n" +
        "          \"routedByUserInteraction\": false,\n" +
        "          \"fromDir\": 1,\n" +
        "          \"toDir\": 3\n" +
        "        },\n" +
        "        \"source\": {\n" +
        "          \"node\": \"5b7bfdda-cf8f-d5f5-4383-5c598cebb517\",\n" +
        "          \"port\": \"output0\"\n" +
        "        },\n" +
        "        \"target\": {\n" +
        "          \"node\": \"d50f2259-a7bb-fb5e-db3d-2f6cc409a01a\",\n" +
        "          \"port\": \"input0\",\n" +
        "          \"decoration\": \"draw2d.decoration.connection.ArrowDecorator\"\n" +
        "        },\n" +
        "        \"labels\": []\n" +
        "      },\n" +
        "      {\n" +
        "        \"type\": \"sankey.shape.Connection\",\n" +
        "        \"id\": \"f1a2a2ea-f362-93f5-324a-7e71395aa22a\",\n" +
        "        \"alpha\": 1,\n" +
        "        \"angle\": 0,\n" +
        "        \"userData\": {\n" +
        "          \"jsonPath\": \"\"\n" +
        "        },\n" +
        "        \"cssClass\": \"sankey_shape_Connection\",\n" +
        "        \"stroke\": 5,\n" +
        "        \"color\": \"#129CE4\",\n" +
        "        \"outlineStroke\": 0,\n" +
        "        \"outlineColor\": \"none\",\n" +
        "        \"dasharray\": \"-\",\n" +
        "        \"policy\": \"draw2d.policy.line.OrthogonalSelectionFeedbackPolicy\",\n" +
        "        \"vertex\": [\n" +
        "          {\n" +
        "            \"x\": 1242.28125,\n" +
        "            \"y\": 406.40000915527344\n" +
        "          },\n" +
        "          {\n" +
        "            \"x\": 1310.640625,\n" +
        "            \"y\": 406.40000915527344\n" +
        "          },\n" +
        "          {\n" +
        "            \"x\": 1310.640625,\n" +
        "            \"y\": 413.40000915527344\n" +
        "          },\n" +
        "          {\n" +
        "            \"x\": 1379,\n" +
        "            \"y\": 413.40000915527344\n" +
        "          }\n" +
        "        ],\n" +
        "        \"router\": \"draw2d.layout.connection.InteractiveManhattanConnectionRouter\",\n" +
        "        \"radius\": 3,\n" +
        "        \"routingMetaData\": {\n" +
        "          \"routedByUserInteraction\": false,\n" +
        "          \"fromDir\": 1,\n" +
        "          \"toDir\": 3\n" +
        "        },\n" +
        "        \"source\": {\n" +
        "          \"node\": \"d50f2259-a7bb-fb5e-db3d-2f6cc409a01a\",\n" +
        "          \"port\": \"output0\"\n" +
        "        },\n" +
        "        \"target\": {\n" +
        "          \"node\": \"0b3054b7-ec2b-2d80-7272-a6eff8e6097e\",\n" +
        "          \"port\": \"input0\",\n" +
        "          \"decoration\": \"draw2d.decoration.connection.ArrowDecorator\"\n" +
        "        },\n" +
        "        \"labels\": []\n" +
        "      },\n" +
        "      {\n" +
        "        \"type\": \"sankey.shape.Connection\",\n" +
        "        \"id\": \"05615121-3d9c-4dc8-98fc-14a5960814f2\",\n" +
        "        \"alpha\": 1,\n" +
        "        \"angle\": 0,\n" +
        "        \"userData\": {\n" +
        "          \"jsonPath\": \"\"\n" +
        "        },\n" +
        "        \"cssClass\": \"sankey_shape_Connection\",\n" +
        "        \"stroke\": 5,\n" +
        "        \"color\": \"#129CE4\",\n" +
        "        \"outlineStroke\": 0,\n" +
        "        \"outlineColor\": \"none\",\n" +
        "        \"dasharray\": \"-\",\n" +
        "        \"policy\": \"draw2d.policy.line.OrthogonalSelectionFeedbackPolicy\",\n" +
        "        \"vertex\": [\n" +
        "          {\n" +
        "            \"x\": 1698.703125,\n" +
        "            \"y\": 421.40000915527344\n" +
        "          },\n" +
        "          {\n" +
        "            \"x\": 1841,\n" +
        "            \"y\": 421.40000915527344\n" +
        "          }\n" +
        "        ],\n" +
        "        \"router\": \"draw2d.layout.connection.InteractiveManhattanConnectionRouter\",\n" +
        "        \"radius\": 3,\n" +
        "        \"routingMetaData\": {\n" +
        "          \"routedByUserInteraction\": false,\n" +
        "          \"fromDir\": 1,\n" +
        "          \"toDir\": 3\n" +
        "        },\n" +
        "        \"source\": {\n" +
        "          \"node\": \"c88f43f4-37b7-f20a-0bfa-79df19214603\",\n" +
        "          \"port\": \"output0\"\n" +
        "        },\n" +
        "        \"target\": {\n" +
        "          \"node\": \"fc20693c-c3af-d76d-0935-995683889a57\",\n" +
        "          \"port\": \"input0\",\n" +
        "          \"decoration\": \"draw2d.decoration.connection.ArrowDecorator\"\n" +
        "        },\n" +
        "        \"labels\": []\n" +
        "      }\n" +
        "    ]\n" +
        "  }\n" +
        "}";
}
setDB();
