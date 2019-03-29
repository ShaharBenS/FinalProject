class processReportStage {
    constructor(stageObject) {
        this.role = stageObject.role;
        this.user = stageObject.user;
        this.stageNum = stageObject.stageNum;
        this.approvalTime = stageObject.approvalTime;
        this.comments = stageObject.comments;
        this.action = stageObject.action;
        this.filledOnlineForms = stageObject.filledOnlineForms;
        this.attachedFilesNames = stageObject.attachedFilesNames;
    }
}
module.exports = processReportStage;
