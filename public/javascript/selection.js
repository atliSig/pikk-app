/**
 * Created by atli on 4.11.2016.
 */
$(document).ready(function() {
    var selection = {};
    $(".btn-group > button.btn").on("click", function(){
        var theKey=this.parentNode.id;
        selection[theKey]=this.value;
        console.log(selection);
    });

    $(".dropdown-menu>button.dropdown-item").on("click",function(){
        var key=this.parentNode.id;
        selection[key]=this.value;
    })
});