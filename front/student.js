$(document).ready(()=>{
    var mail = $('#email');
    var phone = $('#phone');
    var name = $('#name');
    $('#submit').on('click',(event)=>{
        event.preventDefault();
        console.log("asdasd");
        res = {"type":"student"};
        if(res.type == "student"){
            window.location.replace("./student.html?mail="+mail.val());
        }else{
            window.location.replace("./admin.html?mail="+mail.val());
        }
        $.getJSON("https://tdg-ap.herokuapp.com/login?email="+mail.val()+"&name="+name.val()+"&phone="+phone.val(),(res)=>{
            console.log(res);
        });
    });
});