let notification = require('../notifications/notification');

class waitingActiveProcessNotification extends notification{

    constructor(description) {
        super(description,"waitingActiveProcess");
    }
}

module.exports = waitingActiveProcessNotification;