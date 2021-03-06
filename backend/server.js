const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const compression = require('compression');

let Todo = require('./todo.model');

const PORT = process.env.PORT || 4000;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/todos';

app.use(compression());
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

let connectRetries = 0;

var connectWithRetry = function() {
  return mongoose.connect(MONGO_URL, { useNewUrlParser: true }).catch(function(err) {
    if (err) {
      let errorMsg = 'Failed to connect to mongo on startup - ';

      if (connectRetries > 5) {
        errorMsg += 'Retries exceeding - exiting...'
        console.error(errorMsg, err);
        process.exit(-1);
      }

      console.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
      connectRetries += 1;
      setTimeout(connectWithRetry, 5000);
    }
  });
};

connectWithRetry();

const connection = mongoose.connection;

connection.on('error', err => {
  console.error('Lost connection with Mongo', err);
});

connection.once('open', function() {
  console.log("MongoDB database connection established successfully");
});

const todoRoutes = express.Router();

todoRoutes.route('/').get(function(req, res) {
  Todo.find(function(err, todos) {
    if (err) {
      console.error(err);
    } else {
      res.json(todos);
    }
  });
});

todoRoutes.route('/:id').get(function(req, res) {
  let id = req.params.id;
  Todo.findById(id, function(err, todo) {
    res.json(todo);
  });
});

todoRoutes.route('/add').post(function(req, res) {
  let todo = new Todo(req.body);
  todo.save()
    .then(todo => {
      res.status(200).json({'todo': 'todo added successfully'});
    })
    .catch(err => {
      res.status(400).send('adding new todo failed');
    });
});

todoRoutes.route('/update/:id').post(function(req, res) {
  Todo.findById(req.params.id, function(err, todo) {
    if (!todo) {
      res.status(404).send("data is not found");
    } else {
      todo.todo_description = req.body.todo_description;
      todo.todo_responsible = req.body.todo_responsible;
      todo.todo_priority = req.body.todo_priority;
      todo.todo_completed = req.body.todo_completed;

      todo.save().then(todo => {
        res.json('Todo updated!');
      })
      .catch(err => {
        res.status(400).send("Update not possible");
      });
    }
  });
});

app.use('/todos', todoRoutes);

app.listen(PORT, function() {
  console.log("Server is running on port " + PORT);
});