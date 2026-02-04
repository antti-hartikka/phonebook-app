import React from 'react'

const Contacts = ({contacts, filter, removeButtonHandler}) => {

    if (contacts.length === 0) {
        return (
            <div>

            </div>
        )
    } else {
        return (
            <ul>
                {contacts
                    .filter(c => c.name
                        .toLowerCase()
                        .includes(filter.toLowerCase()))
                    .map(c =>
                        <li key={c.name}>{c.name} {c.number}
                            <button onClick={() => {
                                if (window.confirm(`Delete ${c.name}?`)) {
                                    removeButtonHandler(c.id)
                                }
                            }} value={c.id}>
                                delete
                            </button>
                        </li>
                    )
                }
            </ul>
        )
    }
}

export default Contacts