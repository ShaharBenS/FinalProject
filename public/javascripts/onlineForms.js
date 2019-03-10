let submitForm = function () {
    let oldWin = window.opener;
    let inputs = Array.prototype.slice.call(document.getElementsByTagName('input'));
    let i = 0;

    let info = [];
    inputs.forEach((input) => {
        if (i !== inputs.length - 1) {
            info.push({field: input.placeholder, value: input.value});
        }
        i++;
    });

    oldWin.receiveFormInfo(_formName, info);
    alert("הטופס \"" + _formName + "\" נקלט בהצלחה!\nהחלון יסגר כעת");
    window.close();
    return false;
};