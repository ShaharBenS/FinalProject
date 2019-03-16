let notification = require('../notifications/notification');

class activeProcessCancelNotification extends notification{

    constructor(description) {
        super(description,"תהליך בוטל");
    }
    getNotification() {
        return super.getNotification();
    }
}

module.exports = activeProcessCancelNotification;