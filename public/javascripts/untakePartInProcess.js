function unTakePartInProcess(processName)
{
    let xhr = new XMLHttpRequest();
    let data = new FormData();
    data.append('processName', processName);
    xhr.open("POST", '/activeProcesses/unTakePartInProcess', true);
    //xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            if(xhr.responseText === "success")
            {
                alertify.alert('החזרת תהליך למאגר התהליכים הזמינים הצליחה.', ()=>{
                    window.location.href = "/activeProcesses/getWaitingActiveProcessesByUser";
                });
            }
            else
            {
                alertify.alert('קרתה שגיאה בעת החזרת תהליך למאגר התהליכים הזמינים.', ()=>{
                    window.location.href = "/activeProcesses/getWaitingActiveProcessesByUser";
                });
            }
        }
    };
    xhr.send(data);
}