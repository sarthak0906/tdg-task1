const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const app            = express();
const db             = require('./config/db');
const port           = process.env.PORT || 3000;
var cors             = require('cors');
var nodemailer       = require('nodemailer');

// require('./app/routes') (app, {});

app.use(cors());
app.use(bodyParser.urlencoded({extended : true }));

app.get('/', (req, res) => {
    console.log('this is working');
    res.send('working');
})

MongoClient.connect(db.url, { useNewUrlParser: true }, (err, database) => {
    if (err) console.log(err);
    
    console.log('database connected');
    var dbo = database.db('sample');
    require('./app/routes') (app, database);
    
    app.listen(port, () => {
        console.log('we are live on '+ port);
    });

    app.get('/populate', (req,res) => {
        var item = {email : req.query.email, name : req.query.name, pass : req.query.pass, role : req.query.pass, phone : req.query.phone};

        dbo.collection('sample').insertOne(item, (err,rest) => {
            if (err){
                console.log(err);
                res.send('err');
            }
            else {    
                console.log('added');
                res.send('success');
            }
        });
    });

    app.get('/login', (req,res) => {
        dbo.collection("sample").findOne(
            {email : req.query.email}, (err,result) => {
            if(err){
                console.log(err);
                res.send('error');
            }

            if(req.query.pass != result.pass) res.send('incorrect password');

            if (result.role == 'admin') res.send('admin');
            if (result.role == 'student') res.send('student');
            if (result.role == 'vol') res.send('vol');
        })
    });


    app.get('/student', (req,res) => {
        dbo.collection('sample').findOneAndUpdate(
            {email : req.query.email},
            {$set : {email : req.query.email, name : req.query.name, phone : req.query.phone}},
        );
    });

    app.get('/admin', (req,res) => {
        dbo.collection('sample').findOne(
            {email : req.query.email}, (err, result) => {
                if (err){
                    console.log(err);
                    res.send('error');
                }

                var transporter  = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,
                    auth: {
                      user: result.email,
                      pass: result.pass
                    }
                });

                // var receivers = '';
                var mailOptions;
                dbo.collection('sample').find({role : req.query.role}).toArray(function(error, arr){
                    if (err){
                        console.log(error);
                        res.send("err");
                    }
                    // console.log(arr);
                    arr.forEach(element => {
                        transporter.sendMail({
                            from    : req.query.email,
                            to      : element.email,
                            subject : 'email from portal',
                            html    : req.query.body                            
                        }, (err, info) => {
                            if (err){
                                // console.log(err);
                                res.send('error');
                            }
                            else{
                                console.log('send : ' + info.response);
                            }
                            if (element == arr[arr.length - 1]){
                                res.send('success');
                            }
                        });
                    });
                    
                });

            }
        )
    });
});