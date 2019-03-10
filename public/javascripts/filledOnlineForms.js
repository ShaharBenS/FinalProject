let myForms = [];

function receiveFormInfo(formName, info) {
    let formRecord = {formName: formName, fields: info};
    myForms.push(formRecord);

    /*

        let str = "";
        myForms.forEach((formRecord) => {
            str += "------------------------------------\n";
            str += "form name = " + formRecord.formName + "\n";
            str += "-- attributes --\n";
            formRecord.fields.forEach((fieldRecord) => {
                str += "field: " + fieldRecord.field + " | ";
                str += "value: " + fieldRecord.value + "\n";
            });
        });
        document.getElementById('formsInfo').innerText = str;*/
}


function updateForms() {
    let formsInput = document.createElement('input');
    formsInput.setAttribute('type', 'hidden');
    formsInput.setAttribute('name', 'formsInfo');
    formsInput.setAttribute('value', JSON.stringify(myForms));
    document.getElementById('formsInfo').appendChild(formsInput);
}