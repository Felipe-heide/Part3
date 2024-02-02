const express = require('express');
var morgan = require('morgan')
const cors = require('cors')

const app = express();

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456",
    "date": new Date().toLocaleString('en-US', { timeZone: 'Europe/Athens' })
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523",
    "date": new Date().toLocaleString('en-US', { timeZone: 'Europe/Athens' })
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345",
    "date": new Date().toLocaleString('en-US', { timeZone: 'Europe/Athens' })
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122",
    "date": new Date().toLocaleString('en-US', { timeZone: 'Europe/Athens' })
  }
];

app.use(cors())
app.use(express.json());
app.use(morgan('tiny')); 

morgan.token('Object', function (req, res) { 

    return `${JSON.stringify(req.body)}`
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :Object'))

app.get('/info', (request, response) => {
  const numberOfPersons = persons.length;

  response.setHeader('Content-Type', 'text/html');
  response.send(`
    <h1>Number of persons: ${numberOfPersons}</h1>
    ${persons.map(person => `<p>${person.name}: ${person.number} - Date: ${person.date}</p>`).join('\n')}
  `);
});

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);
  
    if (person) {
      response.json(person);
    } else {
      response.status(404).json({ error: 'Person not found' });
    }
  });

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const personIndex = persons.findIndex(person => person.id === id);
  
    if (personIndex !== -1) {
        const deletedPerson = persons.splice(personIndex, 1)[0];
        response.status(200).json(deletedPerson); 
    } else {
      response.status(404).json({ error: 'Person not found' });
    }
  });
  

  

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number missing' 
    });
  }else if(persons.some(person => person.name === body.name)){
    return response.status(400).json({ 
         error: 'name must be unique' 
      });
  }

  const newPerson = {
    name: body.name,
    number: body.number,
    date: new Date().toLocaleString('en-US', { timeZone: 'Europe/Athens' }),
    id: generateId(),
  };

  persons = persons.concat(newPerson);

  response.json(newPerson);
});

const generateId = () => Math.random() * 1e10

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
