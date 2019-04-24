var email = "";
$(document).ready(()=>{
    email = document.location.href;
    email = email.split('?')[1];
    email = email.split('=')[1];
    var mail = $('#email_message');
    $('.send').on('click',(event)=>{
        event.preventDefault();
        message = mail.val();
        target = "";
        var k = event.currentTarget.id;
        if(k == "1"){
            target = "admin"
        }
        if(k == "2"){
            target = "volunteer"
        }
        if(k == "3"){
            target = "student"
        }
        $.getJSON("https://tdg-ap.herokuapp.com/admin?message="+message+"&target="+target+"&from="+email,(res)=>{
            alert("Email Sent");
        });
    });
});