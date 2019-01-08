let add_label = function () {};

let roleToEmails = {};     // roleName to usersEmail

var xmlHttp = new XMLHttpRequest();
xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
    {
        roleToEmails = JSON.parse(xmlHttp.responseText)
    }
};
xmlHttp.open("GET", '/usersAndRoles/getRoleToEmails/', true);
xmlHttp.send(null);


//TODO : add button that centers the document 'centerDocument'
//try to use the getJSON function
function onDrop_extension(type, command, figure) {
    let role_name = prompt("Enter Role Name Here");
    if(role_name != null){
        if(roleToEmails[role_name] === undefined){
            roleToEmails[role_name] = [];
            figure.label = figure.label = new draw2d.shape.basic.Label({
                text: role_name,
                angle: 270,
                fontColor: "#FFFFFF",
                fontSize: 18,
                stroke: 0,
                editor: new draw2d.ui.LabelInplaceEditor({
                    onCommit: function () {
                        figure.setHeight(Math.max(figure.getHeight(), figure.label.getWidth()));
                    }
                })
            });
            figure.add(figure.label, new draw2d.layout.locator.CenterLocator());
            app.view.getCommandStack().execute(command);
            figure.setHeight(Math.max(figure.getHeight(), figure.label.getWidth()));
        }
        else{
            alert('A role with that name already exists');
        }
    }
}


function rolesToHTML(roleName)
{
    let users_div = document.getElementById("users-div");
    users_div.innerHTML = '';

    roleToEmails[roleName].forEach((userEmail) =>
    {
        let div = document.createElement("div");
        let button = document.createElement("button");
        button.class = "btn";
        button.innerText = '-';
        button.onclick = ()=>{
            let index = roleToEmails[roleName].indexOf(userEmail);
            if(index > -1){
                roleToEmails[roleName].splice(index,1);
            }
            rolesToHTML(roleName);
        };

        let label = document.createElement("label");
        label.innerText = userEmail;
        div.appendChild(button);
        div.appendChild(label);
        users_div.append(div);
    });
    let div = document.createElement("div");
    let button = document.createElement("button");
    button.class = "btn";
    button.innerText = '+';
    button.onclick = () =>
    {
        let email = prompt("Enter user email :");
        if (email != null) {
            let found = false;
            Object.keys(roleToEmails).forEach(roleName=>{
                roleToEmails[roleName].forEach(userEmail=>{
                    if(email === userEmail){
                        found = true;
                        alert('email already in use, in role: '+roleName)
                    }
                })
            });
            if(!found){
                roleToEmails[roleName].push(email);
                rolesToHTML(roleName);
            }
        }
    };
    div.appendChild(button);
    users_div.append(div);
}


function confirm() {
    app.fileSave()
}