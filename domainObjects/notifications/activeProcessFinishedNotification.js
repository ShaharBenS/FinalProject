let notification = require('../notifications/notification');

class activeProcessFinishedNotification extends notification{

    constructor(description) {
        super(description,"תהליך נגמר בהצלחה");
    }
    getNotification() {
        return super.getNotification();
    }
}

module.exports = activeProcessFinishedNotification;