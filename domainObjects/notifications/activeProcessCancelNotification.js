let notification = require('../notifications/notification');

class activeProcessCancelNotification extends notification{

    constructor(description) {
        super(description,"activeProcessCancel");
    }
}

module.exports = activeProcessCancelNotification;