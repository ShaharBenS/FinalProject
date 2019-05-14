//jQuery plugin
(function( $ ) {

    $.fn.uploader = function( options ) {
        var settings = $.extend({
            MessageAreaText: "No files selected.",
            MessageAreaTextWithFiles: "File List:",
            DefaultErrorMessage: "Unable to open this file.",
            BadTypeErrorMessage: "We cannot accept this file type at this time."
        }, options );

        var uploadId = 1;
        //when choosing a file, add the name to the list and copy the file input into the hidden inputs
        $('.file-chooser__input').on('change', function(){
            var file = $('.file-chooser__input').val();
            if(file !== '')
            {
                var fileName = (file.match(/([^\\\/]+)$/)[0]);
                //clear any error condition
                $('.file-chooser').removeClass('error');
                $('.error-message').remove();
                $('.file-chooser__input').attr("name","up" + uploadId);
                // move the 'real' one to hidden list
                $('.hidden-inputs').append($('.file-chooser__input'));

                //insert a clone after the hiddens (copy the event handlers too)
                let clone = $('.file-chooser__input').clone({ withDataAndEvents: true});
                clone.val('');
                $('.file-chooser').append(clone);

                //add the name and a remove button to the file-list
                $('.file-list').append('<div><span class="file-list__name">' + fileName + '&nbsp;</span><button class="removal-button" data-uploadid="'+ uploadId +'"></button><br><br></div>');
                $('.file-list').find("li:last").show(800);

                //removal button handler
                $('.removal-button').on('click', function(e){
                    e.preventDefault();

                    //remove the corresponding hidden input
                    $('.hidden-inputs input[data-uploadid="'+ $(this).data('uploadid') +'"]').remove();

                    //remove the name from file-list that corresponds to the button clicked
                    $(this).parent().hide().queue(function(){$(this).remove();});
                });

                //so the event handler works on the new "real" one
                $('.hidden-inputs .file-chooser__input').removeClass('file-chooser__input').attr('data-uploadId', uploadId);
                uploadId++;
                document.getElementById('upFake').blur();
            }
        });
    };
}( jQuery ));

//init
$(document).ready(function(){
    $('.fileUploader').uploader({

    });
});
