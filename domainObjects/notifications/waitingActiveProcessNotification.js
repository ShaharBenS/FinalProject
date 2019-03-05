let notification = require('./notification');

class waitingActiveProcessNotification extends notification{

    constructor(description) {
        super(description,"waitingActiveProcess");
    }

    getNotification(){
        return super.getNotification();
    }
}

module.exports = waitingActiveProcessNotification;