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
    //disableForm();
};

let disableForm = function () {
    signaturePads.forEach((signPad) => signPad.off);
    document.getElementById("fieldset").setAttribute("disabled", "disabled");
    document.getElementById("submitButton").setAttribute("disabled", "disabled");
    let submit = document.getElementById("submitButton");
    let submitParent = submit.parentElement;
    submitParent.removeChild(submit);
};

let setupInputs = function (formName, isForShow, fields) {

    setupLabelCells();
    initSignatures();

    let num_of_rows_to_add = 2;
    if (fields !== 'false') {
        fillForm(fields);
        num_of_rows_to_add = 0;
    }
    if (isForShow) {
        let info = document.createTextNode("טופס דמו של " + formName);
        document.getElementById("info").appendChild(info);
        setupTables(num_of_rows_to_add, 'every_table');
        disableForm()
    } else {
        document.getElementById('close_win_button').style.display = "none";
        setupTables(num_of_rows_to_add, 'every_table');
    }
};

let createTableRow = function (table) {
    let columnsCount = table.children[0].children.length;
    let rowsCount = table.children.length - 1;
    let nameCount = columnsCount * rowsCount + 1;
    let currentRowElement = document.createElement('tr');

    for (let i = 1; i <= columnsCount; i++) {
        let td = document.createElement('td');
        let currentTextArea = document.createElement('textarea');
        currentTextArea.style.resize = "none";
        currentTextArea.rows = 1;
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
        addBtn.className = "btn-default no_print";

        removeBtn.innerText = 'הסר שורה';
        removeBtn.type = 'button';
        removeBtn.style.marginRight = '10px';
        removeBtn.onclick = () => removeTableRow(table);
        removeBtn.className = "btn-default no_print";

        div.appendChild(document.createElement('br'));

        div.appendChild(addBtn);
        div.appendChild(removeBtn);
    }
};

let signaturePads = [];

let initSignatures = function () {
    let divsForSignatures = [];
    let canvases = [];

    Array.prototype.slice.call(document.getElementsByTagName('div'))
        .forEach((div) => {
            if (div.id.includes('signature_') && div.id.includes('_div')) {
                divsForSignatures.push(div);
            }
        });

    divsForSignatures.forEach((div) => {
        let leadID = div.id.replace('_div', '');

        let canvas = document.createElement('canvas');
        canvas.id = leadID + '_canvas';
        canvas.style.width = '100%';
        canvas.height = '200';

        let input = document.createElement('input');
        input.id = leadID;
        input.name = input.id;
        input.type = 'text';
        input.hidden = true;

        let buttonsWrapper = document.createElement('div');
        buttonsWrapper.className = 'no_print';

        let save = document.createElement('label');
        save.id = leadID + '_save';
        save.innerText = 'שמור חתימה';
        save.className = 'btn-default';

        let clear = document.createElement('label');
        clear.id = leadID + '_clear';
        clear.innerText = 'נקה';
        clear.className = 'btn-default';

        let load = document.createElement('label');
        load.id = leadID + '_load';
        load.innerText = 'טען חתימה קיימת';
        load.className = 'btn-default';

        buttonsWrapper.appendChild(save);
        buttonsWrapper.appendChild(clear);
        buttonsWrapper.appendChild(load);

        div.appendChild(canvas);
        div.appendChild(input);
        div.appendChild(buttonsWrapper);

        let signaturePad = new SignaturePad(canvas, {
            backgroundColor: 'rgba(255, 255, 255, 0)',
            penColor: 'rgb(0, 0, 0)'
        });

        signaturePads.push(signaturePad);
        canvases.push(canvas);

        save.addEventListener('click', function (event) {
            let data = signaturePad.toData();
            input.value = JSON.stringify(data);
        });

        clear.addEventListener('click', function (event) {
            signaturePad.clear();
        });

        load.addEventListener('click', function (event) {
            if (input.value !== '') {
                signaturePad.fromData(JSON.parse(input.value));
            } else alert('חתימה לא קיימת')
        });
    });

    function resizeCanvas() {
        canvases.forEach((canvas) => {
            let ratio = Math.max(window.devicePixelRatio || 1, 1);
            canvas.width = canvas.offsetWidth * ratio;
            canvas.height = canvas.offsetHeight * ratio;
            canvas.getContext("2d").scale(ratio, ratio);
        });
        signaturePads.forEach((signPad) => signPad.clear());
    }

    function disable() {
        //TODO: disable signatures
    }

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
};