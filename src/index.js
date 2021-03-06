import css from './styles.css'

let currentUser
let todos = []
let sharedUsers = []
const externalUsers = []
let currentViewMode = 'Login'
let timeoutId
let nextId = 0


function createElement(tagName) {
  return document.createElement(`${tagName.toUpperCase()}`)
}

async function callApi(type, customBody = null, additionalPath = '/') {
  let response
  const token = localStorage.getItem('token')
  if (type === 'GET' || type === 'HEAD') {
    response = await fetch(`http://localhost:9999${additionalPath}`, {
      method: type,
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: `${token}`,
      },
    })
  } else {
    response = await fetch(`http://localhost:9999${additionalPath}`, {
      method: type,
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: `${token}`,
      },
      body: JSON.stringify(customBody),
    })
  }
  return response
}
function fetchData(todosCopy = null) {
  console.log('fetching')
  let isResponseOk = false
  callApi('GET')
    .then((response) => {
      isResponseOk = response.ok
      console.log('isResponseOk')
      console.log(isResponseOk)
      return response.json()
    })
    .then((result) => {
      console.log('fetch result: ')
      console.log(result)
      if (isResponseOk) {
        console.log(result)
        sharedUsers = result.sharedUsers
        todos = result.todos
        currentUser = result.login
        localStorage.setItem('token', `Bearer ${result.token}`)
        currentViewMode = 'All'
        console.log(todos)
        render()
      } else {
        todos = []
        sharedUsers = []
        currentUser = ''
        currentViewMode = 'Login'
        console.log(currentViewMode)
        render()
      }
    })
    .catch((err) => {
      currentViewMode = 'Login'
    })
  render()
}

async function addToDB(todoTitle, todosCopy = [...todos]) {
  let isResponseOk = false
  callApi('POST', { title: todoTitle, owner: currentUser }).then((response) => {
    isResponseOk = response.ok
    response.json()
  }).then((result) => {
    if (isResponseOk) {
      fetchData(todosCopy)
    } else {
      currentViewMode = 'Login'
    }
  }).catch((err) => console.log(err))
}

async function addSharedUserToDB(user, todosCopy = [...todos]) {
  try {
    // const isResponseOk = false
    const response = await callApi('PUT', { user }, '/user/addSharedUser')
    console.log(response)
  } catch (e) {
    console.log(e)
  }
  //   .then((response) => {
  //   isResponseOk = response.ok
  //   console.log(isResponseOk)
  //   response.json()
  // }).then((result) => {
  //   if (isResponseOk) {
  //     console.log('response is ok')
  //   } else {
  //     console.log('response isnt ok')
  //     currentViewMode = 'Login'
  //   }
  // }).catch((e) => console.log(e))
}

async function removeFromDB(id, todosCopy) {
  callApi('DELETE', { _id: `${id}` }).then((response) => response.json()).catch((err) => console.log(err))
  fetchData(todosCopy)
}

async function updateInDB(idToUpdate, newProp, todosCopy) {
  callApi('PUT', { _id: idToUpdate, updKeyValue: newProp }).then((response) => response.json()).catch((err) => console.log(err))
  fetchData(todosCopy)
}

async function login(usersLogin, usersPassword) {
  callApi('POST', { login: usersLogin, password: usersPassword }, '/signUp').then((response) => response.text()).then((result) => {
    if (result !== 'Forbidden') {
      localStorage.setItem('token', `Bearer ${result}`)
      currentUser = usersLogin
      console.log(currentUser)
      fetchData()
    } else {
      throw new Error('Invalid token')
    }
  }).catch((err) => console.log(err))
}

function updateItemsLeft(todosArr) {
  let left = 0
  todosArr.forEach((todo) => {
    if (!todo.isCompleted) {
      left += 1
    }
  })
  if (left === 1) {
    document.querySelector('.quantity').innerText = '1 item left'
  } else {
    document.querySelector('.quantity').innerText = `${todosArr.filter((todo) => todo.isCompleted === false).length} items left`
  }
}

