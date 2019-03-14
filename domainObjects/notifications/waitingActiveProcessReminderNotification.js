let notification = require('./notification');

class waitingActiveProcessReminderNotification extends notification{

    constructor(description) {
        super(description,"waitingActiveProcessReminderNotification");
    }

    getNotification(){
        return super.getNotification();
    }
}

module.exports = waitingActiveProcessReminderNotification;