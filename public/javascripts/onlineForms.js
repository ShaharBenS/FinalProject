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

let signature_counter = 0;
let fillSignature = function (element, field) {
    canvasesPadsAndInputs[element.id].pad.fromData(JSON.parse(decodeJSONtoNotJSON(field.value)));
    disableSignature(element.id);
    signature_counter++;
};

let disableSignature = function (id_of_input) {
    canvasesPadsAndInputs[id_of_input].pad.off();
    let div = canvasesPadsAndInputs[id_of_input].div;
    div.style.backgroundColor = 'var(--gray)';
    div.lastChild.childNodes.forEach((button) => button.disabled = true);
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

                let countHeight = function (textarea) {
                    textarea.style.height = 'auto';
                    return textarea.scrollHeight;
                };

                let currentHeight = countHeight(element);
                element.style.height = currentHeight;
                row.push(element);
                let j = parseInt(i / columns);
                if (rowsCounts[j] < currentHeight)
                    rowsCounts[j] = currentHeight;
                if ((i + 1) % columns === 0) {
                    console.log(rowsCounts[j] + " ***");
                    row.forEach((elem) => {
                        elem.style.height = rowsCounts[j] + 'px';
                    });
                    row = [];
                }
                i++;
            });
        } else {
            let element = document.getElementsByName(field.fieldName)[0];
            if (element.type === 'text') {
                element.setAttribute("value", field.value);
                if (element.id.includes('signature_') && field.value !== '') {//its a signature
                    fillSignature(element, field);
                }
            } else if (element.type === 'checkbox')
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
    if (signature_counter === Object.keys(canvasesPadsAndInputs).length)
        disableForm();
};

let disableForm = function () {
    document.getElementById('close_win_button').hidden = false;
    document.getElementById("fieldset").setAttribute("disabled", "disabled");
    document.getElementById("submitButton").setAttribute("disabled", "disabled");
    let submit = document.getElementById("submitButton");
    let submitParent = submit.parentElement;
    submitParent.removeChild(submit);
    Object.keys(canvasesPadsAndInputs).forEach((id) => disableSignature(id));
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

let canvasesPadsAndInputs = {};
let mySignature = null;

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
        //lead ID must start with "signature"
        let leadID = div.id.replace('_div', '');

        let canvas = document.createElement('canvas');
        canvas.id = leadID + '_canvas';
        canvas.width = 300;
        canvas.height = 150;

        let input = document.createElement('input');
        input.id = leadID;
        input.name = input.id;
        input.type = 'text';
        input.hidden = true;

        let buttonsWrapper = document.createElement('div');
        buttonsWrapper.className = 'no_print';

        let createDefaultButton = function (id, innerText) {
            let element = document.createElement('button');
            element.id = id;
            element.innerText = innerText;
            element.className = 'btn-default';
            element.type = 'button';
            return element;
        };

        let save = createDefaultButton(leadID + '_save', 'שמור חתימה');
        let clear = createDefaultButton(leadID + '_clear', 'נקה');
        let load = createDefaultButton(leadID + '_load', 'טען חתימה קיימת');
        let sign = createDefaultButton(leadID + '_sign', 'חתום!');
        sign.className = 'confirm';

        buttonsWrapper.appendChild(save);
        buttonsWrapper.appendChild(clear);
        buttonsWrapper.appendChild(load);
        buttonsWrapper.appendChild(sign);

        div.appendChild(canvas);
        div.appendChild(input);
        div.appendChild(buttonsWrapper);

        let signaturePad = new SignaturePad(canvas, {
            backgroundColor: 'rgba(255, 255, 255, 0)',
            penColor: 'rgb(0, 0, 0)'
        });


        canvasesPadsAndInputs[leadID] = {canvas: canvas, pad: signaturePad, div: div};
        canvases.push(canvas);

        save.addEventListener('click', function (event) {
            let data = signaturePad.toData();
            let jsonData = JSON.stringify(data);
            let encodedJsonData = encodeJSONtoNotJSON(jsonData);
            let formData = new FormData();
            formData.append("signature", encodedJsonData);

            let request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (request.readyState === 4) {
                    if (request.status === 200) {
                        alert("חתימה נשמרה בהצלחה");
                        mySignature = jsonData;
                    } else {
                        alert(request.responseText);
                    }
                }
            };
            request.open("POST", "/signature/updateSignature/", true);
            request.send(formData);
        });

        let clearListener = function (event) {
            signaturePad.clear();
            input.value = "";
            mySignature = null;
        };

        let loadListener = function (event) {
            if (mySignature !== null) {
                signaturePad.fromData(JSON.parse(mySignature));
            } else {
                let xmlHttpRequest = new XMLHttpRequest();
                xmlHttpRequest.onreadystatechange = function () {
                    if (xmlHttpRequest.readyState === 4) {
                        if (xmlHttpRequest.status === 200) {
                            try {
                                mySignature = decodeJSONtoNotJSON(xmlHttpRequest.responseText);
                                signaturePad.fromData(JSON.parse(mySignature));
                            } catch (e) {
                                alert("load error: " + e);
                            }
                        } else {
                            alert('חתימה לא קיימת');
                        }
                    }
                };
                xmlHttpRequest.open("GET", '/signature/getSignature/', true);
                xmlHttpRequest.send(null);
            }
        };

        clear.addEventListener('click', clearListener);

        load.addEventListener('click', loadListener);

        sign.addEventListener('click', function (event) {
            let ans = confirm('בטוח שאתה רוצה לחתום?' + '\n' + 'לאחר החתימה אין אפשרות לעדכן אותה!' + '\n' + 'שים לב! אם כל החתימות מולאו הטופס ינעל!');
            if (ans) {
                let data = signaturePad.toData();
                input.value = encodeJSONtoNotJSON(JSON.stringify(data));
                signaturePad.off();
                div.style.backgroundColor = 'var(--gray)';
                clear.disabled = true;
                load.disabled = true;
                sign.disabled = true;
            }
        });

    });

    function resizeCanvas() {
        canvases.forEach((canvas) => {
            var ratio = Math.max(window.devicePixelRatio || 1, 1);
            canvas.width = canvas.width * ratio;
            canvas.height = canvas.height * ratio;
            canvas.getContext("2d").scale(ratio, ratio);
        });
        for (let id in canvasesPadsAndInputs) {
            canvasesPadsAndInputs[id].pad.clear();
        }
    }

// need to decide if to allow this or not
//  window.addEventListener("resize", resizeCanvas);
//  resizeCanvas();
};