function updateTodo(event) {
  console.log('closest span')
  console.log(event.target.closest('li').querySelector('.owner').innerText.split(' ')[1])
  const owner = event.target.closest('li').querySelector('.owner').innerText.split(' ')[1]
  console.log(todos)
  if (owner === 'You') {
    const reserveCopy = [...todos]
    const indexToUpdate = todos.findIndex(
      (todo) => {
        console.log(event.target.closest('li'))
        return todo._id === event.target.closest('li').id
      },
    )
    console.log(indexToUpdate)
    const updatingInputContainer = createElement('div')
    updatingInputContainer.classList.add('updating-input-container')
    const updatingInput = createElement('input')
    updatingInput.type = 'text'
    updatingInput.value = event.target.innerText
    const submitButton = createElement('button')
    submitButton.type = 'button'
    submitButton.classList.add('submit-button')
    submitButton.innerHTML = '&#10004;'
    const cancelButton = createElement('button')
    cancelButton.type = 'button'
    cancelButton.classList.add('cancel-button')
    cancelButton.innerHTML = '&times'
    updatingInputContainer.append(updatingInput, submitButton, cancelButton)
    event.target.replaceWith(updatingInputContainer)
    updatingInput.focus()
    submitButton.addEventListener('click', () => {
      if (indexToUpdate + 1) {
        todos[indexToUpdate].title = updatingInput.value
        console.log(todos[indexToUpdate].title)
        updateInDB(todos[indexToUpdate]._id, { title: todos[indexToUpdate].title })
        render(todos, currentViewMode)
      }
    })
    cancelButton.addEventListener('click', () => {
      render(todos, currentViewMode)
    })
  }
}

function filter(viewMode) {
  switch (viewMode) {
    case 'All':
      currentViewMode = 'All'
      console.log(document.querySelector('.active'))
      document.querySelectorAll('.active').forEach((node) => {
        node.classList.remove('active')
      })
      document.querySelector('.filter-button-all').classList.add('active')
      render(todos, currentViewMode)
      break
    case 'Active':
      currentViewMode = 'Active'
      console.log(document.querySelector('.active'))
      document.querySelectorAll('.active').forEach((node) => {
        node.classList.remove('active')
      })
      document.querySelector('.filter-button-active').classList.add('active')
      render(todos, currentViewMode)
      break
    case 'Completed':
      currentViewMode = 'Completed'
      console.log(document.querySelector('.active'))
      document.querySelectorAll('.active').forEach((node) => {
        node.classList.remove('active')
      })
      document.querySelector('.filter-button-completed').classList.add('active')
      render(todos, currentViewMode)
      break
    default:
      break
  }
}

async function addSharedUser(newUser) {
  sharedUsers.push(newUser)
  render() // delete after correct renderin of added users
  await addSharedUserToDB(newUser)
  await fetchData()
  render()
  // add apis call
}

function fillSharedUsersList(user) {
  const sharedUser = createElement('li')
  sharedUser.innerText = user
  return sharedUser
}

function logout() {
  localStorage.removeItem('token')
  currentViewMode = 'Login'
  render()
}

function addEventListeners(viewMode = currentViewMode) {
  if (viewMode !== 'Login') {
    let isDoubleClick

    document.querySelector('.logout-button').addEventListener('click', logout)

    document.querySelector('.input-field').addEventListener('keydown', addTodo)

    document.querySelector('.add-shared-user-input').addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        console.log('added')
        addSharedUser(event.target.value)
      }
    })

    // document.querySelectorAll('input[type=checkbox]').addEventListener('click', (event) => {
    //   event.preventDefault()
    // })

    const titleSpans = document.querySelectorAll('.title-span')
    titleSpans.forEach((span) => {
      span.addEventListener('click', (event) => {
        timeoutId = setTimeout(() => toggleReadyState(event), 200)
      })
    })
    titleSpans.forEach((span) => {
      span.addEventListener('dblclick', (event) => {
        clearTimeout(timeoutId)
        clearTimeout(timeoutId - 1)
        updateTodo(event)
      })
    })

    const removeButtons = document.querySelectorAll('.remove-button')
    removeButtons.forEach((button) => {
      button.addEventListener('click', removeTodo)
    })

    const filterAllButton = document.querySelector('.filter-button-all')
    filterAllButton.addEventListener('click', () => filter('All'))

    const filterActiveButton = document.querySelector('.filter-button-active')
    filterActiveButton.addEventListener('click', () => filter('Active'))

    const filterCompletedButton = document.querySelector('.filter-button-completed')
    filterCompletedButton.addEventListener('click', () => filter('Completed'))

    document.querySelector('.clear-completed-button').addEventListener('click', clearCompleted)
  } else {
    document.querySelector('.login-button').addEventListener('click', (event) => {
      login(document.querySelector('.login-field').value, document.querySelector('.password-field').value)
    })
    document.addEventListener('keydown', (event) => {
      if (currentViewMode === 'Login' && event.key === 'Enter') {
        console.log('bingo')
        login(document.querySelector('.login-field').value, document.querySelector('.password-field').value)
      }
    })
  }
}

