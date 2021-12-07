const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const {username} = request.headers
  const customer = users.find(u => u.username === username)

  if (!customer){
    return response.json({error: 'user not found!'})
  }
  
  request.customer = customer
  
  next()
}

app.post('/users', (request, response) => {
  // Complete aqui
  const {name, username} = request.body;
  
  const userAlreadyExists = users.some(u => u.username === username)

  if(userAlreadyExists){
    return response.status(400).json({error: 'username already exists'})
  }
  
  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  };
  
  users.push(user);
  response.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {customer} = request
  return response.json(customer.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {title, deadline} = request.body;
  const { customer } = request
  
  const todo = { 
      id: uuidv4(), // precisa ser um uuid
      title,
      done: false, 
      deadline: new Date(deadline), 
      created_at: new Date()
  }

  customer.todos.push(todo);
  return response.status(201).json(todo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { customer } = request
  const {title, deadline} = request.body
  const {id} = request.params
  const todo = getTodoById(customer.todos, id)
  if(!todo){
    return response.status(404).json({error: 'Invalid TODO Id'})
  }
  todo.title = title
  todo.deadline = new Date(deadline)
  response.json(todo)
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {id} = request.params
  const { customer } = request
  const todo = getTodoById(customer.todos, id)
  if(!todo){
    return response.status(404).json({error: 'Invalid TODO Id'})
  }
  todo.done = true
  console.log(customer.todos);
  response.json(todo)
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {id} = request.params
  const { customer } = request
  const todo = getTodoById(customer.todos, id)
  if(!todo){
    return response.status(404).json({error: 'Invalid TODO Id'})
  }
  customer.todos.splice(todo, 1)
  response.status(204).json(customer.todos)
});

function getTodoById(todos, id){
  return todos.find(t => t.id == id)
}

module.exports = app;