let notification = require('./notification');

class waitingActiveProcessReminderNotification extends notification{

    constructor(description) {
        super(description,"תזכורת להתליך בהמתנה");
    }

    getNotification(){
        return super.getNotification();
    }
}

module.exports = waitingActiveProcessReminderNotification;