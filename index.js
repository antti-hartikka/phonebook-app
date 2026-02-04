require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.json())
app.use(express.static('phonebook-front/dist'))
const Person = require('./people')

const cors = require('cors')
app.use(cors())

const morgan = require('morgan')
app.use(morgan(function (tokens, req, res) {
  const list = [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms '
  ]
  if (tokens.method(req, res) === 'POST') {
    list.push(JSON.stringify(req.body))
  }
  return list.join(' ')
}))

app.get('/api/persons', (req, res) =>
  Person.find({}).then(p => res.json(p))
)

app.get('/api/persons/:id',
  (
    req,
    res,
    next
  ) =>
    Person.findById(req.params.id)
      .then(p => {
        if (p) {
          res.json(p)
        } else {
          res.status(404).end()
        }
      })
      .catch(error => next(error))
)

app.get('/info',
  (
    req,
    res,
    next
  ) => {
    Person.find({}).then(p => res.send(
      '<p>' + 'Phonebook has info for ' + p.length + ' people </p>' + new Date()
    ))
      .catch(error => next(error))
  })

app.delete('/api/persons/:id',
  (
    req,
    res,
    next
  ) => {
    Person.findByIdAndDelete(req.params.id)
      .then(() => {
        res.status(204).end()
      })
      .catch(error => next(error))
  })

app.post('/api/persons',
  (
    req,
    res,
    next
  ) => {
    const body = req.body

    if (!body.name || !body.number) {
      return res.status(400).json({
        error: 'name or number missing'
      })
    }
    Person.find({})
      .then(persons => {
        if (!persons.every(p => p.name !== body.name)) {
          return res.status(400).json({
            error: 'name must be unique'
          })
        }
      })
      .catch(error => next(error))

    const person = new Person({
      name: body.name,
      number: body.number,
    })
    person.save()
      .then(savedPerson => {
        res.json(savedPerson)
      })
      .catch(error => next(error))
  })

app.put('/api/persons/:id',
  (
    req,
    res,
    next
  ) => {
    const body = req.body
    const person = {
      name: body.name,
      number: body.number
    }
    Person.findByIdAndUpdate(req.params.id, person, {new: true})
      .then(updatedPerson => {
        res.json(updatedPerson)
      })
      .catch(error => next(error))
  })

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({error: 'malformatted id'})
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({error: error.message})
  }

  next(error)
}

app.use(errorHandler)