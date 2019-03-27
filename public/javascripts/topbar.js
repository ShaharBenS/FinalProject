let tableLanguageOption = {
    "language": {
        "decimal": "",
        "emptyTable": "אין כרגע מידע בטבלה",
        "info": "מציג _START_ עד _END_ מתוך _TOTAL_ רשומות",
        "infoEmpty": "מציג 0 עד 0 מתוך 0 רשומות",
        "infoFiltered": "(filtered from _MAX_ total entries)",
        "infoPostFix": "",
        "thousands": ",",
        "lengthMenu": "הצג _MENU_ רשומות",
        "loadingRecords": "טוען...",
        "processing": "מעבד...",
        "search": "חפש: ",
        "zeroRecords": "לא נמצאו רשומות",
        "paginate": {
            "first": "ראשון",
            "last": "אחרון",
            "next": "הבא",
            "previous": "הקודם"
        },
        "aria": {
            "sortAscending": ": activate to sort column ascending",
            "sortDescending": ": activate to sort column descending"
        }
    }
};

function setTopBar()
{
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function ()
    {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
            let topbar = document.getElementById("top-bar");
            topbar.innerHTML = xmlHttp.responseText;
        }
    };
    xmlHttp.open("GET", '/getTopBar', true);
    xmlHttp.send(null);


    let example_length = document.getElementById("example_length");
    if(example_length === null){
        return;
    }
    example_length.style.display = 'flex';
    example_length.style.justifyContent = "flex-end";

    let example_info = document.getElementById("example_info");
    example_info.style.display = 'flex';
    example_info.style.justifyContent = "flex-end";
}