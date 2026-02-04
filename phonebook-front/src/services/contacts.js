import axios from'axios'
const baseUrl = 'api/persons'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => {
        return response.data
    })
}

const create = newObject => {
    const request = axios.post(baseUrl, newObject)
    return request.then(response => {
        return response.data
    })
}

const remove = (id) => axios.delete(`${baseUrl}/${id}`)


const modify = newObject => {
    const request = axios.put(`${baseUrl}/${newObject.id}`, newObject)
    return request.then(response => {
        return response.data
    })
}

let exports = { getAll, create, remove, modify }

export default exports