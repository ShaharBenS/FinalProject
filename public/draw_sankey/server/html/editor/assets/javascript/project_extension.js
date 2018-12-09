let select_role_clicked = function() {};
let add_label = function () {};

//TODO : add button that centers the document 'centerDocument'
//try to use the getJSON function
function onDrop_extension(type,command,figure){
    if(diagramContext === 'add_process_structure')
    {
        select_role_clicked = function () {
            add_label(figure,"RoleNameHere");
            app.view.getCommandStack().execute(command);
            $("#select_role_modal").modal("hide");
        };

        $("#select_role_modal").modal("show");

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

