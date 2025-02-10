const baseUrl = import.meta.env.VITE_API_URL; 

const Endpoints = Object.freeze({
    login: `${baseUrl}/api/auth/login`,
    register: `${baseUrl}/api/auth/register`,
    getBoards: `${baseUrl}/api/board`,
    createUpdateTask: `${baseUrl}/api/tasks`,
    deleteTask: `${baseUrl}/api/tasks`,
    createList: `${baseUrl}/api/lists`,
    modifyList: `${baseUrl}/api/lists`,
    moveTask: `${baseUrl}/api/tasks/move`
})

export default Endpoints