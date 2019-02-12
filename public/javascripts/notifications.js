$(document).ready(()=>{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
        {
            let notifications = JSON.parse(xmlHttp.responseText);
            var table = document.getElementById("notifications-table");
            notifications.forEach((notification)=>{

                var row = table.insertRow(0);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);

                // Add some text to the new cells:
                cell1.innerHTML = notification.type;
                cell2.innerHTML = notification.description;
                cell3.innerHTML = notification.date;
            })
        }
    };
    xmlHttp.open("GET", '/notifications/getNotifications/', true);
    xmlHttp.send(null);
});