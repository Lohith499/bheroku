$(document).ready(function() {
    $('.example').DataTable();
    if ($('.example tbody tr').length<1){
        $('.example').hide();
        $('.example').parent().append('<h4> No Records Available</h4>');

    } else {
        $('.example').show();
    }
    $("#sidemenu").height($("#content_beside_sidemenu").height());
} );

