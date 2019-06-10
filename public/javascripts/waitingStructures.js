function viewStructureClicked(id)
{
    window.location.href = '/processStructures/viewWaitingProcessStructure/?mongoId=' + id.substring(5, id.length)
}

function approveClicked(id)
{
    let data = {
        mongoId: id.substring(8,id.length),
    };

    $.ajax({
            url: '/processStructures/approveStructure/',
            method: "POST",
            xhrFields: {
                withCredentials: true
            },
            data: data,
        }
    ).done(function (responseText, status)
    {
        if (status === "success") {
            if (responseText === "success") {
                alertify.alert("תהליך אושר בהצלחה",()=>{
                    window.location.href = '/processStructures/waitingForApproval/';
                });
            }
            else {
                alertify.alert(responseText);
            }
        }
    });
}

function disapproveClicked(id)
{
    let data = {
        mongoId: id.substring(11,id.length),
    };

    $.ajax({
            url: '/processStructures/disapproveStructure/',
            method: "POST",
            xhrFields: {
                withCredentials: true
            },
            data: data,
        }
    ).done(function (responseText, status)
    {
        if (status === "success") {
            if (responseText === "success") {
                alertify.alert("תהליך נדחה בהצלחה", ()=>{
                    window.location.href = '/processStructures/waitingForApproval/';
                });
            }
            else {
                alertify.alert(responseText);
            }
        }
    });}