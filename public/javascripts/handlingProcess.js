function returnToCreator(processName)
{
    let xhr = new XMLHttpRequest();
    let data = new FormData();
    data.append('processName', processName);
    data.append('comments', document.getElementsByName('comments')[0].value);
    xhr.open("POST", '/activeProcesses/returnToProcessCreator', true);
    //xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            if(xhr.responseText === "success")
            {
                alert('התהליך הוחזר ליוצרו');
            }
            else
            {
                alert('קרתה שגיאה בעת החזרת התהליך ליוצרו');
            }
            window.location.href = "/activeProcesses/getWaitingActiveProcessesByUser";
        }
    };
    xhr.send(data);
}

$(function()
{
    let index = 0;
    $(document).on('click', '.btn-add', function(e)
    {
        index = index + 1;
        e.preventDefault();

        var controlForm = $('.controls:first'),
            currentEntry = $(this).parents('.entry:first'),
            newEntry = $(currentEntry.clone()).appendTo(controlForm);
        newEntry.find('input').attr('name', 'sel' + index);
        newEntry.find('input').val('');
        controlForm.find('.entry:not(:last) .btn-add')
            .removeClass('btn-add').addClass('btn-remove')
            .removeClass('btn-success').addClass('btn-danger')
            .html('<span class="glyphicon glyphicon-minus"></span>');
    }).on('click', '.btn-remove', function(e)
    {
        $(this).parents('.entry:first').remove();

        e.preventDefault();
        return false;
    });
});
$(document).ready(function() {
    // bind 'myForm' and provide a simple callback function
    $('#frm').ajaxForm(function(response) {
        if(response === "success")
        {
            alert('התהליך הועבר לשלב הבא בהצלחה');
            window.location.href = "/Home";
        }
        else
        {
            if(response === "unchecked")
            {
                alert('אנא בחר לפחות תפקיד אחד לשלב הבא');
            }
        }
    });
});

function cancelProcess(processName)
{
    let xhr = new XMLHttpRequest();
    let data = new FormData();
    data.append('processName', processName);
    data.append('comments', document.getElementsByName('comments')[0].value);
    xhr.open("POST", '/activeProcesses/cancelProcess', true);
    //xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            if(xhr.responseText === "success")
            {
                alert('התהליך בוטל');
            }
            else
            {
                alert('קרתה שגיאה בעת ביטול התהליך');
            }
            window.location.href = "/activeProcesses/getWaitingActiveProcessesByUser";
        }
    };
    xhr.send(data);
}

