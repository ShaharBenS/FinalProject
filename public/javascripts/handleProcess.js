$(document).ready(function() {
    // bind 'myForm' and provide a simple callback function
    $('#frm').ajaxForm(function(response) {
        alert(response);
    });
});