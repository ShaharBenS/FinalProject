class processReport {
    constructor(reportObject,stages) {
        this.processName = reportObject.processName;
        this.status = reportObject.status;
        this.processDate = reportObject.processDate;
        this.processUrgency = reportObject.processUrgency;
        this.currentStages = reportObject.currentStages;
        this.initials = reportObject.initials;
        this.stages = stages;
    }
}
module.exports = processReport;
