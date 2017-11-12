var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/QD_DB', {useMongoClient: true});

// Use native promises
mongoose.Promise = global.Promise;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

var MeerkatSchema = new mongoose.Schema({
    name: {type: String, required: true, minlength: 2 },
    favorite_color: {type: String, required: true, minlength: 2}
    }, {timestamps: true})
mongoose.model('Meerkat', MeerkatSchema); 
var Meerkat = mongoose.model('Meerkat');   

   
app.get('/', function(req, res) {
    arr = Meerkat.find({}, function(err, meerkats) {
        res.render('index', {arr:meerkats});
    })
})
app.get('/meerkats/new', function(req, res) {
    res.render('new');
})

app.post('/add', function(req, res) {
  console.log("POST DATA", req.body);
  var meerkat = new Meerkat({name: req.body.name, favorite_color: req.body.favorite_color});
  meerkat.save(function(err) {
    if(err) {
      console.log('something went wrong');
      console.log(meerkat.errors);
      res.redirect('/')
    } 
    else {
      console.log('successfully added a Meerkat!');
      res.redirect('/');
    }
  })
})

app.get('/meerkats/edit/:id', function(req, res) {
    meer = Meerkat.findOne({_id: req.params.id}, function(err, meerkat) {
        console.log(meerkat);
        res.render('edit', {meer:meerkat});
    })
})
app.post('/change/:id', function(req, res) {
    console.log("POST DATA", req.body);
    Meerkat.update({_id: req.params.id},
                    {name: req.body.name,
                    favorite_color: req.body.favorite_color},
                    function(err){
                        if(err) {
                            console.log('something went wrong');
                            console.log(meerkat.errors);
                            res.redirect(`/meerkats/edit/${req.params.id}`)
                        } 
                        else {
                            console.log('successfully changed a Meerkat!');
                            res.redirect(`/meerkats/${req.params.id}`);
                        }

    })
})
app.post('/delete/:id', function(req,res){
    Meerkat.remove({_id: req.params.id}, function(err){
        console.log("RECORD DELETED");
        res.redirect('/');
    })
})
app.get('/meerkats/:id', function(req, res) {
    meer = Meerkat.findOne({_id: req.params.id}, function(err, meerkat) {
        console.log(meerkat);
        res.render('meerkat', {meer:meerkat});
    })
});

  // Setting our Server to Listen on Port: 8000
app.listen(8000, function() {
    console.log("listening on port 8000");
});
