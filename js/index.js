const form = document.querySelector('form');
const todoDesc = document.querySelector('#todoDesc');
const todoBtn = document.querySelector('#todoBtn');
const deadline = document.querySelector('#deadline');
const todoList = document.querySelector('.todoList');

let todoDiv = document.createElement('div');

let allTodos = [];

function TodoItem(desc, deadline, timeLeft) {
    this.description = desc;
    this.deadline = deadline;
    this.timeLeft = timeLeft;
};

const getTimeRemaining = deadline => {
    const dateFuture = Date.parse(deadline);
    const dateNow = Date.parse(new Date());
    
    if (dateFuture - dateNow < 0){
        return `Due date has passed!`
    } else {
        let timeInSec = Math.floor((dateFuture - (dateNow))/1000);
        let minutes = Math.floor(timeInSec/60);
        let hours = Math.floor(minutes/60);
        let days = Math.floor(hours/24);
        
        hours = hours-(days*24);
        minutes = minutes-(days*24*60)-(hours*60);
        seconds = timeInSec-(days*24*60*60)-(hours*60*60)-(minutes*60);
    
        return {
            timeInSec, seconds, minutes, hours, days
        }
    }
  };

const addTodo = (event) => {

    // event.preventDefault()

    let todoItem = new TodoItem(todoDesc.value, deadline.value, getTimeRemaining(deadline.value).timeInSec);
    allTodos.push(todoItem);
    saveToStorage(allTodos);
    showFromStorage();
    form.reset()
}

const deleteTodo = (todoItemIndex) => {
    if (confirm('Are you sure you want to delete this item?')) {
        allTodos = allTodos.filter(item => allTodos.indexOf(item) !== todoItemIndex);
        saveToStorage(allTodos);
        todoDiv.innerHTML = "";
        showFromStorage();
      } else {
        // Do nothing!
      }
}

const saveToStorage = (todos) => {
    sessionStorage.setItem('todos', JSON.stringify(todos));
}

const sortByTimeRemaining = todos => {
    for(let i = 0; i < todos.length; i++){
        getTimeRemaining(todos[i].deadline)
    }
}


const showFromStorage = () => {
    if (sessionStorage.todos) {
        allTodos = JSON.parse(sessionStorage.getItem('todos'));
        for(let i = 0; i < allTodos.length; i++){
            const timeRemaining = getTimeRemaining(allTodos[i].deadline);
            let todoLi = document.createElement('li');
            todoLi.innerHTML = 

            `<input type="checkbox" id="todoCheck"/>
            <h1>${allTodos[i].description}</h1>
            <p>Time left: ${timeRemaining.days} days, ${timeRemaining.hours} hours and ${timeRemaining.minutes} minutes</p>
            <button onclick="deleteTodo(${i})">Delete</button>
            
            `
            todoDiv.appendChild(todoLi);
            todoList.append(todoDiv);
        }

    } else {

    }
}

form.addEventListener("submit", addTodo);
showFromStorage();
