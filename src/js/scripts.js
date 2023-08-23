$(function(){

    // copiar a chave pix
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

    // buscar os dados da reserva
    $("#tracking-btn").on("click",function(){
        const trackingCode = $("#tracking-code").val().toUpperCase();
        let trackingCodeSize = trackingCode.length;
        let codeErrorMessage = "Informe o código de rastreio";
        const apiToken = "0cf8570a61aa63d4c3001a461a186015214832f74eb2c09b19b57f04d6dfd18d";
        
        if(trackingCode == ""){
            $(".error-msg p").text(codeErrorMessage);
            $(".error-msg").addClass("show");
            $(".input-area").addClass("error");
            return;
        }

        if(trackingCodeSize != 13){
            codeErrorMessage = "Informe um código válido com 13 dígitos";
            $(".error-msg p").text(codeErrorMessage);
            $(".error-msg").addClass("show");
            $(".input-area").addClass("error");
            return;
        }

        $(".tracking-arrow").hide();
        $(".tracking-load").show();

        fetch(`https://api.linketrack.com/track/json?user=lypesalazar@gmail.com&token=${apiToken}&codigo=${trackingCode}`).then((resp) => resp.json()).then(function (res) {

            $(".tracking-arrow").show();
            $(".tracking-load").hide();

            if(res.quantidade == 0){
                $("#empty-modal").addClass("show");
                $("#tracking-modal").removeClass("show");
                $("body").addClass("modal-open");

                $(".modal, .modal-backdrop").addClass("show");
            }



            console.log(dados);

        }).catch(function (error) {

            $(".msg").addClass("on");
            $(".msg .text").text(error);

        });
    });

    // remover erro do input
    $("#tracking-code").on("input", function(){
        if($("#tracking-code").val().length == 13) {
            $(".error-msg").removeClass("show");
            $(".input-area").removeClass("error");
        }
    });

    

});