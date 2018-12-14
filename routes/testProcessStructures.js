let express = require('express');
let HELPER = require("../controllers/processes/helperFunctions");
let processStructure = require('../controllers/processes/processStructure');
let userControl = require('../controllers/UsersAndRoles');
let router = express.Router();
let activeProcess = require('../controllers/processes/activeProcess');

router.get('/addDemoProcessStructure', function (req, res) {
    //TODO: this is only test, remember to refactoring
    userControl.addNewRole('pimp1','',(err)=>{
        if(err)
        {
            alert(err.toString());
        }
        else
        {
            userControl.addNewRole('pimp2','',(err1)=>{
                if(err1)
                {
                    alert(err1.toString());
                }
                else
                {
                    userControl.addNewRole('pimp3','',(err2)=>{
                        if(err2)
                        {
                            alert(err2.toString());
                        }
                        else
                        {
                            userControl.addNewRole('pimp4','',(err3)=>{
                                if(err3)
                                {
                                    alert(err3.toString());
                                }
                                else
                                {
                                    userControl.addNewUserToRole('omri@post.bgu.ac.il','pimp1',(err4)=>{
                                        if(err4)
                                        {
                                            alert(err4.toString());
                                        }
                                        else
                                        {
                                            userControl.addNewUserToRole("kuti@post.bgu.ac.il","pimp2",(err5)=>{
                                                if(err5)
                                                {
                                                    alert(err5.toString());
                                                }
                                                else
                                                {
                                                    userControl.addNewUserToRole("tomer@post.bgu.ac.il","pimp3",(err6)=> {
                                                        if (err6) {
                                                            alert(err6.toString());
                                                        }
                                                        else
                                                        {
                                                            userControl.addNewUserToRole("shahar@post.bgu.ac.il","pimp4",(err7)=>{
                                                                if(err7)
                                                                {
                                                                    alert(err7.toString());
                                                                }
                                                                else
                                                                {
                                                                    let structure_name = 'structure 1';
                                                                    let initials = [1, 2];
                                                                    HELPER.getRoleID_by_username("omri@post.bgu.ac.il", (err,id1) => {
                                                                        HELPER.getRoleID_by_username("kuti@post.bgu.ac.il", (err1,id2) => {
                                                                            HELPER.getRoleID_by_username("tomer@post.bgu.ac.il", (err2,id3) => {
                                                                                HELPER.getRoleID_by_username("shahar@post.bgu.ac.il", (err3,id4) => {

                                                                                    let stages = [
                                                                                        {
                                                                                            roleID: id1,
                                                                                            stageNum: 1,
                                                                                            nextStages: [2],
                                                                                            stagesToWaitFor: [],
                                                                                            online_forms: [],
                                                                                            attached_files_names: []
                                                                                        },
                                                                                        {
                                                                                            roleID: id2,
                                                                                            stageNum: 2,
                                                                                            nextStages: [3],
                                                                                            stagesToWaitFor: [1],
                                                                                            online_forms: [],
                                                                                            attached_files_names: []
                                                                                        },
                                                                                        {
                                                                                            roleID: id3,
                                                                                            stageNum: 3,
                                                                                            nextStages: [4],
                                                                                            stagesToWaitFor: [2],
                                                                                            online_forms: [],
                                                                                            attached_files_names: []
                                                                                        },
                                                                                        {
                                                                                            roleID: id4,
                                                                                            stageNum: 4,
                                                                                            nextStages: [],
                                                                                            stagesToWaitFor: [3],
                                                                                            online_forms: [],
                                                                                            attached_files_names: []
                                                                                        }
                                                                                    ];


                                                                                    processStructure.addProcessStructure(structure_name, initials, stages, (err) => {
                                                                                        if (err)
                                                                                            res.send("fail");
                                                                                        else res.send("success");
                                                                                    });
                                                                                })
                                                                            })
                                                                        })
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
                    });
                }
            });
        }
    });
});
/*
let structure_name = "structure 1";
let process_name = "active process 1";
let username = "omri@post.bgu.ac.il";
*/

router.get('/activatePage', function (req, res) {
    res.render('ActivateProcess', {title: 'Express'});
});
module.exports = router;