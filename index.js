const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(morgan((tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ')
}))

app.get('/info', (request, response) => {
  Person.find({}).then(persons => {
    const currentDate = new Date().toLocaleString()
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

    response.setHeader('Content-Type', 'text/html')
    response.status(200).send(`
    <h1>Number of persons: ${persons.length}</h1>
    ${persons.map(person => `<p>${person.name}: ${person.number} - Date: ${currentDate} ${timeZone}</p>`).join('\n')}
  `)
  })
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  Person.findById(id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        return response.status(400).send({ error: 'malformatted id' })
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id

  Person.findByIdAndDelete(id)
    .then(deletedPerson => {
      if (deletedPerson) {
        response.json(deletedPerson)
      } else {
        response.status(404).json({ error: 'Person not found' })
      }
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  Person.findOne({ name: body.name })
    .then(existingPerson => {
      if (existingPerson) {
        return response.status(400).json({ error: 'Name must be unique' })
      }

      const newPerson = new Person({
        name: body.name,
        number: body.number,
        date: new Date().toLocaleString('en-US', { timeZone: 'Europe/Athens' })
      })

      return newPerson.save()
    })
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => {
      if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
      }
      console.error('Error creating person:', error.message)
      response.status(500).json({ error: 'Internal Server Error' })
    })
})

app.put('/api/persons/:id', async (request, response) => {
  const { name, number } = request.body

  if (!number) {
    return response.status(400).json({ error: 'number missing' })
  }
  try {
    const person = await Person.findOne({ _id: request.params.id })
    if (!person) {
      return response.status(404).json({ error: 'Person not found' })
    }

    person.name = name
    person.number = number

    const updatedPerson = await person.save()

    response.json(updatedPerson)
  } catch (error) {
    console.error('Error updating person:', error)
    response.status(500).json({ error: 'Internal Server Error' })
  }
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
