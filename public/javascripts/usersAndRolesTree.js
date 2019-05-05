let add_label = function () {
};

let roleToEmails = {};     // roleName to usersEmail
let idToRole = {};
let emailToFullName = {};
let roleToDereg = {};

var xmlHttp = new XMLHttpRequest();
xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
        roleToEmails = JSON.parse(xmlHttp.responseText)
    }
};
xmlHttp.open("GET", '/usersAndRoles/getRoleToEmails/', true);
xmlHttp.send(null);

var xmlHttp1 = new XMLHttpRequest();
xmlHttp1.onreadystatechange = function () {
    if (xmlHttp1.readyState === 4 && xmlHttp1.status === 200) {
        emailToFullName = JSON.parse(xmlHttp1.responseText)
    }
};
xmlHttp1.open("GET", '/usersAndRoles/getEmailToFullName/', true);
xmlHttp1.send(null);

var xmlHttp2 = new XMLHttpRequest();
xmlHttp2.onreadystatechange = function () {
    if (xmlHttp2.readyState === 4 && xmlHttp2.status === 200) {
        roleToDereg = JSON.parse(xmlHttp2.responseText)
    }
};
xmlHttp2.open("GET", '/usersAndRoles/getRoleToDereg/', true);
xmlHttp2.send(null);


$(document).ready(() => {
    var modal = document.getElementById('select_users_modal');
    var modal2 = document.getElementById('select-dereg-modal');
    var modal3 = document.getElementById('getHelpUsersAndRoles');
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
        if (event.target === modal2) {
            modal2.style.display = "none";
        }
        if (event.target === modal3) {
            modal3.style.display = "none";
        }
    };

    var xmlHttp2 = new XMLHttpRequest();
    xmlHttp2.onreadystatechange = function () {
        if (xmlHttp2.readyState === 4 && xmlHttp2.status === 200) {
            idToRole = JSON.parse(xmlHttp2.responseText);
        }
    };
    xmlHttp2.open("GET", '/usersAndRoles/getIdToRole/', true);
    xmlHttp2.send(null);
});

function getHelp() {
    document.getElementById("getHelpUsersAndRoles").style.display = "block";
}

function onDrop_extension(type, command, figure) {
    alertify.prompt("הכנס את שם התפקיד", "", (evt, role_name) => {
        if (role_name != null) {
            if (roleToEmails[role_name] === undefined) {
                if (role_name === "") {
                    alertify.alert('שם תפקיד לא יכול להיות ריק');
                }
                else {
                    roleToDereg[role_name] = "1";
                    idToRole[figure.id] = role_name;
                    roleToEmails[role_name] = [];
                    figure.label = figure.label = new draw2d.shape.basic.Label({
                        text: role_name,
                        angle: 0,
                        fontColor: "#FFFFFF",
                        fontSize: 18,
                        stroke: 0,
                        editor: new draw2d.ui.LabelInplaceEditor({
                            onCommit: function () {
                                figure.setWidth(Math.max(figure.getWidth(), figure.label.getWidth()));
                            }
                        })
                    });
                    figure.add(figure.label, new draw2d.layout.locator.CenterLocator());
                    figure.setBackgroundColor("f6a500");
                    app.view.getCommandStack().execute(command);
                    figure.setWidth(Math.max(figure.getWidth(), figure.label.getWidth()));
                    figure.setHeight(figure.height + 30);
                }
            }
            else {
                alertify.alert('שם תפקיד זה כבר קיים');
            }
        }
    });
}

let currentRoleNameClicked = '';

function changeDeregClicked() {
    let selector = document.getElementById('dereg-select');
    roleToDereg[currentRoleNameClicked] = selector.options[selector.selectedIndex].value;
    document.getElementById('select-dereg-modal').style.display = 'none';
}

