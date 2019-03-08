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
    });
});