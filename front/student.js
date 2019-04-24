var email = "";
$(document).ready(()=>{
    email = document.location.href;
    email = email.split('?')[1];
    email = email.split('=')[1];
    console.log(email);
    var current = 1;
    disable_edit();
    $("#submit_name").on('click',(event)=>{
        event.preventDefault();
        if(current){
            enable_edit();
            current = 0;
        }else{
            $.getJSON("https://tdg-ap.herokuapp.com/student?name"+$('#name').val()+"&email="+$('#email').val()+"&phone="+$('#phone').val(),(res)=>{
                alert("Changes Applied");
                disable_edit();
            });
            current = 1;
        }
    });
});

function disable_edit(){
    html = "";
    $.getJSON("api/get?email="+email,(data)=>{
        $('#inner_entry_box').html("");
        disable_name_form("name",data.name,"Name");
        disable_name_form("email",data.email,"E-Mail");
        disable_name_form("phone",data.phone,"Phone Number");
    });
}
function enable_edit(){
    html = "";
    $.getJSON("api/get?email="+email,(data)=>{
        $('#inner_entry_box').html("");
        enable_name_form("name",data.name,"Name");
        enable_name_form("email",data.email,"E-Mail");
        enable_name_form("phone",data.phone,"Phone Number");
    });
}


function disable_name_form(id,value,message){
    var entry = "";
    entry += '<fieldset disabled><div class="input-group mb-3"><div class="input-group-prepend"><span class="input-group-text" id="basic-addon1">'+message+'</span></div><input id = "'+id+'" type="text" class="form-control" placeholder="Team Name" aria-label="Username" aria-describedby="basic-addon1"></div></fieldset>';
    $('#inner_entry_box').append(entry);
    $('#'+id).val(value);
    $('#submit_name').text("Edit");
}
function enable_name_form(id,value,message){
    var entry = "";
    entry += '<div class="input-group mb-3"><div class="input-group-prepend"><span class="input-group-text" id="basic-addon1">'+message+'</span></div><input id = "'+id+'" type="text" class="form-control" placeholder="Team Name" aria-label="Username" aria-describedby="basic-addon1"></div>';
    $('#inner_entry_box').append(entry);
    $('#'+id).val(value);
    $('#submit_name').text("Submit");
}