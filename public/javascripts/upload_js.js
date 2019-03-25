//jQuery plugin
(function( $ ) {

    $.fn.uploader = function( options ) {
        var settings = $.extend({
            MessageAreaText: "No files selected.",
            MessageAreaTextWithFiles: "File List:",
            DefaultErrorMessage: "Unable to open this file.",
            BadTypeErrorMessage: "We cannot accept this file type at this time.",
            acceptedFileTypes: ['pdf', 'jpg', 'gif', 'jpeg', 'bmp', 'tif', 'tiff', 'png', 'xps', 'doc', 'docx',
                'fax', 'wmp', 'ico', 'txt', 'cs', 'rtf', 'xls', 'xlsx']
        }, options );

        var uploadId = 1;
        //when choosing a file, add the name to the list and copy the file input into the hidden inputs
        $('.file-chooser__input').on('change', function(){
            var file = $('.file-chooser__input').val();
            var fileName = (file.match(/([^\\\/]+)$/)[0]);
            //clear any error condition
            $('.file-chooser').removeClass('error');
            $('.error-message').remove();

            //validate the file
            var check = checkFile(fileName);
            if(check === "valid") {
                $('.file-chooser__input').attr("name","up" + uploadId)
                // move the 'real' one to hidden list
                $('.hidden-inputs').append($('.file-chooser__input'));

                //insert a clone after the hiddens (copy the event handlers too)
                $('.file-chooser').append($('.file-chooser__input').clone({ withDataAndEvents: true}));

                //add the name and a remove button to the file-list
                $('.file-list').append('<div><span class="file-list__name">' + fileName + '&nbsp;</span><button class="removal-button" data-uploadid="'+ uploadId +'"></button><br><br></div>');
                $('.file-list').find("li:last").show(800);

                //removal button handler
                $('.removal-button').on('click', function(e){
                    e.preventDefault();

                    //remove the corresponding hidden input
                    $('.hidden-inputs input[data-uploadid="'+ $(this).data('uploadid') +'"]').remove();

                    //remove the name from file-list that corresponds to the button clicked
                    $(this).parent().hide().delay(10).queue(function(){$(this).remove();});
                });

                //so the event handler works on the new "real" one
                $('.hidden-inputs .file-chooser__input').removeClass('file-chooser__input').attr('data-uploadId', uploadId);
                uploadId++;

            } else {
                //indicate that the file is not ok
                $('.file-chooser').addClass("error");
                var errorText = options.DefaultErrorMessage || settings.DefaultErrorMessage;

                if(check === "badFileName") {
                    errorText = options.BadTypeErrorMessage || settings.BadTypeErrorMessage;
                }

                $('.file-chooser__input').after('<p class="error-message">'+ errorText +'</p>');
            }
        });

        var checkFile = function(fileName) {
            var accepted          = "invalid",
                acceptedFileTypes = this.acceptedFileTypes || settings.acceptedFileTypes,
                regex;

            for ( var i = 0; i < acceptedFileTypes.length; i++ ) {
                regex = new RegExp("\\." + acceptedFileTypes[i] + "$", "i");

                if ( regex.test(fileName) ) {
                    accepted = "valid";
                    break;
                } else {
                    accepted = "badFileName";
                }
            }

            return accepted;
        };
    };
}( jQuery ));

//init
$(document).ready(function(){
    $('.fileUploader').uploader({

    });
});
