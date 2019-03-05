let notification = require('../notifications/notification');

class activeProcessCancelNotification extends notification{

    constructor(description) {
        super(description,"activeProcessCancel");
    }
    getNotification() {
        return super.getNotification();
    }
}

module.exports = activeProcessCancelNotification;