$(document).ready(()=>{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
        {

            let notifications = JSON.parse(xmlHttp.responseText);
            let table = document.getElementById("example");
            notifications.forEach((notification,index)=>{

                let row = table.insertRow(index+1);
                let cell1 = row.insertCell(0);
                let cell2 = row.insertCell(1);
                let cell3 = row.insertCell(2);

                // Add some text to the new cells:
                cell1.innerHTML = notification.notificationType;
                cell2.innerHTML = notification.description;
                cell3.innerHTML = notification.date;
            })
        }
    };
    //xmlHttp.open("GET", '/notifications/getNotifications/', true);
    //xmlHttp.send(null);
});