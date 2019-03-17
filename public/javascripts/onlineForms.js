let submitForm = function () {
    let oldWin = window.opener;
    let inputs = Array.prototype.slice.call(document.getElementsByTagName('input'));
    let i = 0;

    let info = [];
    inputs.forEach((input) => {
        if (i !== inputs.length - 1) {
            if (input.type === 'checkbox' || input.type === 'radio') {
                if (input.checked)
                    info.push({field: input.name, value: input.value});
            } else info.push({field: input.name, value: input.value});
        }
        i++;
    });

    //receiveFormInfo is a function on the opener window that receive the form's data
    oldWin.receiveFormInfo(_formName, info);
    alert("הטופס \"" + _formName + "\" נקלט בהצלחה!\nהחלון יסגר כעת");
    window.close();
    return false;
};


let setupInputs = function (formName, isForShow, fields) {
    if (fields !== 'false') {
        while (fields.indexOf('&#34;') >= 0)
            fields = fields.replace('&#34;', '"');
        fields = JSON.parse(fields);
        fields.forEach((field) => {
            let element = document.getElementsByName(field.fieldName)[0];
            if (element.type === 'text')
                element.setAttribute("value", field.value);
            else if (element.type === 'checkbox')
                element.checked = true;
            else if (element.type === 'radio') {
                document.getElementsByName(field.fieldName).forEach((radioElement) => {
                    if (radioElement.value === field.value) {
                        radioElement.checked = true;
                    }
                    return true;
                });
            } else
                alert('type error');
        });
        document.getElementById("fieldset").setAttribute("disabled", "disabled");
        document.getElementById("submitButton").setAttribute("disabled", "disabled");
        document.getElementById("submitButton").style.display = "none";
    } else if (isForShow) {
        let info = "טופס דמו של " + formName;
        document.getElementById("info").appendChild(document.createTextNode(info));
        document.getElementById("fieldset").setAttribute("disabled", "disabled");
        document.getElementById("submitButton").setAttribute("disabled", "disabled");
    } else
        document.getElementById('close_win_button').style.display = "none";
};