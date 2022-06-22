import {useEffect, useState} from 'react'
import axios from 'axios'

import css from '../static/css/todo.module.css'

import deleteIcon from '../static/img/trashIcon.png'
import updateIcon from '../static/img/update.png'
import importantIcon from '../static/img/importantIcon.png'

const Todo = () => {
    const token = 'a5e98ae0a84af283aafe9d1c0ae98e628c8d445d'
    const projectId = 2293674408

    const [todos, setTodos] = useState([])

    // useState
    const [todoAddInput, setTodoAddInput] = useState('')
    const [listType, setListType] = useState('unfinished')

    useEffect(() => {
        const url = `https://api.todoist.com/rest/v1/tasks?project_id=${projectId}`
        axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => setTodos(res.data))
    }, [])

    const handleTypeChange = e => {
        if (e.target.dataset.type === 'unfinished') {
            const url = `https://api.todoist.com/rest/v1/tasks?project_id=${projectId}`
            axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(res => setTodos(res.data))
        } else {
            const url = `https://api.todoist.com/sync/v8/completed/get_all?project_id=${projectId}`
            axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(res => setTodos(res.data.items))
        }
        setListType(e.target.dataset.type)
    }

    // Functions
    const handleItemSubmit = e => {
        e.preventDefault()

        const url = `https://api.todoist.com/rest/v1/tasks?project_id=${projectId}`
        axios.post(url, {
            content: todoAddInput
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => setTodos(prevList => [...prevList, res.data]))
        setTodoAddInput('')
    }

    const handleToggleDone = ({id, task_id}) => {
        const url = `https://api.todoist.com/rest/v1/tasks/${task_id || id}/close`
        axios.post(url, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => setTodos(prevTodos => prevTodos.filter(el => el.id !== id)))
    }

    const handleToggleImportant = ({id}) => {
        setTodos(prevTodos => prevTodos.map(el => el.id === id ? {...el, important: !el.important} : el))
    }

    const handleDeleteItem = ({id}) => {
        setTodos(prevTodos => prevTodos.filter(el => el.id !== id))
    }

    const handleUpdateItem = ({id, task_id}) => {
        const url = `https://api.todoist.com/rest/v1/tasks/${task_id || id}/reopen`
        axios.post(url, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => {
            const url = `https://api.todoist.com/rest/v1/tasks?project_id=${projectId}`
            axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(res => {
                setTodos(res.data)
                setListType('unfinished')
            })
        })
    }

    const handleInputChange = e => {
        setTodoAddInput(e.target.value)
    }

    return (
        <main id={css.todoBody}>
            <h1>ToDo list</h1>
            <section id={css.userControllers}>
                <div className={`${css.container} container`}>
                    <div className={`${css.todoBlock} ${css.forms}`}>
                        <form id={css.addTodo} onSubmit={handleItemSubmit}>
                            <input id={css.addTodoInput} value={todoAddInput} onChange={handleInputChange}
                                   maxLength={'80'} type="text"/>
                            <button type="submit">Add</button>
                        </form>
                    </div>
                    <div className={css.todoBlock}>
                        <div className={css.controllerBtns}>
                            <button onClick={handleTypeChange} data-type={'unfinished'}>Unfinished</button>
                            <button onClick={handleTypeChange} data-type={'finished'}>Finished</button>
                        </div>
                    </div>
                </div>
            </section>
            <section id={css.todoList}>
                <div className="container">
                    <div className={`${css.unfinishedList} ${css.categoryList}`}>
                        <ul>
                            {
                                todos.map(el => {
                                    return (
                                        <li key={el.id}
                                            className={`${el.completed_date ? css.completed : ''} ${el.important ? css.important : ''}`}>
                                                <span className={css.listContent}
                                                      onClick={() => handleToggleDone(el)}>{el.completed_date ? '‣' : ''} {el.content}</span>
                                            <div className={css.listBtns}>
                                                {
                                                    listType === 'unfinished'
                                                        ? <img className={css.importantIcon}
                                                             onClick={() => handleToggleImportant(el)} src={importantIcon}
                                                             alt="Important"/>
                                                        : <img className={css.updateIcon}
                                                             onClick={() => handleUpdateItem(el)}
                                                             src={updateIcon} alt="Update"/>
                                                }
                                                <img className={css.deleteIcon}
                                                     onClick={() => handleDeleteItem(el)}
                                                     src={deleteIcon} alt="Delete"/>
                                            </div>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Todo