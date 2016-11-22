/**
 * Created by atli on 22.11.2016.
 */
var members = [];


$('#add-member').on('click',function(){
    $('#insert-wrapper').css({'display':'block'});
    if(validateEmail($('#members').val())) {
        var member = $('#hide-it').clone();
        member.text($('#members').val());
        members.push($('#members').val());
        $('#members').val('');
        member.removeAttr('id');
        $('#insert-area').append(member);
    } else{

    }
});


$("#create-group").on('click',function() {
    var input = $("<input>")
        .attr("type", "hidden")
        .attr("name", "members").val(JSON.stringify(members));
    $("#create-group-form").append($(input));
});

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
