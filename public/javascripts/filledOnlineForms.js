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
    let xhr = new XMLHttpRequest();
    let data = new FormData();
    data.append('processName', processName);
    data.append('formName', formName);
    data.append('info', info);
    xhr.open("POST", '/onlineForms/updateOrAddFilledForm', true);
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            alert("הצליח לשלוח וןפס");
        }
    };
    xhr.send(data);
}

/**
 * @function updateForms is called before POST request and enter the filled forms data to the request by adding it to input.
 */
function updateForms() {
    let formsInput = document.createElement('input');
    formsInput.setAttribute('type', 'hidden');
    formsInput.setAttribute('name', 'formsInfo');
    formsInput.setAttribute('value', JSON.stringify(myForms));
    document.getElementById('formsInfo').appendChild(formsInput);
}

/**
 * called whenever @formName is clicked
 * @param formName
 * @param processName
 * @returns {boolean}
 */
function formClick(formName, processName) {
    window.open("/onlineForms/fill?formName=" + formName + "&processName=" + processName);
    return false;
}