import React, {useState, useEffect} from 'react'
import Contacts from "./Components/Contacts"
import contacts from "./services/contacts"

const Notification = ({message, style}) => {
    if (message === null) {
        return null
    }

    return (
        <div style={style}>
            {message}
        </div>
    )
}

const Filter = (props) => {
    return (
        <div>
            filter shown with
            <input
                value={props.filter}
                onChange={props.handleFilterChange}
            />
        </div>
    )
}

const PersonForm = (props) => {
    return (
        <form onSubmit={props.addContact}>
            <div>
                name:
                <input
                    value={props.newName}
                    onChange={props.handleNameChange}
                />
            </div>
            <div>number:
                <input
                    value={props.newNumber}
                    onChange={props.handleNumberChange}
                />
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}

const App = () => {
    const greenMessage = {
        color: 'green',
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    }
    const redMessage = {
        color: 'red',
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    }
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [filter, setFilter] = useState('')
    const [message, setMessage] = useState(null)
    const [messageStyle, setMessageStyle] = useState(greenMessage)

    const addContact = (event) => {
        event.preventDefault()
        if (persons.every(p => p.name !== newName)) {
            contacts
                .create({name: newName, number: newNumber})
                .then(response => {
                    setPersons(persons.concat(response))
                    setMessageStyle(greenMessage)
                    setMessage(`Added ${response.name}`)
                    setTimeout(() => {
                        setMessage(null)
                    }, 5000)
                })
        } else {
            if (window.confirm(
                `${newName} is already added to phonebook, replace the old number with new one?`
            )) {
                contacts
                    .modify({
                        name: newName,
                        number: newNumber,
                        id: persons
                            .filter(p => p.name === newName)
                            .map(p => p.id)[0]
                    })
                    .then(data => setPersons(persons.map(p => p.id !== data.id ? p : data)))
                    .catch(error => {
                        setMessageStyle(redMessage)
                        setMessage(`Information of ${newName} has already been removed from server`)
                        setTimeout(() => {
                            setMessage(null)
                        }, 5000)
                        setPersons(persons.filter(p => p.name !== newName))
                    })
            }
        }
        setNewName('')
        setNewNumber('')
    }

    const handleNameChange = (event) => setNewName(event.target.value)

    const handleNumberChange = (event) => setNewNumber(event.target.value)

    const handleFilterChange = (event) => setFilter(event.target.value)

    const handlePersonRemoval = (id) => {
        contacts.remove(id)
        setPersons(persons.filter(p => p.id !== id))
    }

    const hook = () => contacts.getAll().then(data => {
        setPersons(data)
    })

    useEffect(hook, [])

    return (
        <div>
            <h1>Phonebook</h1>
            <Notification message={message} style={messageStyle}/>
            <Filter
                filter={filter}
                handleFilterChange={handleFilterChange}
            />
            <h2>add a new</h2>
            <PersonForm
                addContact={addContact}
                newName={newName}
                handleNameChange={handleNameChange}
                newNumber={newNumber}
                handleNumberChange={handleNumberChange}
            />
            <h2>Numbers</h2>
            <Contacts
                contacts={persons}
                filter={filter}
                removeButtonHandler={handlePersonRemoval}
            />
        </div>
    )

}

export default App