let submitForm = function () {
    let oldWin = window.opener;
    let inputs = Array.prototype.slice.call(document.getElementsByTagName('input'));

    let info = [];
    let tableInputs = {};
    let tables = Array.prototype.slice.call(document.getElementsByTagName('table'));
    tables.forEach((table) => {
        tableInputs[table.id] = [];
    });

    inputs.forEach((input) => {
        if (input.type !== 'submit') {
            if (input.class === 'table_cell') {
                let tableID = input.parentElement.parentElement.parentElement.parentElement.id;
                tableInputs[tableID].push({
                    field: input.name,
                    value: input.value
                });
            } else if (input.type === 'checkbox' || input.type === 'radio') {
                if (input.checked)
                    info.push({field: input.name, value: input.value});
            } else info.push({field: input.name, value: input.value});
        }
    });

    Object.keys(tableInputs).forEach((tableID) => {
        let strFields = JSON.stringify(tableInputs[tableID]);
        strFields = encodeJSONtoNotJSON(strFields);
        info.push({field: '__table_' + tableID, value: strFields})
    });
    //receiveFormInfo is a function on the opener window that receive the form's data
    oldWin.receiveFormInfo(_formName, info);
    alert("הטופס \"" + _formName + "\" נקלט בהצלחה!\nהחלון יסגר כעת");
    window.close();
    return false;
};

let encodeJSONtoNotJSON = function (str) {

    str = whileReplace(str, '"', '###');
    str = whileReplace(str, '[', '!!!');
    str = whileReplace(str, ']', '@@@');
    str = whileReplace(str, '{', '^^^');
    str = whileReplace(str, '}', '***');
    return str;
};

let decodeJSONtoNotJSON = function (str) {
    str = whileReplace(str, '###', '"');
    str = whileReplace(str, '!!!', '[');
    str = whileReplace(str, '@@@', ']');
    str = whileReplace(str, '^^^', '{');
    str = whileReplace(str, '***', '}');
    return str;
};

let whileReplace = function (str, replace, by) {
    while (str.indexOf(replace) >= 0)
        str = str.replace(replace, by);
    return str;
};

let fillForm = function (fields) {

    fields = whileReplace(fields, '&#34;', '"');
    try {
        fields = JSON.parse(fields);
    } catch (e) {
        alert(e)
    }
    fields.forEach((field) => {
        if (field.fieldName.includes('__table_')) {
            let tableID = field.fieldName.substring(8, field.fieldName.length);
            let table = document.getElementById(tableID);
            let columns = table.rows[0].cells.length;
            let fieldValue = decodeJSONtoNotJSON(field.value);
            let filledCells = JSON.parse(fieldValue);
            let rows = filledCells.length / columns;

            setupTables(rows, tableID);

            filledCells.forEach((cell) => document.getElementsByName(cell.field)[0].setAttribute("value", cell.value));
        } else {
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
        }
    });
    disableForm();
};

let disableForm = function () {
    document.getElementById("fieldset").setAttribute("disabled", "disabled");
    document.getElementById("submitButton").setAttribute("disabled", "disabled");
    let submit = document.getElementById("submitButton");
    let submitParent = submit.parentElement;
    submitParent.removeChild(submit);
};

let setupInputs = function (formName, isForShow, fields) {

    if (fields !== 'false') {
        fillForm(fields)
    } else if (isForShow) {
        let info = document.createTextNode("טופס דמו של " + formName);
        document.getElementById("info").appendChild(info);
        setupTables(2, 'every_table');
        disableForm()
    } else {
        document.getElementById('close_win_button').style.display = "none";
        setupTables(2, 'every_table');
    }
};

let createTableRow = function (table) {
    let columnsCount = table.children[0].children.length;
    let rowsCount = table.children.length - 1;
    let nameCount = columnsCount * rowsCount + 1;
    let currentRowElement = document.createElement('tr');
    for (let i = 1; i <= columnsCount; i++) {
        let td = document.createElement('td');
        let cell = document.createElement('input');
        cell.type = 'text';
        cell.name = 'table_input_' + table.parentElement.id + '_' + nameCount;
        cell.class = 'table_cell';

        nameCount++;
        td.appendChild(cell);
        currentRowElement.appendChild(td)
    }
    return currentRowElement;
};

let removeTableRow = function (table) {
    let rowIndex = table.children.length - 1;
    if (rowIndex > 1)
        table.removeChild(table.children[rowIndex]);
};

let setupTable = function (num_of_rows, table) {
    table = table.children[0]; //TBODY
    let currentRows = 0;
    while (currentRows < num_of_rows) {
        currentRows++;
        table.appendChild(createTableRow(table))
    }
};

let setupTables = function (num_of_rows, table_id) {
    let tables;

    if (table_id === 'every_table') {
        tables = Array.prototype.slice.call(document.getElementsByTagName('table'));
        tables.forEach((table) => surroundTableWithDivAndAddButtons(table));
    } else
        tables = [document.getElementById(table_id)];

    tables.forEach((table) => setupTable(num_of_rows, table));


};

let surroundTableWithDivAndAddButtons = function (table) {

    // surround table with div
    let parent = table.parentNode;
    let div = document.createElement('div');
    parent.replaceChild(div, table);
    div.appendChild(table);

    table = table.children[0];

    //add the add / remove buttons
    let addBtn = document.createElement('button');
    let removeBtn = document.createElement('button');

    addBtn.innerText = 'הוסף שורה';
    addBtn.type = 'button';
    addBtn.style.marginLeft = '10px';
    addBtn.onclick = () => table.appendChild(createTableRow(table));

    removeBtn.innerText = 'הסר שורה';
    removeBtn.type = 'button';
    removeBtn.style.marginRight = '10px';
    removeBtn.onclick = () => removeTableRow(table);

    div.appendChild(document.createElement('br'));

    div.appendChild(addBtn);
    div.appendChild(removeBtn);
};