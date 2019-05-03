$(document).ready(()=>{
    var mail = $('#email');
    var phone = $('#phone');
    var name = $('#name');
    $('#submit').on('click',(event)=>{
        event.preventDefault();
        console.log("res");
        $.getJSON("https://tdg-ap.herokuapp.com/student?email="+mail.val()+"&name="+name.val()+"&phone="+phone.val(),(res)=>{
            console.log(res);
        });
    });
});