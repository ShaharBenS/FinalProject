function takePartInProcess(processName)
{
    let xhr = new XMLHttpRequest();
    let data = new FormData();
    data.append('processName', processName);
    xhr.open("POST", '/activeProcesses/takePartInProcess', true);
    //xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            if(xhr.responseText === "success")
            {
                alert('לקיחת חלק בתהליך הצליחה.');
            }
            else
            {
                alert('קרתה שגיאה בעת לקיחת חלק בתהליך');
            }
            window.location.href = "/activeProcesses/getAvailableActiveProcessesByUser";
        }
    };
    xhr.send(data);
}