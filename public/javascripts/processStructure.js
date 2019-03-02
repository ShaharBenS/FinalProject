let select_role_clicked = function() {};
let add_label = function () {};
let is_role_list_set = false;

//TODO : add button that centers the document 'centerDocument'
//try to use the getJSON function

$( document ).ready(function() {
    var modal = document.getElementById('select_role_modal');
    var span = document.getElementsByClassName("close")[0];

    span.onclick = function() {
        modal.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };

    var modal1 = document.getElementById('see_forms_modal');
    var span1 = document.getElementsByClassName("close")[0];

    span1.onclick = function() {
        modal1.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target === modal1) {
            modal1.style.display = "none";
        }
    };
});

function onDrop_extension(type,command,figure){
    if(diagramContext === 'addProcessStructure' || diagramContext === 'editProcessStructure')
    {
        select_role_clicked = function () {
            let selector = document.getElementById("role_selector");
            figure.label = figure.label = new draw2d.shape.basic.Label({
                text: selector.options[selector.selectedIndex].innerText,
                angle:270,
                fontColor:"#FFFFFF",
                fontSize:18,
                stroke:0,
                editor: new draw2d.ui.LabelInplaceEditor({onCommit:function(){
                        figure.setHeight(Math.max(figure.getHeight(),figure.label.getWidth()));
                    }})
            });
            figure.add( figure.label, new draw2d.layout.locator.CenterLocator());
            app.view.getCommandStack().execute(command);
            figure.setHeight(Math.max(figure.getHeight(),figure.label.getWidth()));
            document.getElementById("select_role_modal").style.display = "none";
        };

        if(is_role_list_set){
            document.getElementById("select_role_modal").style.display = "block";
        }
        else{
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.onreadystatechange = function() {
                if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
                {
                    let selector = document.getElementById("role_selector");

                    JSON.parse(xmlHttp.responseText).forEach((role)=>{
                        let option = document.createElement('option');
                        option.value = role._id;
                        option.innerText = role.roleName;
                        selector.appendChild(option);
                    });
                    is_role_list_set = true;
                    document.getElementById("select_role_modal").style.display = "block";
                }
            };
            xmlHttp.open("GET", '/usersAndRoles/getAllRoles/', true);
            xmlHttp.send(null);
        }
    }
}


function deleteRoleById(id)
{

}

function confirm() {
    if(diagramContext === 'addProcessStructure' || diagramContext === 'editProcessStructure'){
        app.fileSave()
    }
}


function seeFormsOpened(){
    //TODO: omri
    // you can add things to:
    let formsDiv = document.getElementById("forms-div");
    // append to children, see: usersAndRolesTree.js line 6
    formsDiv.innerHTML = '';

    roleToEmails[roleName].forEach((userEmail) => {
        let div = document.createElement("div");
        let button = document.createElement("button");
        button.class = "btn";
        button.innerText = '-';
        button.onclick = () => {
            let index = roleToEmails[roleName].indexOf(userEmail);
            if (index > -1) {
                roleToEmails[roleName].splice(index, 1);
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
    button.onclick = () => {
        let email = prompt("Enter user email :");
        if (email != null) {
            let found = false;
            Object.keys(roleToEmails).forEach(roleName => {
                roleToEmails[roleName].forEach(userEmail => {
                    if (email === userEmail) {
                        found = true;
                        alert('email already in use, in role: ' + roleName)
                    }
                })
            });
            if (!found) {
                roleToEmails[roleName].push(email);
                rolesToHTML(roleName);
            }
        }
    };
    div.appendChild(button);
    users_div.append(div);
}