function fillTodoList(todo, index, todoList) {
  const todoItem = createElement('li')
  todoItem.id = todo._id || null
  const titleBox = createElement('div')
  titleBox.classList.add('connector')
  todoItem.classList.add('todo-item')
  const checkbox = createElement('input')
  checkbox.type = 'checkbox'
  checkbox.id = `checkbox_${todo._id}`
  checkbox.checked = todo.isCompleted
  checkbox.classList.add('checkbox')

  const todoTitle = createElement('span')
  todoTitle.classList.add('title-span')
  if (todo.isCompleted) {
    todoTitle.classList.add('completed')
  }
  todoTitle.innerText = todo.title

  const owner = createElement('span')
  owner.classList.add('owner')
  owner.innerText = `owner: ${todo.owner === currentUser ? 'You' : todo.owner}`

  const removeButton = createElement('button')
  removeButton.innerHTML = '&times'
  removeButton.classList.add('remove-button')
  removeButton.type = 'button'

  const ownerRemoverBox = createElement('div')
  ownerRemoverBox.append(owner, removeButton)

  titleBox.append(checkbox, todoTitle)
  todoItem.append(titleBox, ownerRemoverBox)

  todoList.append(todoItem)
  // addSrc(todo, index, todoItem);
}

function renderLoginForm() {
  // if (document.body.firstChild) {
  //   while (document.body.firstChild) {
  //     document.body.removeChild(document.body.firstChild)
  //   }
  // }
  const container = createElement('section')
  container.classList.add('login-form-container')
  const loginLabel = createElement('label')
  loginLabel.innerText = 'Login: '
  const loginField = createElement('input')
  loginField.classList.add('login-field')
  loginField.type = 'email'
  loginLabel.append(loginField)
  const passwordLabel = createElement('label')
  passwordLabel.innerText = 'Password: '
  const passwordField = createElement('input')
  passwordField.type = 'password'
  passwordField.classList.add('password-field')
  passwordLabel.append(passwordField)
  const inputsContainer = createElement('div')
  inputsContainer.classList.add('inputs-container')
  inputsContainer.append(loginLabel, passwordLabel)
  const loginButton = createElement('button')
  loginButton.type = 'button'
  loginButton.innerText = 'Submit'
  loginButton.classList.add('login-button')
  container.append(inputsContainer, loginButton)
  document.body.append(container)
}

function renderTodos(todosArr = todos, viewMode = currentViewMode) {
  // if (document.querySelector('ul')) {
  //   while (document.querySelector('ul').firstChild) {
  //     document.querySelector('ul').removeChild(document.querySelector('ul').firstChild)
  //   }
  // }

  // if (document.querySelector('ul')) {
  //   while (document.querySelector('ul').firstChild) {
  //     document.querySelector('ul').removeChild(document.querySelector('ul').firstChild)
  //   }
  // }


  const mainContainer = document.querySelector('.main-container') || createElement('section')
  if (!document.querySelector('.main-container')) {
    mainContainer.classList.add('main-container')
  }
  const inputField = document.querySelector('.input-field') || createElement('input')
  if (!document.querySelector('.input-field')) {
    inputField.classList.add('input-field')
    inputField.type = 'text'
  }
  const todosContainer = document.querySelector('.todos-container') || createElement('div')
  if (!document.querySelector('.todos-container')) {
    todosContainer.classList.add('todos-container')
  }
  const todoList = document.querySelector('.todo-list') || createElement('ul')
  if (!document.querySelector('.todo-list')) {
    todoList.classList.add('todo-list')
  }
  const bottomPanel = document.querySelector('.botom-panel') || createElement('div')
  if (!document.querySelector('.botom-panel')) {
    bottomPanel.classList.add('botom-panel')
  }

  const itemsLeft = document.querySelector('.quantity') || createElement('span')
  if (!document.querySelector('.quantity')) {
    itemsLeft.classList.add('quantity')
  }

  const buttonsContainer = document.querySelector('.filter-buttons-container') || createElement('div')
  if (!document.querySelector('.filter-buttons-container')) {
    buttonsContainer.classList.add('filter-buttons-container')
  }
  const showAllButton = document.querySelector('.filter-button-all') || createElement('button')
  if (!document.querySelector('.filter-button-all')) {
    showAllButton.type = 'button'
    showAllButton.classList.add('filter-button-all')
    showAllButton.innerText = 'All'
  }
  const showActiveButton = document.querySelector('.filter-button-active') || createElement('button')
  if (!document.querySelector('.filter-button-active')) {
    showActiveButton.type = 'button'
    showActiveButton.classList.add('filter-button-active')
    showActiveButton.innerText = 'Active'
  }

  const showCompletedButton = document.querySelector('.filter-button-completed') || createElement('button')
  if (!document.querySelector('.filter-button-completed')) {
    showCompletedButton.type = 'button'
    showCompletedButton.classList.add('filter-button-completed')
    showCompletedButton.innerText = 'Completed'
    buttonsContainer.append(showAllButton, showActiveButton, showCompletedButton)
  }

  const clearCompletedButton = document.querySelector('.clear-completed-button') || createElement('button')
  if (!document.querySelector('.clear-completed-button')) {
    clearCompletedButton.type = 'button'
    clearCompletedButton.classList.add('clear-completed-button')
    clearCompletedButton.innerText = 'Clear Completed'
    bottomPanel.append(itemsLeft, buttonsContainer, clearCompletedButton)
  }
  const shareListContainer = createElement('div')
  shareListContainer.classList.add('share-list-container')
  const shareList = createElement('ul')
  shareList.classList.add('share-list')

  sharedUsers.forEach((user) => {
    shareList.append(fillSharedUsersList(user))
  })

  const addSharedUserInput = createElement('input')
  addSharedUserInput.type = 'text'
  addSharedUserInput.classList.add('add-shared-user-input')
  addSharedUserInput.placeholder = 'Add shared user'
  shareListContainer.append(addSharedUserInput, shareList)

  const logoutSection = createElement('section')
  logoutSection.classList.add('logout-section')
  const currentUserSpan = createElement('span')
  currentUserSpan.classList.add('current-user-span')
  currentUserSpan.innerText = currentUser
  const logoutButton = createElement('button')
  logoutButton.classList.add('logout-button')
  logoutButton.type = 'button'
  logoutButton.innerText = 'Log Out'
  logoutSection.append(currentUserSpan, logoutButton)

  mainContainer.append(inputField, todosContainer, bottomPanel)
  document.body.append(logoutSection, mainContainer, shareListContainer)

  if (viewMode === 'All') {
    todosArr.forEach((todo, index) => {
      showAllButton.classList.add('active')
      fillTodoList(todo, index, todoList)
    })
  } else if (viewMode === 'Active') {
    showActiveButton.classList.add('active')
    todos.forEach((todo, index) => {
      if (!todo.isCompleted) {
        fillTodoList(todo, index, todoList)
      }
    })
  } else if (viewMode === 'Completed') {
    showCompletedButton.classList.add('active')
    todos.forEach((todo, index) => {
      if (todo.isCompleted) {
        fillTodoList(todo, index, todoList)
      }
    })
  }
  todosContainer.append(todoList)
  updateItemsLeft(todos)
}

