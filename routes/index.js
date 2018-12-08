var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('login', {title: 'Express'});
});

router.post('/backend/file/save',function (req,res,next) {
   res.send("okay?");
});

router.post('/backend/file/get',function (req,res,next) {
    res.send({
        "content": {
            "diagram": [
                {
                    "type": "sankey.shape.Start",
                    "id": "7ac2cbf1-4754-6b95-7948-5108dc69ca04",
                    "x": 4075,
                    "y": 4435,
                    "width": 50,
                    "height": 50,
                    "alpha": 1,
                    "angle": 0,
                    "userData": {},
                    "cssClass": "sankey_shape_Start",
                    "bgColor": "#4D90FE",
                    "color": "#000000",
                    "stroke": 1,
                    "radius": 10,
                    "dasharray": null,
                    "labels": [
                        {
                            "type": "draw2d.shape.basic.Label",
                            "id": "593a8988-9f04-8fe1-a38d-07f16bc989c4",
                            "x": 1.5,
                            "y": 11.5,
                            "width": 33,
                            "height": 19,
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
                            "text": "Start",
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
                    "id": "9adfaea8-acf1-de47-dc88-63f3757ffed0",
                    "x": 4219,
                    "y": 4463,
                    "width": 50,
                    "height": 50,
                    "alpha": 1,
                    "angle": 0,
                    "userData": {},
                    "cssClass": "sankey_shape_State",
                    "bgColor": "#4D90FE",
                    "color": "#000000",
                    "stroke": 1,
                    "radius": 0,
                    "dasharray": null,
                    "labels": []
                },
                {
                    "type": "sankey.shape.End",
                    "id": "c2dafd35-f945-f266-29bc-439bdef2ad01",
                    "x": 4336,
                    "y": 4467,
                    "width": 50,
                    "height": 50,
                    "alpha": 1,
                    "angle": 0,
                    "userData": {},
                    "cssClass": "sankey_shape_End",
                    "bgColor": "#F50057",
                    "color": "#000000",
                    "stroke": 1,
                    "radius": 10,
                    "dasharray": null,
                    "labels": [
                        {
                            "type": "draw2d.shape.basic.Label",
                            "id": "6f8ca711-8d79-997a-6561-2bcfd3b0c242",
                            "x": 4.5,
                            "y": 11.5,
                            "width": 30,
                            "height": 19,
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
                            "text": "End",
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
                    "id": "6196f1fc-4dfe-e06f-2347-8481958f9bea",
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
                    "policy": "draw2d.policy.line.LineSelectionFeedbackPolicy",
                    "vertex": [
                        {
                            "x": 4125,
                            "y": 4460
                        },
                        {
                            "x": 4132.833333333333,
                            "y": 4459.999999999999
                        },
                        {
                            "x": 4136.107421875,
                            "y": 4460.009114583333
                        },
                        {
                            "x": 4139.932291666667,
                            "y": 4460.072916666666
                        },
                        {
                            "x": 4144.124348958334,
                            "y": 4460.24609375
                        },
                        {
                            "x": 4148.5,
                            "y": 4460.583333333334
                        },
                        {
                            "x": 4152.875651041666,
                            "y": 4461.139322916666
                        },
                        {
                            "x": 4157.067708333333,
                            "y": 4461.96875
                        },
                        {
                            "x": 4160.892578125,
                            "y": 4463.126302083333
                        },
                        {
                            "x": 4164.166666666666,
                            "y": 4464.666666666666
                        },
                        {
                            "x": 4166.767578124999,
                            "y": 4466.6171875
                        },
                        {
                            "x": 4168.817708333333,
                            "y": 4468.895833333333
                        },
                        {
                            "x": 4170.500651041666,
                            "y": 4471.393229166666
                        },
                        {
                            "x": 4172,
                            "y": 4474
                        },
                        {
                            "x": 4173.499348958333,
                            "y": 4476.606770833334
                        },
                        {
                            "x": 4175.182291666666,
                            "y": 4479.104166666667
                        },
                        {
                            "x": 4177.232421874999,
                            "y": 4481.3828125
                        },
                        {
                            "x": 4179.833333333333,
                            "y": 4483.333333333333
                        },
                        {
                            "x": 4183.107421874999,
                            "y": 4484.873697916666
                        },
                        {
                            "x": 4186.932291666667,
                            "y": 4486.03125
                        },
                        {
                            "x": 4191.124348958333,
                            "y": 4486.860677083334
                        },
                        {
                            "x": 4195.5,
                            "y": 4487.416666666666
                        },
                        {
                            "x": 4199.875651041667,
                            "y": 4487.75390625
                        },
                        {
                            "x": 4204.067708333333,
                            "y": 4487.927083333333
                        },
                        {
                            "x": 4207.892578125,
                            "y": 4487.990885416667
                        },
                        {
                            "x": 4211.166666666667,
                            "y": 4488
                        },
                        {
                            "x": 4219,
                            "y": 4488
                        }
                    ],
                    "router": "draw2d.layout.connection.SplineConnectionRouter",
                    "radius": 3,
                    "source": {
                        "node": "7ac2cbf1-4754-6b95-7948-5108dc69ca04",
                        "port": "output0"
                    },
                    "target": {
                        "node": "9adfaea8-acf1-de47-dc88-63f3757ffed0",
                        "port": "input0",
                        "decoration": "draw2d.decoration.connection.ArrowDecorator"
                    },
                    "labels": [
                        {
                            "type": "draw2d.shape.basic.Label",
                            "id": "5a66f9ad-be97-9dd5-8d07-e4e27b307e9f",
                            "x": 4162,
                            "y": 4460,
                            "width": 16,
                            "height": 21,
                            "alpha": 1,
                            "angle": 0,
                            "userData": {},
                            "cssClass": "draw2d_shape_basic_Label",
                            "ports": [],
                            "bgColor": "#E91E63",
                            "color": "#1B1B1B",
                            "stroke": 1,
                            "radius": 8,
                            "dasharray": null,
                            "text": "-",
                            "outlineStroke": 0,
                            "outlineColor": "none",
                            "fontSize": 12,
                            "fontColor": "#FFFFFF",
                            "fontFamily": null,
                            "locator": "draw2d.layout.locator.ManhattanMidpointLocator"
                        }
                    ]
                },
                {
                    "type": "sankey.shape.Connection",
                    "id": "3c3a58eb-540f-13c1-dbe5-fa09e2452d00",
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
                    "policy": "draw2d.policy.line.LineSelectionFeedbackPolicy",
                    "vertex": [
                        {
                            "x": 4269,
                            "y": 4488
                        },
                        {
                            "x": 4274.583333333333,
                            "y": 4488
                        },
                        {
                            "x": 4276.9169921875,
                            "y": 4488.001302083333
                        },
                        {
                            "x": 4279.643229166667,
                            "y": 4488.010416666667
                        },
                        {
                            "x": 4282.631184895834,
                            "y": 4488.03515625
                        },
                        {
                            "x": 4285.750000000001,
                            "y": 4488.083333333333
                        },
                        {
                            "x": 4288.868815104166,
                            "y": 4488.162760416667
                        },
                        {
                            "x": 4291.856770833333,
                            "y": 4488.28125
                        },
                        {
                            "x": 4294.5830078125,
                            "y": 4488.446614583333
                        },
                        {
                            "x": 4296.916666666666,
                            "y": 4488.666666666667
                        },
                        {
                            "x": 4298.770507812499,
                            "y": 4488.945312499999
                        },
                        {
                            "x": 4300.231770833333,
                            "y": 4489.270833333334
                        },
                        {
                            "x": 4301.431315104166,
                            "y": 4489.627604166667
                        },
                        {
                            "x": 4302.5,
                            "y": 4490
                        },
                        {
                            "x": 4303.568684895833,
                            "y": 4490.372395833333
                        },
                        {
                            "x": 4304.768229166666,
                            "y": 4490.729166666666
                        },
                        {
                            "x": 4306.229492187499,
                            "y": 4491.0546875
                        },
                        {
                            "x": 4308.083333333333,
                            "y": 4491.333333333333
                        },
                        {
                            "x": 4310.416992187499,
                            "y": 4491.553385416666
                        },
                        {
                            "x": 4313.143229166667,
                            "y": 4491.71875
                        },
                        {
                            "x": 4316.131184895833,
                            "y": 4491.837239583333
                        },
                        {
                            "x": 4319.25,
                            "y": 4491.916666666667
                        },
                        {
                            "x": 4322.368815104167,
                            "y": 4491.96484375
                        },
                        {
                            "x": 4325.356770833333,
                            "y": 4491.989583333333
                        },
                        {
                            "x": 4328.0830078125,
                            "y": 4491.998697916666
                        },
                        {
                            "x": 4330.416666666667,
                            "y": 4492
                        },
                        {
                            "x": 4336,
                            "y": 4492
                        }
                    ],
                    "router": "draw2d.layout.connection.SplineConnectionRouter",
                    "radius": 3,
                    "source": {
                        "node": "9adfaea8-acf1-de47-dc88-63f3757ffed0",
                        "port": "output0"
                    },
                    "target": {
                        "node": "c2dafd35-f945-f266-29bc-439bdef2ad01",
                        "port": "input0",
                        "decoration": "draw2d.decoration.connection.ArrowDecorator"
                    },
                    "labels": [
                        {
                            "type": "draw2d.shape.basic.Label",
                            "id": "ada92254-02eb-d526-55c3-5fa19a2d311d",
                            "x": 4293,
                            "y": 4477,
                            "width": 16,
                            "height": 21,
                            "alpha": 1,
                            "angle": 0,
                            "userData": {},
                            "cssClass": "draw2d_shape_basic_Label",
                            "ports": [],
                            "bgColor": "#E91E63",
                            "color": "#1B1B1B",
                            "stroke": 1,
                            "radius": 8,
                            "dasharray": null,
                            "text": "-",
                            "outlineStroke": 0,
                            "outlineColor": "none",
                            "fontSize": 12,
                            "fontColor": "#FFFFFF",
                            "fontFamily": null,
                            "locator": "draw2d.layout.locator.ManhattanMidpointLocator"
                        }
                    ]
                }
            ]
        }
    });


router.post('/backend/sankey/weights',function (req,res,next) {
    res.send([{
        file: req.body.id
    }]);
});

module.exports = router;
