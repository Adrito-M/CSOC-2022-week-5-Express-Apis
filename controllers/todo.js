const { ToDo } = require("../models");

const getAllToDo = async (req, res) => {

  const todos = await ToDo.find({createdBy: req.token.user})
  
  res.status(200).send(todos.map(todo => ({
      id: todo._id,
      title: todo.title,
  })))
};

const createToDo = async (req, res) => {

  if (!req.body.title) {
    res.status(400).send({message: "Title not found"})
    return
  }

  const newTodo = await ToDo.create({
    title: req.body.title,
    createdBy: req.token.user
  })

  res.status(200).send({
    id: newTodo._id,
    title: newTodo.title
  })
};

const getParticularToDo = async (req, res) => {
  const todo = await ToDo.findOne({createdBy: req.token.user, _id: req.params.id})
  if (!todo) {
    res.status(404).send({message: "No Todo found with id " + req.params.id})
    return
  }
  res.status(200).send({id: todo._id, title: todo.title})
};

const editToDo = async (req, res) => {
  if (!req.body.title) {
    res.status(400).send({message: "Title not found"})
  }

  const todo = await ToDo.findOne({createdBy: req.token.user, _id: req.params.id})

  if (!todo) {
    res.status(404).send({message: "No Todo found with id " + req.params.id})
    return
  }
  todo.title = req.body.title
  await todo.save()
  res.status(200).send({id: todo._id, title: todo.title})
};

const editToDoPatch = async (req, res) => {
  if (!req.body.title) {
    res.status(400).send({message: "Title not found"})
  }

  const todo = await ToDo.findOne({createdBy: req.token.user, _id: req.params.id})

  if (!todo) {
    res.status(404).send({message: "No Todo found with id " + req.params.id})
    return
  }
  todo.title = req.body.title
  await todo.save()
  res.status(200).send({id: todo._id, title: todo.title})
};

const deleteToDo = async (req, res) => {
  const todo = await ToDo.findOne({createdBy: req.token.user, _id: req.params.id})

  if (!todo) {
    res.status(404).send({message: "No Todo found with id " + req.params.id})
    return
  }

  await todo.delete()
  res.sendStatus(204)
};

module.exports = {
  createToDo,
  deleteToDo,
  editToDo,
  editToDoPatch,
  getAllToDo,
  getParticularToDo,
};
