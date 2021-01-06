const form = document.querySelector('form');
const todoDescInput = document.querySelector('#todoDesc');
const todoBtnForm = document.querySelector('#todoBtn');
const deadline = document.querySelector('#deadline');
const todoList = document.querySelector('.todoList');

let todoDiv = document.createElement('div');

let allTodos = [];

function TodoItem(desc, deadline) {
    this.description = desc;
    this.deadline = deadline;
    this.timeRemaining = (deadline) ? getTimeRemaining(deadline).timeRemaining : '';
    this.unixTime = (deadline) ? getTimeRemaining(deadline).unixTime : Number.MAX_SAFE_INTEGER;
    this.completed = false;

  };
  
 const getTimeRemaining = deadline => {
        const dateFuture = Date.parse(deadline);
        const dateNow = Date.parse(new Date());

        if(!deadline || dateFuture == dateNow) {
            return '';
        }
        
        if (dateFuture - dateNow < 0){
            return `Due date has passed!`
        } else {
            let unixTime = Math.floor((dateFuture - (dateNow))/1000);
            let minutes = Math.floor(unixTime/60);
            let hours = Math.floor(minutes/60);
            let days = Math.floor(hours/24);
            
            hours = hours-(days*24);
            minutes = minutes-(days*24*60)-(hours*60);
            seconds = unixTime-(days*24*60*60)-(hours*60*60)-(minutes*60);

            const timeRemaining = `Time left to complete the task:<br> ${days} days, ${hours} hours and ${minutes} minutes`
        
            return { timeRemaining, unixTime}
        }
  
};

// SORTING ORDER //

const sortTodos = () => {
    if (sortDropdown.value == '2') {
      sortByTimeLeft();
    } else if (sortDropdown.value == '3') {
      sortByCompletedItems();
    } else {
        return;
    }
  }

const sortByTimeLeft = () => {
    allTodos.sort((a, b) => (a.unixTime > b.unixTime) ? 1 : -1);
    reloadTodos()
}

const sortByCompletedItems = () => {
    allTodos.sort((a, b) => (a.completed) ? -1 : 1);
    reloadTodos()
}


const sortDropdown = document.querySelector('#sortDropdown');
sortDropdown.addEventListener('click', sortTodos);


// ACTIONS WITH TO-DOS //

const addTodo = (event) => {
    event.preventDefault()
    let todoItem = new TodoItem(todoDescInput.value, deadline.value);
    allTodos.push(todoItem);
    saveToStorage(allTodos);
    reloadTodos()
    form.reset()
}

const showTodos = (todos) => {
    for(let i = 0; i < todos.length; i++){
        let todoLi = document.createElement('li');
        todoLi.innerHTML = listItemTemplate(todos[i], i);
        todoDiv.appendChild(todoLi);
        todoList.appendChild(todoDiv);

        if (todos[i].completed) {
            document.querySelector(`#todoDesc_${i}`).classList.add('completed');
            document.querySelector(`#todoCheckbox_${i}`).checked = true;
        }
    }
}


const reloadTodos = () => {
    todoDiv.innerHTML = "";
    showTodos(allTodos);
}

const deleteTodo = (todoItemIndex) => {
    if (confirm('Are you sure you want to delete this item?')) {
        allTodos = allTodos.filter(item => allTodos.indexOf(item) !== todoItemIndex);
        saveToStorage(allTodos);
        reloadTodos()
      } else {
        // Do nothing!
      }
}

const checkedTodo = (todoItemIndex) => {
    const todoCheckbox = document.querySelector(`#todoCheckbox_${todoItemIndex}`);
    const todoDescH = document.querySelector(`#todoDesc_${todoItemIndex}`);
    if (todoCheckbox.checked) {
        allTodos[todoItemIndex].completed = true;  
        const checkedItem = allTodos.splice(todoItemIndex, 1);
        allTodos.push(checkedItem[0]);
        saveToStorage(allTodos);
        reloadTodos()
      } else {
        todoDescH.classList.remove('completed');
        allTodos[todoItemIndex].completed = false; 
      }
}


// HTML TEMPLATE FOR LIST ITEM //

const listItemTemplate = (item, i) => {
    return `
        <div class="container">
            <input class="checkbox" type="checkbox" onclick="checkedTodo(${i})" id="todoCheckbox_${i}"/>
            <h1 class="todoDescList" id="todoDesc_${i}">${item.description}</h1>
            <h3 class="todoDeadlineList">${item.timeRemaining}</h3>
            <button class="btn" onclick="deleteTodo(${i})">Delete</button>
        </div>
    `
    
}

// SESSION STORAGE //
const saveToStorage = (todos) => {
    sessionStorage.setItem('todos', JSON.stringify(todos));
}

const showFromStorage = () => {
    if (sessionStorage.todos) {
        allTodos = JSON.parse(sessionStorage.getItem('todos'));
        showTodos(allTodos);
    } 
}

form.addEventListener("submit", addTodo);
window.addEventListener('load', (event) => {
    showFromStorage();
});

