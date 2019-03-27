function setTopBar()
{
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
            let topbar = document.getElementById("top-bar");
            topbar.innerHTML = xmlHttp.responseText;
        }
    };
    xmlHttp.open("GET", '/getTopBar', true);
    xmlHttp.send(null);
}