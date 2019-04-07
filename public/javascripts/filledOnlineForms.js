/**
 * data object that holds information about filled online forms of the current stage.
 * @type {Array}
 */
let myForms = [];

/**
 *  add/update @myForms according to the filled form (formName)
 * @var myForms
 * @param formName
 * @param info - array of maps {field:, value:}
 */
function receiveFormInfo(formName, info) {
    let formRecord = {formName: formName, fields: info};
    for (let i = 0; i < myForms.length; i++) {
        if (myForms[i].formName === formName) {
            myForms[i] = formRecord;
            return;
        }
    }
    myForms.push(formRecord);
}

/**
 * @function updateForms is called before POST request and enter the filled forms data to the request by adding it to input.
 */
function updateForms() {
    let formsInput = document.createElement('input');
    formsInput.setAttribute('type', 'hidden');
    formsInput.setAttribute('name', 'formsInfo');
    try {
        JSON.stringify(myForms)
    } catch (e) {
        console.log(myForms);
        alert("its here " + e + "\n\n\n\n\n" + myForms);
        return false;
    }
    formsInput.setAttribute('value', JSON.stringify(myForms));
    document.getElementById('formsInfo').appendChild(formsInput);
}

/**
 * called whenever @formName is clicked
 * @param formName
 * @returns {boolean}
 */
function formClick(formName) {
    window.open("/onlineForms/fill?formName=" + formName);
    return false;
}