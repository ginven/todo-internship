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
    this.timeRemaining = getTimeRemaining(deadline);

  };
  
 const getTimeRemaining = deadline => {
        if(!deadline) {
            return '';
        }
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
        
            return `Time left: ${days} days, ${hours} and ${minutes} minutes`
        }
  
};

const addTodo = (event) => {

    // event.preventDefault()

    let todoItem = new TodoItem(todoDescInput.value, deadline.value);
    allTodos.push(todoItem);
    saveToStorage(allTodos);
    showFromStorage();
    form.reset()
}

const sortByTimeLeft = () => {
    allTodos.sort((a, b) => {

    })
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

const checkedTodo = (todoItemIndex) => {
    const todoCheckbox = document.querySelector(`#todoCheckbox_${todoItemIndex}`);

    if (todoCheckbox.checked) {
        const checkedItem = allTodos.splice(todoItemIndex, 1);
        allTodos.push(checkedItem[0]);
        saveToStorage(allTodos);
        todoDiv.innerHTML = "";
        showFromStorage();
        const todoDescChecked = document.querySelector(`#todoDesc_${allTodos.length - 1}`);
        todoDescChecked.classList.add('completed');
      } else {
        todoDescH.classList.remove('completed');
      }
}

const saveToStorage = (todos) => {
    sessionStorage.setItem('todos', JSON.stringify(todos));
}

const listItemTemplate = (item, i) => {
    return `
        <div>
            <input type="checkbox" onclick="checkedTodo(${i})" id="todoCheckbox_${i}"/>
            <h1 id="todoDesc_${i}">${item.description}</h1>
            <h3>${item.timeRemaining}</h3>
            <button onclick="deleteTodo(${i})">Delete</button>
        </div>
    `
    
}


const showFromStorage = () => {
    if (sessionStorage.todos) {
        allTodos = JSON.parse(sessionStorage.getItem('todos'));
        for(let i = 0; i < allTodos.length; i++){

            let todoLi = document.createElement('li');
            todoLi.innerHTML = listItemTemplate(allTodos[i], i);
            todoDiv.appendChild(todoLi);
            todoList.appendChild(todoDiv);
        }

    } else {

    }
}

form.addEventListener("submit", addTodo);
showFromStorage();
