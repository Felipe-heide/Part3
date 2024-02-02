import { useState } from 'react';
import Filter from './components/Filter';
import Notification from './components/Notification';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import { useEffect } from 'react';
import personService from './services/person'


const App = () => {


  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [newFilter, setNewFilter] = useState('');
  const [message, setMessage] = useState([null, null])

  const filteredPersons = newFilter === '' ? persons : persons.filter(person => person.name.toLowerCase().startsWith(newFilter.toLowerCase()));

  useEffect(() => { 
    personService.getAll().then(initialpersons => {setPersons(initialpersons)})
  }, [])


  const handleChangeName = (event) => setNewName(event.target.value);
  const handleChangeNumber = (event) => setNewNumber(event.target.value);
  const handleChangeFilter = (event) => setNewFilter(event.target.value);
  const handleDeletion = (id, name) => {
    const confirmed = window.confirm(`Delete ${name}?`);
  
    if (confirmed) {
      personService.remove(id)
        .then(() => personService.getAll())
        .then(updatedPersons => {
          setPersons(updatedPersons);
          setMessage(['success', 'Person deleted successfully']);
          setTimeout(() => setMessage([null, null]), 3000); 
        })
        .catch(error => {
          console.error('Error deleting person:', error);
          setMessage(['error', `Information of ${name} has already been removed from server`]);
          setTimeout(() => setMessage([null, null]), 3000); 
        });
    }
  };
  

  const handleSubmit = (event) => {
    event.preventDefault();
    const nameExists = persons.find(person => person.name === newName);
  
    if (nameExists) {
      const confirmed = window.confirm(`${nameExists.name} is already added to phonebook, replace the old number with a new one?`);
      if (confirmed) {
        const id = nameExists.id;
        let newObject = { ...nameExists, number: newNumber };
        personService.update(id, newObject)
          .then(() => personService.getAll())
          .then(updatedPersons => {
            setPersons(updatedPersons);
            setMessage(['success', 'Number updated successfully']);
            setTimeout(() => setMessage([null, null]), 3000); 
          })
          .catch(error => {
            console.error('Error updating number:', error);
            setMessage(['error', 'Error updating number']);
            setTimeout(() => setMessage([null, null]), 3000); 
          });
        return;
      }
    }
  
    const newPerson = { name: newName, number: newNumber, id: String(Math.max(0, ...persons.map(person => parseInt(person.id) || 0)) + 1) };
    setPersons(persons.concat(newPerson));
    personService.create(newPerson)
      .then(() => personService.getAll())
      .then(updatedPersons => {
        setPersons(updatedPersons);
        setMessage(['success', 'Person created successfully']);
        setTimeout(() => setMessage([null, null]), 3000); 

      })
      .catch(error => {
        console.error('Error creating person:', error);
        setMessage(['error', 'Error creating person']);
        setTimeout(() => setMessage([null, null]), 3000); 

      });
  };
  



  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={newFilter} onChange={handleChangeFilter} />
      <Notification message={message} />
      <h3>Add a new</h3>
      <PersonForm
        name={newName}
        number={newNumber}
        onNameChange={handleChangeName}
        onNumberChange={handleChangeNumber}
        onSubmit={handleSubmit}
      />

      <h3>Numbers</h3>
      <Persons persons={filteredPersons} handleDeletion={handleDeletion}/>
    </div>
  );
};

export default App;
