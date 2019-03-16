let notification = require('./notification');

class waitingActiveProcessNotification extends notification{

    constructor(description) {
        super(description,"תהליך בהמתנה");
    }

    getNotification(){
        return super.getNotification();
    }
}

module.exports = waitingActiveProcessNotification;