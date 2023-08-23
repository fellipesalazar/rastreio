$(function(){

    $('#copy-btn').click(function () {
        $('#pix-key').select();
        try {
            var ok = document.execCommand('copy');
            if (ok) {

                $(".alert").addClass("show");

                setTimeout(function () {
                    $(".alert").removeClass("show");
                }, 3000);

            }
        } catch (e) {
            console.log(e);
        }
    });

});