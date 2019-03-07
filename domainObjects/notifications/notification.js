class notification {

    constructor(description,type) {
        this.description = description;
        this.date = new Date();
        this.notificationType = type;
    }

    getNotification(){
        return {
            notificationType: this.notificationType,
            description: this.description,
            date: this.date,
        }
    }
}

module.exports = notification;