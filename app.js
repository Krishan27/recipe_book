var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cons = require('consolidate'),
    dust = require('dustjs-helpers'),
    pg = require('pg'),
    app = express();





const config = require('./config');





var pool = new pg.Pool(config);

console.log("connection done")

// Assign Dust enngine to .dust files 

app.engine('dust', cons.dust);

//set default ext .dust

app.set('view engine','dust');

app.set('views', __dirname + '/views');

//Set public folder

app.use(express.static(path.join(__dirname,'public')));

//body parser middleware 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));



app.get('/', (req, res, next) => {
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("Can not connect to the DB" + err);
        }
        client.query('SELECT * FROM receipes', function (err, result) {
             
             if (err) {
                 console.log(err);
                 res.status(400).send(err);
             }
             res.render('./index.dust',{receipes: result.rows});
             console.log(">>>>>>")
             done();
        })
    })
 });
 
app.post('/add', function(req,res){
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("Can not connect to the DB" + err);
        }
        
        client.query("INSERT INTO receipes(names, ingredients, directions) VALUES($1, $2, $3)",
        [req.body.names,req.body.ingredients,req.body.directions]);
         
       
        done();
        res.redirect('/');
 });
});

app.delete('/delete/:id', function(req,res){
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("Can not connect to the DB" + err);
        }
        
        client.query("DELETE FROM receipes WHERE id =$1",
        [req.params.id]);
         
       
        done();
        res.sendStatus(200);
 });
});

app.post('/edit', function(req,res){
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("Can not connect to the DB" + err);
        }
        
        client.query("UPDATE receipes SET names=$1, ingredients=$2, directions =$3 WHERE id =$4",
        [req.body.names, req.body.ingredients,req.body.directions,req.body.id]);
         
       
        done();
        res.redirect('/');
 });
});
//server 

app.listen(4000,function(){
    console.log('Server Started on port 4000')

});