function render(todosArr = todos, viewMode = currentViewMode) {
  console.log(localStorage.getItem('token'))
  if (document.body.firstChild) {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild)
    }
  }

  if (viewMode !== 'Login') {
    renderTodos()
  } else {
    renderLoginForm()
  }
  addEventListeners()
}

function addTodo(event) {
  const reserveCopy = [...todos]
  if (event.key === 'Enter') {
    const newTodo = {
      title: event.target.value,
      isCompleted: false,
      id: nextId,
      owner: currentUser,
    }
    todos.push(newTodo)
    render(todos, currentViewMode)
    updateItemsLeft(todos)
    nextId += 1
    console.log(`title: ${event.target.value}`)
    addToDB(event.target.value, reserveCopy)
    event.target.value = ''
    event.target.focus()
    fetchData()
    render(todos)
  }
}

async function removeTodo(event) {
  const reserveCopy = [...todos]
  const index = todos.findIndex((todo) => todo._id === event.target.closest('LI').id)
  const idToDelete = todos[index]._id
  console.log(event.target.closest('LI').id)
  if (index + 1) {
    console.log(event.target.closest('LI'))
    todos.splice(index, 1)
    render(todos, currentViewMode)

    await removeFromDB(idToDelete, reserveCopy)
    // if ((todos.findIndex(todo => todo._id === index) + 1)) {
    render(todos, currentViewMode)
    // }
  }
}


function clearCompleted() {
  const reserveCopy = [...todos]
  todos = todos.filter((todo) => !todo.isCompleted === true)
  render(todos, currentViewMode)
  reserveCopy.forEach((todo) => {
    if (todo.isCompleted) {
      removeFromDB(todo._id, reserveCopy)
    }
  })
}


function toggleReadyState(event) {
  const reserveCopy = [...todos]
  let isChoosenCompleted = false
  console.log(event.target.closest('LI'))
  const choosenIndex = todos.findIndex((todo) => {
    if (todo._id === event.target.closest('LI').id) {
      isChoosenCompleted = todo.isCompleted
      return true
    }
    return false
  })
  console.log(choosenIndex)
  console.log(todos)
  if (isChoosenCompleted) {
    todos[choosenIndex].isCompleted = false
    updateInDB(todos[choosenIndex]._id, { isCompleted: false }, reserveCopy)
  } else {
    todos[choosenIndex].isCompleted = true
    updateInDB(todos[choosenIndex]._id, { isCompleted: true }, reserveCopy)
  }
  render(todos, currentViewMode)
}

document.addEventListener('DOMContentLoaded', async () => {
  await fetchData()
  render()
})
