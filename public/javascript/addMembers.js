/**
 * Created by atli on 22.11.2016.
 */
//To add item to list
$('#add-member').on('click',function(){
    $('#insert-wrapper').css({'display':'block'});
    if(validateEmail($('#members').val())) {
        var member = $('#hide-it').clone();
        member.text($('#members').val());
        member.val($('#members').val());
        member.attr('type', 'button');
        $('#members').val('');
        var icon = $('<i></i>');
        icon.addClass('fa fa-close side-icon');
        member.append(icon);
        member.removeAttr('id');
        member.addClass('added-member');
        $('#insert-area').append(member);
    } else{
        //put error message
    }
});

//To remove item of list
$('#insert-area').on('click','.added-member',function(){
    $(this).remove();
});


//Request of form
$("#create-group").on('click',function() {
    members=[];
    $(".added-member").each(function(index){
        members.push($(this).val());
    });
    var input = $("<input>")
        .attr("type", "hidden")
        .attr("name", "members").val(JSON.stringify(members));
    $("#create-group-form").append($(input));
});


function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
