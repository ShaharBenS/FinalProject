let submitForm = function () {
    let oldWin = window.opener;
    let inputs = Array.prototype.slice.call(document.getElementsByTagName('input'));
    let text_areas = Array.prototype.slice.call(document.getElementsByTagName('textarea'));
    let info = [];
    let tableInputs = {};
    let tables = Array.prototype.slice.call(document.getElementsByTagName('table'));
    tables.forEach((table) => {
        if (table.className !== "no_table")
            tableInputs[table.id] = [];
    });
    text_areas.forEach((text_area) => {
        if (text_area.class === 'table_cell') {
            let tableID = text_area.parentElement.parentElement.parentElement.parentElement.id;
            tableInputs[tableID].push({
                field: text_area.name,
                value: text_area.value
            });
        }
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
    str = CryptoJS.AES.encrypt(str, "code").toString();

    return str;
};

let decodeJSONtoNotJSON = function (str) {
    str = CryptoJS.AES.decrypt(str, "code").toString(CryptoJS.enc.Utf8);
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
            let filledCells = "error man";
            try {
                filledCells = JSON.parse(fieldValue);
            } catch (e) {
                alert(e);
            }
            let rows = filledCells.length / columns;

            setupTables(rows, tableID);
            let rowsCounts = [];
            for (let i = 0; i < rows; i++)
                rowsCounts.push(0);

            let i = 0;
            let row = [];
            filledCells.forEach((cell) => {
                let element = document.getElementsByName(cell.field)[0];
                element.value = cell.value;
                let currentRows = countLines(cell.value, parseInt(element.cols));
                element.rows = currentRows;
                row.push(element);
                let j = parseInt(i / columns);
                if (rowsCounts[j] < currentRows)
                    rowsCounts[j] = currentRows;
                if ((i + 1) % columns === 0) {
                    row.forEach((elem) => elem.rows = rowsCounts[j]);
                    row = [];
                }
                i++;
            });


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

    setupLabelCells();

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

let countLines = function (txt, cellCols) {
    //TODO: count is wrong
    let lines = txt.split(/\r*\n/);
    let count = lines.length;
    /*lines.forEach((line) => {
        count += parseInt(line.length / cellCols, 10);
    });*/
    console.log("cols: " + cellCols);
    console.log("lines: " + lines.length);
    console.log("count: " + count);
    return count
};

let mapOfHeights = {};

let createTableRow = function (table) {
    let columnsCount = table.children[0].children.length;
    let rowsCount = table.children.length - 1;
    let nameCount = columnsCount * rowsCount + 1;
    let currentRowElement = document.createElement('tr');

    for (let i = 1; i <= columnsCount; i++) {
        let td = document.createElement('td');
        let currentTextArea = document.createElement('textarea');
        currentTextArea.style.resize = "none";
        currentTextArea.name = 'table_input_' + table.parentElement.id + '_' + nameCount;
        currentTextArea.class = 'table_cell';
        currentTextArea.addEventListener('keydown', () => {
            let maxHeight = 0;
            currentRowElement.childNodes.forEach((tdElem) => {
                let textarea = tdElem.firstChild;
                let originalHeight = textarea.style.height;
                textarea.style.height = 'auto';
                let h1 = textarea.scrollHeight;
                textarea.style.height = originalHeight;
                if (h1 > maxHeight)
                    maxHeight = h1;
            });
            maxHeight = maxHeight + "px";
            currentRowElement.childNodes.forEach((tdElem) => {
                let textarea = tdElem.firstChild;
                textarea.style.height = maxHeight;
            });
            currentRowElement.style.height = maxHeight;
        });

        nameCount++;
        td.appendChild(currentTextArea);
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
    if (table.className !== "no_table") {
        table = table.children[0]; //TBODY
        let currentRows = 0;
        while (currentRows < num_of_rows) {
            currentRows++;
            table.appendChild(createTableRow(table))
        }
    }
};

let setupLabelCells = function () {
    let tds = Array.prototype.slice.call(document.getElementsByTagName('td'));
    tds.forEach((td) => {
        if (td.children[0].tagName.toLowerCase() === 'label') td.className = 'no_input'
    })
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
    if (table.className !== "no_table") {
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
        addBtn.className = "btn-default";

        removeBtn.innerText = 'הסר שורה';
        removeBtn.type = 'button';
        removeBtn.style.marginRight = '10px';
        removeBtn.onclick = () => removeTableRow(table);
        removeBtn.className = "btn-default";

        div.appendChild(document.createElement('br'));

        div.appendChild(addBtn);
        div.appendChild(removeBtn);
    }
};