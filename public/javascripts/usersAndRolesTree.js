let add_label = function () {};

//TODO : add button that centers the document 'centerDocument'
//try to use the getJSON function
function onDrop_extension(type, command, figure) {
    let role_name = prompt("Enter Role Name Here");
    if(role_name != null){
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
}


function confirm() {
    app.fileSave()
}