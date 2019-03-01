$(document).ready(function () {
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
        alert("שם לא יכול להיות ריק");
        return;
    }
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
            if (name === "") {
                alert("שם לא יכול להיות ריק");
                return;
            }
            let isProcessExists = false;
            JSON.parse(xmlHttp.responseText).forEach((structure) => {
                if (structure.structureName === name) {
                    isProcessExists = true;
                    alert("תהליך בעל שם זה כבר קיים");
                }
            });

            if (!isProcessExists) {
                window.location.href = '/processStructures/addProcessStructure/?name=' + name;
            }
        }
    };
    xmlHttp.open("GET", '/processStructures/getAllProcessStructures/', true);
    xmlHttp.send(null);
}

function addProcessStructureClicked() {

    document.getElementById("add-process-structure-modal").style.display = "block";
}

function editProcessStructureClicked() {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
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

function startActiveProcess() {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
            let selector = document.getElementById("start-processes-selector");

            selector.innerHTML = "";

            JSON.parse(xmlHttp.responseText).forEach((structure) => {
                let option = document.createElement('option');
                option.value = structure._id;
                option.innerText = structure.structureName;
                selector.appendChild(option);
            });
            document.getElementById("start-active-process-modal").style.display = "block";
        }
    };
    xmlHttp.open("GET", '/processStructures/getAllProcessStructures/', true);
    xmlHttp.send(null);

}

function confirmStartProcess() {
    let selector = document.getElementById("start-processes-selector");
    let structureName = selector.options[selector.selectedIndex].innerText;
    let processName = document.getElementById("start-processes-name").value;
    let data = {processName: processName, structureName: structureName};
    if (processName === "") {
        alert("שם לא יכול להיות ריק");
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
                alert("תהליך נוצר בהצלחה");
                window.location.href = '/userLoggedIn';
            } else {
                alert(responseText);
            }
        }
    });
}
