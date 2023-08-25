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

    // máscara do campo de tracking
    $('#tracking-code').mask('AA000000000AA', {
        translation: {
          'A': {
            pattern: /[A-Za-z]/
          },
          '0': {
            pattern: /[0-9]/
          }
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
                $("body, .container").addClass("modal-open");

                $(".modal, .modal-backdrop").addClass("show");
                return;
            }

            var linha = "";
            var current = "";
            var icons = {
                "postado": "package_2",
                "encaminhado": "local_shipping",
                "saiu": "map",
                "entregue": "box",
                "fiscalização": "search",
                "brasil": "location_on",
                "exportação": "public",
                "devolvido": "assignment_return"
            }

            res.eventos.forEach((evento, index) => {

                var status = evento.status.toLowerCase();
                var iconName = "package_2";

                for (var keyword in icons) {
                    if (status.includes(keyword)) {
                        iconName = icons[keyword];
                        break;
                    }
                }

                if(index == 0){
                    current = "current-status";
                }else{
                    current = "";
                }

                var subStatusLine = "";
                if (!status.includes("exportação")) {
                    if (evento.subStatus.length === 1) {
                        var subStatusText = evento.subStatus[0];
                        if (subStatusText === "Local: País - /") {
                            subStatusText = "Local: País de origem";
                        }
                        subStatusLine = `<p class="status-description">${subStatusText}</p>`;
                    } else if (evento.subStatus.length === 2) {
                        var subStatusOrigem = evento.subStatus[0].replace("Origem:", "Origem:");
                        var subStatusDestino = evento.subStatus[1].replace("Destino:", "Destino:");
            
                        if (subStatusDestino.startsWith("Destino: ")) {
                            var destino = subStatusDestino.split("Destino: ")[1];
                            subStatusLine = `<p class="status-description">${subStatusOrigem}</p><p class="status-description">${subStatusDestino}</p>`;
                        } else {
                            subStatusLine = `<p class="status-description">${subStatusOrigem}</p>`;
                        }
                    }
                }

                linha += `<div class="tracking-status ${current}">`;
                linha += `<div class="icon">`;
                linha += `<span class="material-symbols-rounded">${iconName}</span>`;
                linha += `</div>`;
                linha += `<div class="status-info">`;
                linha += `<h4 class="status-title">${evento.status}</h4>`;
                linha += subStatusLine;
                linha += `<p class="status-date">${evento.data} ${evento.hora}</p>`;
                linha += `</div>`;
                linha += `</div>`;
            });

            $(".tracking-area").html(linha);
            $(".modal .tracking-code").text(res.codigo);
            $("#empty-modal").removeClass("show");
            $("#tracking-modal").addClass("show");
            $("body, .container").addClass("modal-open");
            $(".modal, .modal-backdrop").addClass("show");

        }).catch(function (error) {

            $(".msg").addClass("on");
            $(".msg .text").text(error);

        });
    });

    // reseta tudo e fecha o modal
    $(".modal-close").on("click", function(){
        $(".tracking-area").html("");
        $(".modal .tracking-code").text("");
        $("#empty-modal").removeClass("show");
        $("#tracking-modal").removeClass("show");
        $("body, .container").removeClass("modal-open");
        $(".modal, .modal-backdrop").removeClass("show");
    });

    // remover erro do input
    $("#tracking-code").on("input", function(){
        if($("#tracking-code").val().length == 13) {
            $(".error-msg").removeClass("show");
            $(".input-area").removeClass("error");
        }
    });

    

});