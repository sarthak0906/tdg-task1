module.exports = function(app, db){
    app.post('/notes', (req,res) => {
        res.send('hello');
    })
    
    var dbo = db.db('sample');

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

};