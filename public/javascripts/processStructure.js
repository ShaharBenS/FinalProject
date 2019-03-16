let select_role_clicked = function () {
};
let add_label = function () {
};
let is_role_list_set = false;

let formsOfStage = {};
let onlineForms = {};

let xmlHttpFormsOfStages = new XMLHttpRequest();
let params = "?processStructureName=" + processStructureName;
xmlHttpFormsOfStages.onreadystatechange = function () {
    if (xmlHttpFormsOfStages.readyState === 4 && xmlHttpFormsOfStages.status === 200) {
        formsOfStage = JSON.parse(xmlHttpFormsOfStages.responseText)
    }
};
xmlHttpFormsOfStages.open("GET", '/processStructures/getFormsToStages/' + params, true);
xmlHttpFormsOfStages.send(null);

let xmlHttpOnlineForms = new XMLHttpRequest();
xmlHttpOnlineForms.onreadystatechange = function () {
    if (xmlHttpOnlineForms.readyState === 4 && xmlHttpOnlineForms.status === 200) {
        onlineForms = JSON.parse(xmlHttpOnlineForms.responseText);
    }
};
xmlHttpOnlineForms.open("GET", '/onlineForms/getAllOnlineForms/', true);
xmlHttpOnlineForms.send(null);

$(document).ready(function () {
    var modal = document.getElementById('select_role_modal');
    var span = document.getElementsByClassName("close")[0];

    span.onclick = function () {
        modal.style.display = "none";
    };

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };

    var modal1 = document.getElementById('see_forms_modal');
    var span1 = document.getElementsByClassName("close")[0];

    span1.onclick = function () {
        modal1.style.display = "none";
    };

    window.onclick = function (event) {

        if (event.target === modal1) {
            modal1.style.display = "none";
        }
    };
    if(diagramContext === "viewProcessStructure"){
        let button = document.getElementById("saveButton");
        button.parentNode.removeChild(button);
    }
});

function onDrop_extension(type, command, figure) {
    if (diagramContext === 'addProcessStructure' || diagramContext === 'editProcessStructure') {
        select_role_clicked = function () {
            let selector = document.getElementById("role_selector");
            figure.label = figure.label = new draw2d.shape.basic.Label({
                text: selector.options[selector.selectedIndex].innerText,
                angle: 0,
                fontColor: "#FFFFFF",
                fontSize: 18,
                stroke: 0,
                /*editor: new draw2d.ui.LabelInplaceEditor({onCommit:function(){
                        figure.setHeight(Math.max(figure.getHeight(),figure.label.getWidth()));
                    }})*/
            });
            figure.add(figure.label, new draw2d.layout.locator.CenterLocator());
            app.view.getCommandStack().execute(command);
            figure.setWidth(Math.max(figure.label.getWidth(), figure.getWidth()));
            figure.setHeight(figure.height + 30);
            document.getElementById("select_role_modal").style.display = "none";
        };

        if (is_role_list_set) {
            document.getElementById("select_role_modal").style.display = "block";
        } else {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                    let selector = document.getElementById("role_selector");

                    JSON.parse(xmlHttp.responseText).forEach((role) => {
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


function deleteRoleById(id) {

}

function confirm() {
    if (diagramContext === 'addProcessStructure' || diagramContext === 'editProcessStructure') {
        app.fileSave()
    }
}

function seeFormsOpened(roleName) {
    let formsDiv = document.getElementById("forms-div");
    formsDiv.innerHTML = '';
    if (formsOfStage[roleName] !== undefined) {
        formsOfStage[roleName].forEach((formName) => {
            let div = document.createElement("div");
            div.style.marginTop = "5px";
            let button = document.createElement("button");
            button.class = "btn";
            button.innerText = '-';
            button.onclick = () => {
                let index = formsOfStage[roleName].indexOf(formName);
                if (index > -1) {
                    formsOfStage[roleName].splice(index, 1);
                }
                seeFormsOpened(roleName);
            };

            let a = document.createElement("a");
            a.style.color = "#00BB00";
            a.style.marginLeft = "10px";
            a.innerText = formName;
            a.title = formName;
            a.href = "";

            a.onclick = function () {
                window.open("/onlineForms/display?formName=" + formName);
                return false;
            };

            div.appendChild(button);
            div.appendChild(a);
            formsDiv.append(div);


        });
    } else formsOfStage[roleName] = [];
    let div = document.createElement("div");
    div.setAttribute("style", "display:flex; flex-direction: row; margin-top: 5px");
    let select = document.createElement("select");
    select.setAttribute("id", "selectForm");
    select.style.marginLeft = "10px";

    Object.keys(onlineForms).forEach((formName) => {
        let optionElement = document.createElement('option');
        optionElement.appendChild(document.createTextNode(formName));
        select.appendChild(optionElement);
    });

    let button = document.createElement("button");
    button.class = "btn";
    button.innerText = '+';
    button.onclick = () => {
        let selectValue = select.options[select.selectedIndex].innerText;
        let found = false;
        formsOfStage[roleName].forEach(formName => {
            if (formName === selectValue) {
                found = true;
                alert('טופס כבר קיים בשלב זה');
            }
        });
        if (!found) {
            formsOfStage[roleName].push(selectValue);
            seeFormsOpened(roleName);
        }
    };
    div.appendChild(button);
    div.appendChild(select);
    formsDiv.append(div);
}