let notification = require('../notifications/notification');

class activeProcessBackToCreatorNotification extends notification{

    constructor(description) {
        super(description,"תהליך חזר ליוצר");
    }
    getNotification() {
        return super.getNotification();
    }
}

module.exports = activeProcessBackToCreatorNotification;