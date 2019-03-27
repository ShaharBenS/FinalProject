let notification = require('./notification');

class waitingProcessStructureDisapproved extends notification{

    constructor(description) {
        super(description,"מבנה תהליך לא אושר");
    }

    getNotification(){
        return super.getNotification();
    }
}

module.exports = waitingProcessStructureDisapproved;