let notification = require('./notification');

class waitingProcessStructureApproved extends notification{

    constructor(description) {
        super(description,"מבנה תהליך אושר");
    }

    getNotification(){
        return super.getNotification();
    }
}

module.exports = waitingProcessStructureApproved;