let myForms = [];

function receiveFormInfo(formName, info) {
    myForms.push({formName: formName, fields: info});
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
    document.getElementById('formsAttributes').innerText = str;
}