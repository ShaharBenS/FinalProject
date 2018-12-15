let select_role_clicked = function() {};
let add_label = function () {};

//TODO : add button that centers the document 'centerDocument'
//try to use the getJSON function
function onDrop_extension(type,command,figure){
    if(diagramContext === 'add_process_structure')
    {
        select_role_clicked = function () {
            let selector = document.getElementById("role_selector");
            figure.role_id = selector.options[selector.selectedIndex].value;
            console.log(JSON.stringify(Object.keys(figure)));
            add_label(figure,selector.options[selector.selectedIndex].innerText);
            app.view.getCommandStack().execute(command);
            $("#select_role_modal").modal("hide");
        };

        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            {
                let selector = document.getElementById("role_selector");

                JSON.parse(xmlHttp.responseText).forEach((role)=>{
                    let option = document.createElement('option');
                    option.value = role._id;
                    option.innerText = role.roleName;
                    selector.appendChild(option);
                });

                $("#select_role_modal").modal("show");
            }
        };
        xmlHttp.open("GET", '/UsersAndRoles/getAllRoles/', true);
        xmlHttp.send(null);



    }
}


function confirm() {
    if(diagramContext === 'add_process_structure'){
        app.fileSave()
    }
}

function getMethods(obj)
{
    var res = [];
    for(var m in obj) {
        if(typeof obj[m] == "function") {
            res.push(m)
        }
    }
    return res;
}

