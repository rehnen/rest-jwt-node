const http = require('http');
const mongoose = require('mongoose');
const app = require('./app');
const port = process.env.port || 8080;

const server = http.createServer(app);

mongoose.connect('mongodb://localhost:27017/potatis', {useNewUrlParser: true});


const Cat = mongoose.model('Cat', { name: String });

const kitty = new Cat({ name: 'Zildjian' });
kitty.save().then(() => console.log('meow'));

server.listen(port);