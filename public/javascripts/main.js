$(document).ready(function () {
    setTopBar();

    var modal = document.getElementById('add-process-structure-modal');
    var span = document.getElementById("close-add");

    span.onclick = function () {
        modal.style.display = "none";
    };

    var modal1 = document.getElementById('edit-process-structure-modal');
    var span1 = document.getElementById("close-edit");

    span1.onclick = function () {
        modal1.style.display = "none";
    };

    let modal_start_process = document.getElementById('start-active-process-modal');
    let span_close_start_process = document.getElementById('close-start');

    span_close_start_process.onclick = function () {
        modal_start_process.style.display = "none";
    };

    window.onclick = function (event) {
        if (event.target === modal1) {
            modal1.style.display = "none";
        }
        if (event.target === modal) {
            modal.style.display = "none";
        }

        if (event.target === modal_start_process) {
            modal_start_process.style.display = "none";
        }
    };
    document.getElementById('new-process-structure-button').onclick = confirmAddProcessStructureClicked;
});

function confirmAddProcessStructureClicked() {
    let name = document.getElementById("new-process-structure-name").value;
    if (name === "") {
        alertify.alert("שם לא יכול להיות ריק");
        return;
    }
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
            if (name === "") {
                alertify.alert("שם לא יכול להיות ריק");
                return;
            }
            let isProcessExists = false;
            JSON.parse(xmlHttp.responseText).every((structureName) => {
                if (structureName === name) {
                    isProcessExists = true;
                    return false;
                }
                return true;
            });

            if (!isProcessExists) {
                window.location.href = '/processStructures/addProcessStructure/?name=' + name;
            }
            else
            {
                alertify.alert("תהליך בעל שם זה כבר קיים");
            }
        }
    };
    xmlHttp.open("GET", '/processStructures/getAllProcessStructuresTakenNames/', true);
    xmlHttp.send(null);
}

function addProcessStructureClicked() {

    document.getElementById("add-process-structure-modal").style.display = "block";
}

function editProcessStructureClicked() {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
            if(JSON.parse(xmlHttp.responseText).length < 1)
            {
                alertify.alert('לא קיימים מבני תהליכים במערכת');
                return;
            }
            let selector = document.getElementById("processes_selector");

            selector.innerHTML = "";

            JSON.parse(xmlHttp.responseText).forEach((structure) => {
                let option = document.createElement('option');
                option.value = structure._id;
                option.innerText = structure.structureName;
                selector.appendChild(option);
            });
            document.getElementById("edit-process-structure-modal").style.display = "block";
        }
    };
    xmlHttp.open("GET", '/processStructures/getAllProcessStructures/', true);
    xmlHttp.send(null);

}

function confirmEditProcessStructureClicked() {
    let selector = document.getElementById("processes_selector");
    window.location.href = '/processStructures/editProcessStructure/?name=' + selector.options[selector.selectedIndex].innerText;
}


function editUsersAndRolesTree() {
    window.location.href = '/usersAndRoles/editTree/'
}

function waitingStructuresClicked() {
    window.location.href = '/processStructures/waitingForApproval/'
}

function updateOnlineForms() {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
            if (xmlHttp.responseText === "success") {
                alertify.alert("טפסים נוצרו בהצלחה", () => {
                    window.location.href = '/Home'
                });
            } else
                alertify.alert(xmlHttp.responseText);
        }
    };
    xmlHttp.open("POST", '/onlineForms/createAllOnlineForms/', true);
    xmlHttp.send(null);
}

function startActiveProcess() {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
            if(JSON.parse(xmlHttp.responseText).length < 1 || !Array.isArray(JSON.parse(xmlHttp.responseText)))
            {
                alertify.alert('לא קיימים מבני תהליכים במערכת להתחיל');
                return;
            }
            let selector = document.getElementById("start-processes-selector");

            selector.innerHTML = "";
            JSON.parse(xmlHttp.responseText).forEach((structure) => {
                let option = document.createElement('option');
                option.value = structure._id;
                option.innerText = structure.structureName;
                selector.appendChild(option);
            });
            let urgencySelector = document.getElementById("start-processes-urgency");
            while (urgencySelector.firstChild) {
                urgencySelector.removeChild(urgencySelector.firstChild);
            }
            document.getElementById("start-active-process-modal").style.display = "block";
            let option1 = document.createElement('option');
            option1.value = 1;
            option1.innerText = '1 - דחיפות גבוהה';
            urgencySelector.appendChild(option1);
            let option2 = document.createElement('option');
            option2.value = 2;
            option2.innerText = '2 - דחיפות בינונית';
            urgencySelector.appendChild(option2);
            let option3 = document.createElement('option');
            option3.value = 3;
            option3.innerText = '3 - דחיפות נמוכה';
            urgencySelector.appendChild(option3);
        }
    };
    xmlHttp.open("GET", '/processStructures/getAllProcessStructuresForUser/', true);
    xmlHttp.send(null);

}

function confirmStartProcess() {
    let selector = document.getElementById("start-processes-selector");
    let structureName = selector.options[selector.selectedIndex].innerText;
    let processName = document.getElementById("start-processes-name").value;
    let processDate = document.getElementById("start-processes-date").value;
    let urgency = document.getElementById("start-processes-urgency").value;
    let data = {
        processName: processName,
        structureName: structureName,
        processDate: processDate,
        processUrgency: urgency
    };
    if (processName === "") {
        alertify.alert("שם לא יכול להיות ריק");
        return;
    }
    if (processDate === "") {
        alertify.alert("תאריך לא יכול להיות ריק");
        return;
    }
    let today = new Date();
    if (today.getTime() >= new Date(processDate).getTime()) {
        alertify.alert("התאריך חייב להיות מאוחר יותר מהיום");
        return;
    }
    $.ajax({
            url: '/activeProcesses/startProcess/',
            method: "POST",
            xhrFields: {
                withCredentials: true
            },
            data: data,
        }
    ).done(function (responseText, status) {
        if (status === "success") {
            if (responseText === "success") {
                alertify.alert("תהליך נוצר בהצלחה", () => {
                    window.location.href = '/Home';
                });
            } else {
                alertify.alert(responseText);
            }
        }
        else
        {
            alertify.alert("קרתה שגיאה בעת התחלת התהליך", () => {
                window.location.href = '/Home';
            });
        }
    });
}

