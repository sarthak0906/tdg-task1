module.exports = function(app, db){
    app.get('/', (req,res) => {
        res.send('hello');
    })
    
    var dbo = db.db('sample');

};