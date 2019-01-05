let select_role_clicked = function() {};
let add_label = function () {};
let is_role_list_set = false;

//TODO : add button that centers the document 'centerDocument'
//try to use the getJSON function
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
            $("#select_role_modal").modal("hide");
        };

        if(is_role_list_set){
            $("#select_role_modal").modal("show");
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
                    $("#select_role_modal").modal("show");
                }
            };
            xmlHttp.open("GET", '/usersAndRoles/getAllRoles/', true);
            xmlHttp.send(null);
        }
    }
}


function confirm() {
    if(diagramContext === 'addProcessStructure' || diagramContext === 'editProcessStructure'){
        app.fileSave()
    }
}