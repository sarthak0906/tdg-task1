$(document).ready(()=>{
    var mail = $('#email');
    var pass = $('#password');
    $('#submit').on('click',(event)=>{
        event.preventDefault();
        console.log("asdasd");
        res = {"type":"student"};
        if(res.type == "student"){
            window.location.replace("./student.html?mail="+mail.val());
        }else{
            window.location.replace("./admin.html?mail="+mail.val());
        }
        $.getJSON("../server/login?mail="+mail.val()+"&pass="+pass.val(),(res)=>{
            if(res.type == "student"){
                window.location.replace = "./student.html?mail="+mail.val();
            }else{
                window.location.replace = "./admin.html?mail="+mail.val();
            }
        });
    });
});