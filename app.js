// Class Task: Creates a task
class Task {
    constructor(description, number) {
        this.description = description
        this.number = number
    }
}

// Class UI: Handles UI Elements
class UI {
    static displayTasks() {
        const tasks = Store.getTasks()

        tasks.forEach(task => UI.addTaskToList(task));
    }

    static addTaskToList(task) {
        let list, html

        list = document.querySelector('.task__list')

        html = `
        <div class="item clearfix" id="task-${task.number}">
            <div class="item__description">${task.description}</div>
            <div class="right clearfix">
                <div class="item__number">${task.number}</div>
                <div class="item__delete">
                    <button class="item__delete--btn red">
                        <i class="ion-ios-close-outline"></i>
                    </button>
                </div>
                <div class="item__complete">
                    <button class="item__complete--btn green">
                        <i class="ion-ios-checkmark-outline"></i>
                    </button>
                </div>
            </div>
        </div>
        `

        list.insertAdjacentHTML('beforeend', html)
    }

    static deleteTask(type, ID) {
        let el
        if(type.classList.contains('item__delete')) {           
            el = document.getElementById(ID)
            el.parentNode.removeChild(el)
            UI.showAlert('Task Removed', 'danger')
        }
        
    }

    static completeTask(type) {
        let el
        if(type.classList.contains('item__complete')) {
            el = type.parentNode.previousElementSibling
            el.classList.add('complete')
            UI.showAlert('Task Completed', 'info')
        }       
    }

    static showAlert(message, className) {
        const div = document.createElement('div')
        div.className = `alert alert-${className}`
        div.appendChild(document.createTextNode(message))
        const container = document.querySelector('.container')
        const form = document.querySelector('#task-form')
        container.insertBefore(div, form)
        setTimeout(() => document.querySelector('.alert').remove(), 3000)
    }

    static clearFields() {
        var fields, fieldsArray
            
        fields = document.querySelectorAll('#info' + ', ' + '#number')

        fieldsArray = Array.prototype.slice.call(fields)

        fieldsArray.forEach(function(current) {
            current.value = ""
        })

        fieldsArray[0].focus()
    }
}


// Class Storage: Handles Local Storage
class Store {
    static getTasks() {
        let tasks
        if(localStorage.getItem('tasks') === null) {
            tasks = []
        } else {
            tasks = JSON.parse(localStorage.getItem('tasks'))
        }

        return tasks
    }

    static addTask(task) {
        const tasks = Store.getTasks()

        tasks.push(task)

        localStorage.setItem('tasks', JSON.stringify(tasks))
    }

    static removeTask(number) {
        const tasks = Store.getTasks()

        tasks.forEach((task, index) => {
            if(task.number === number) {
                tasks.splice(index, 1)
            }
        })

        localStorage.setItem('tasks', JSON.stringify(tasks))
    }
}


//Event: Display Tasks
document.addEventListener('DOMContentLoaded', UI.displayTasks())

// Event: Add Task
document.querySelector('#task-form').addEventListener('submit', (e) => {
    e.preventDefault()

    //get form values
    const info = document.querySelector('#info').value
    const number = document.querySelector('#number').value

    //Validate
    if(info === '' || number === '') {
        UI.showAlert('Please Fill All Fields', 'danger')
    } else {
        //instantiate a task
        const task = new Task(info, number)

        //add task to UI
        UI.addTaskToList(task)

        //add to storage
        Store.addTask(task)

        //show success message
        UI.showAlert('Task Added', 'success')

        //clear fields
        UI.clearFields()
    }
    
})


// Event: Remove Task
document.querySelector('.container').addEventListener('click', e => {
    let itemType, itemID, delID

    itemType = e.target.parentNode.parentNode
    itemID = e.target.parentNode.parentNode.parentNode.parentNode.id
    delID = e.target.parentNode.parentNode.previousElementSibling.textContent

    if(itemID) {

        //Delete From UI
        UI.deleteTask(itemType, itemID)

        //Delete From Storage
        Store.removeTask(delID)
    }
})

// Event: Complete Task
document.querySelector('.container').addEventListener('click', e => {
    let itemType, itemID

    itemType = e.target.parentNode.parentNode
    itemID = e.target.parentNode.parentNode.parentNode.parentNode.id

    if(itemID) {
        //Complete IN UI
        UI.completeTask(itemType)
    }
})