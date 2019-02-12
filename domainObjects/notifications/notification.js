class notification {

    constructor(description,type) {
        this.description = description;
        this.date = new Date();
        this.type = type;
    }

}

module.exports = notification;