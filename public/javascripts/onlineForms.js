window.onload = function () {
    let formName = '<%=formName%>';
    document.title = formName;
    document.getElementById("formTitle").appendChild(document.createTextNode(formName));
    let isForShow = '<%=isForShow%>';
    if (isForShow) {
        let info = "טופס דמו של " + formName;
        document.getElementById("info").appendChild(document.createTextNode(info));
        document.getElementById("fieldset").setAttribute("disabled", "disabled");
        document.getElementById("submitButton").setAttribute("disabled", "disabled");
    }
};