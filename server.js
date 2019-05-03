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


MongoClient.connect(db.url, { useNewUrlParser: true }, (err, database) => {
    app.get('/', (req, res) => {
        console.log('this is working');
        res.send('working');
    })
    if (err) console.log(err);
    
    console.log('database connected');
    var dbo = database.db('sample');
    require('./app/routes') (app, database);
    
    app.listen(port, () => {
        console.log('we are live on '+ port);
    });

    app.use(cors());
    app.get('/populate', (req,res) => {
        app.use(cors());
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

    app.use(cors());
    app.get('/login', (req,res) => {
        app.use(cors());
        dbo.collection("sample").findOne(
            {email : req.query.email}, (err,result) => {
            if(err){
                console.log(err);
                res.send('error');
            }

            if(req.query.pass != result.pass) res.send('incorrect password');

            else if (result.role == 'admin') res.send('admin');
            else if (result.role == 'student') res.send('student');
            else if (result.role == 'vol') res.send('vol');
            else res.send('error');
        })
    });

    app.use(cors());
    app.get('/student', (req,res) => {
        app.use(cors());
        console.log('this is something');
        dbo.collection('sample').findOneAndUpdate(
            {email : req.query.email},
            {$set : {email : req.query.email, name : req.query.name, phone : req.query.phone}},
            (err,result) => {
                if (err) {
                    console.log(err);
                    res.send('err');
                }
                else{
                    console.log('result');
                    res.send('success');
                }
            }
        );
    });

    app.use(cors());
    app.get('/admin', (req,res) => {
        app.use(cors());
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
                      user: req.query.email,
                      pass: result.pass
                    }
                });

                console.log(result.pass);

                // var receivers = '';
                var mailOptions;
                dbo.collection('sample').find({role : req.query.target}).toArray(function(error, arr){
                    if (err){
                        console.log(error);
                        res.send("err");
                    }
                    
                    console.log(arr.length);

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
        );
        // res.send('success');
    });
});