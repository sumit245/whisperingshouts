/*
 * Application
 */

$(document).tooltip({
    selector: "[data-toggle=tooltip]"
})

/*
 * Auto hide navbar
 */
jQuery(document).ready(function($){


    updatePassword();

    // IFSC code validation
    ifscCodeValidation();

    var $header = $('.navbar-autohide'),
        scrolling = false,
        previousTop = 0,
        currentTop = 0,
        scrollDelta = 10,
        scrollOffset = 150

    $(window).on('scroll', function(){
        if (!scrolling) {
            scrolling = true

            if (!window.requestAnimationFrame) {
                setTimeout(autoHideHeader, 250)
            }
            else {
                requestAnimationFrame(autoHideHeader)
            }
        }
    });


    function updatePassword() {
        var updatePasswordInput = $('.account-update-password');
        updatePasswordInput.change(function(){
            if(this.checked){
                $('.update-password-container').removeClass('d-none');
            }else{
                $('.update-password-container').addClass('d-none');
            }
        });
    }

    function ifscCodeValidation() {
        var ifscField = $('.bank-ifsc-code');
        ifscField.on('keyup change', function(){
            var currentIFSC = $(this).val();
            if(currentIFSC < 5){
                return;
            }
            $.ajax({
                url: 'https://ifsc.razorpay.com/'+currentIFSC,
                beforeSend: function () {
                    $('.ifsc-message-container .loading').addClass('active');
                },
                error: function () {
                    $('.ifsc-message-container .loading').removeClass('active');
                },
                success: function (response) {
                    $('.ifsc-message-container .loading').removeClass('active');
                    if(response.BRANCH){
                        $('.ifsc-message-container .message').text('Branch: '+response.BRANCH);
                    }
                }
            })
        });
    }

    function autoHideHeader() {
        var currentTop = $(window).scrollTop()

        // Scrolling up
        if (previousTop - currentTop > scrollDelta) {
            $header.removeClass('is-hidden')
        }
        else if (currentTop - previousTop > scrollDelta && currentTop > scrollOffset) {
            // Scrolling down
            $header.addClass('is-hidden')
        }

        previousTop = currentTop
        scrolling = false
    }

    $('.masthead-slider').slick({
        arrows: false,
        nextArrow: $('.arrow-rt'),
        prevArrow:  $('.arrow-lt'),
    });
});
toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-bottom-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  }
$(window).on('ajaxErrorMessage', function(event, message){
    toastr.error(message, '')
    event.preventDefault();
})