function rolesToHTML(roleName) {
    let users_div = document.getElementById("users-div");
    users_div.innerHTML = '';
    roleToEmails[roleName].forEach((userEmail) => {
        let outerDiv = document.createElement("div");
        outerDiv.style.display = "flex";
        outerDiv.style.flexDirection = "row";
        outerDiv.style.alignItems = "center";
        outerDiv.style.justifyContent = "space-between";

        let div = document.createElement("div");
        div.style.display = "flex";
        div.style.flexDirection = "row";
        div.style.alignItems = "center";

        let a = document.createElement("a");
        a.innerHTML = '<i class="ion ion-android-remove-circle" style="color:var(--main-color) ;font-size: 30px"></i>';
        a.style.marginRight = "10px";
        a.onclick = () => {
            let index = roleToEmails[roleName].indexOf(userEmail);
            if (index > -1) {
                roleToEmails[roleName].splice(index, 1);
                delete emailToFullName[userEmail];
            }
            rolesToHTML(roleName);
        };

        let input = document.createElement("input");
        input.className += " email";
        input.value = userEmail;
        div.appendChild(a);
        div.appendChild(input);

        outerDiv.append(div);

        input = document.createElement("input");
        input.className += " name";
        input.dir = "rtl";
        input.value = emailToFullName[userEmail];
        outerDiv.append(input);

        users_div.append(outerDiv);
    });
    let div = document.createElement("div");
    div.style.display = "flex";
    div.style.flexDirection = "row";
    div.style.alignItems = "center";
    div.style.justifyContent = "center";
    let a = document.createElement("a");
    a.innerHTML = '<i class="ion ion-android-add-circle" style="color:var(--main-color);font-size: 30px"></i>';
    a.onclick = () => {
        alertify.prompt("הכנס אימייל:", "", (evt, email) => {
            if (email != null) {
                if (!emailValidator(email)) {
                    alertify.alert("כתובת מייל לא תקינה");
                    return;
                }
                let found = false;
                Object.keys(roleToEmails).forEach(roleName => {
                    roleToEmails[roleName].forEach(userEmail => {
                        if (email === userEmail) {
                            found = true;
                            alertify.alert('המייל כבר בשימוש, בתפקיד: ' + roleName)
                        }
                    })
                });
                if (!found) {
                    setTimeout(() => {
                        alertify.prompt("הכנס שם מלא:", "", (evt, fullName) => {
                            updateUsersMaps(roleName);
                            emailToFullName[email] = fullName;
                            roleToEmails[roleName].push(email);
                            rolesToHTML(roleName);
                        });
                    }, 400);
                }
            }
        });
    };
    users_div.appendChild(document.createElement("br"));
    div.appendChild(a);
    users_div.append(div);
}

function updateUsersMaps(roleName) {
    let emails = document.getElementsByClassName("email");
    let names = document.getElementsByClassName("name");
    let emailsArray = [];
    for (let i = 0; i < emails.length; i++) {
        if (!emailValidator(emails[i].value)) {
            return emails[i].value;
        }
        emailsArray.push(emails[i].value);
    }
    for (let i = 0; i < emailsArray.length; i++) {
        emailToFullName[emailsArray[i]] = names[i].value;
    }
    roleToEmails[roleName] = emailsArray;
    return undefined;
}

function updateUsername() {
    let result = updateUsersMaps(currentRoleNameClicked);
    if (result === undefined) {
        document.getElementById('select_users_modal').style.display = 'none';
    }
    else {
        alertify.alert("הכתובת " + result + " אינה תקינה.");
    }
}

function deleteRoleById(id) {
    let emails = roleToEmails[idToRole[id]];
    emails.forEach(email => {
        delete emailToFullName[email];
    });
    delete roleToEmails[idToRole[id]];
    delete roleToDereg[idToRole[id]];
    delete idToRole[id];
}

function emailValidator(email) {
    let regularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regularExpression.test(String(email).toLowerCase());
}

function loadDefaultTree() {
    $.ajax({
            url: '/usersAndRoles/loadDefaultTree/',
            method: "POST",
            xhrFields: {
                withCredentials: true
            },
            data: {},
        }
    ).done(function (responseText, status) {
        if (status === "success") {
            if (responseText === "success") {
                alertify.alert("העץ נשמר בהצלחה!", () => {
                    window.location.href = '/usersAndRoles/editTree/';
                });
            } else {
                alertify.alert(responseText);
            }
        }
    });
}

function confirm() {
    app.fileSave()
}