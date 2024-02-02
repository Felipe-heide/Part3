const Persons = ({ persons, handleDeletion }) => {
  return (
    <div>
      {persons.map(person => {
        return(
        <div key={person.id}>
        <b>{person.name} {person.number}</b>
        <button onClick={() => handleDeletion(person.id, person.name)}>delete</button>
        </div>)
})}
    </div>
  );
};

export default Persons;
