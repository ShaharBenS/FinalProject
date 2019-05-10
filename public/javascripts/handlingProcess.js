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
            let isFinish = document.getElementsByName('isFinish').length !== 0;
            if(isFinish)
            {
                alert('התהליך הסתיים בהצלחה');
            }
            else
            {
                alert('התהליך הועבר לשלב הבא בהצלחה');
            }
            window.location.href = "/Home";
        }
        else
        {
            alert(response);
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
                alert(xhr.responseText);
            }
            window.location.href = "/activeProcesses/getWaitingActiveProcessesByUser";
        }
    };
    xhr.send(data);
}

function isChecked()
{
    let hasAtLeastOneChecked = false;
    let isFinish = document.getElementsByName('isFinish').length !== 0;
    let allInput = document.getElementsByTagName('input');
    for(let i=0;i<allInput.length;i++)
    {
        if(allInput[i].type === 'checkbox' && !isNaN(allInput[i].name) && allInput[i].checked)
        {
            hasAtLeastOneChecked = true;
            break;
        }
    }
    if((isFinish && !hasAtLeastOneChecked) || hasAtLeastOneChecked)
    {
        return true;
    }
    alert('אנא בחר לפחות תפקיד אחד לשלב הבא');
    return false;
}

