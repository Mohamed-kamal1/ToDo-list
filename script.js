document.addEventListener('DOMContentLoaded', () => {
    loadTasks('tasks');
});

// function to add a task
function addTask() {
    // get the task input
    const taskInput = document.getElementById('taskInput');
    // get the task
    const task = taskInput.value;
    // check if the task is not empty
    if (task) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push([task, false]);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        taskInput.value = '';
        displayTasks();
        Notification("Task added successfully");
    }
}

// function to load tasks from local storage
function loadTasks(tasksList) {
    let tasks = JSON.parse(localStorage.getItem(tasksList)) || [];
    tasks.forEach(task => {
        displayTask(task);
    });
}

// function to display tasks
function displayTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    const completedTasks = document.getElementById('completedList');
    completedTasks.innerHTML = '';
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        displayTask(task);
    });
}

// function to display a task
function displayTask(task) {
    // get the task list
    const taskList = document.getElementById('taskList');
    const completedTasks = document.getElementById('completedList');
    // create a new list item
    const li = document.createElement('li');
    // create a check icon
    const checkIcon = document.createElement('img');
    checkIcon.src = 'assets/check-circle.png';
    checkIcon.style.width = '40px';
    checkIcon.style.height = '40px';
    checkIcon.style.cursor = 'pointer';
    task[1] ? checkIcon.src = 'assets/check-circle-filled.png' : checkIcon.src = 'assets/check-circle.png';

    // function to mark task as completed
    checkIcon.onclick = () => {
        markAsCompleted(task);
    };
    task[1] ? li.className+= 'completed' : li.className = '';
    // create a text element
    // set the text content of the text element to the task
    const liText = document.createElement('p');
    liText.textContent= task[0];
    liText.onclick= () => {editTask(task[0]);};
    liText.style.width = '100%';
    liText.style.overflow = 'hidden';
    liText.style.textWrap = 'nowrap';
    liText.style.textOverflow = 'ellipsis';
    //////////////////////////////////////////
    const liLeft = document.createElement('div');
    liLeft.style.display = 'flex';
    liLeft.style.gap = '10px';
    liLeft.style.alignItems = 'center';
    liLeft.style.width = '45vw';
    // create edit buttons
    const editButton = creatButton('Edit',() => {editTask(task[0]);});
    editButton.textContent = 'Edit';
    // create delete button
    const deleteButton = creatButton('Delete',() => {removeTask(task[0]);});
    // append the check icon and text element to the list item
    const buttons = document.createElement('div');
    buttons.style.display = 'flex';
    buttons.style.gap = '10px'
    buttons.appendChild(editButton);
    buttons.appendChild(deleteButton);
    liLeft.appendChild(checkIcon);
    liLeft.appendChild(liText);
    li.appendChild(liLeft);
    li.appendChild(buttons);
    li.className = 'task';
    // append the list item to the task list
    (task[1]) ? completedTasks.appendChild(li):taskList.appendChild(li);
    const taskHeader = document.getElementById('tasksHeader');
    const completedHeader = document.getElementById('completedHeader');
    taskHeader.innerHTML = `Tasks todo (${taskList.children.length})`;
    completedHeader.innerHTML = `Completed tasks (${completedTasks.children.length})`;
}


// function to remove a task
function removeTask(task) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(t => t[0] !== task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    console.log(tasks);
    displayTasks();
    Notification("Task removed successfully");
}

// function to edit a task
function  editTask(task) {
    const aside = document.querySelector("aside");
    aside.classList.remove('closed');
    const textarea = document.querySelector("textarea");
    textarea.value = task;

    function saveEdit() {
        editTaskInput(task);
        closeAside();
    }
    const button = creatButton('Edit', saveEdit);
    const cancelButton = creatButton('Cancel', closeAside);
    button.classList.add('aside-btn');
    cancelButton.classList.add('aside-btn');
    const buttons = document.createElement('div');
    buttons.style.display = 'flex';
    buttons.style.gap = '20px';
    buttons.appendChild(button);
    buttons.appendChild(cancelButton);
    aside.appendChild(buttons);

    // function to close the aside
    function closeAside() {
        aside.removeChild(buttons);
        if (aside.classList.contains('closed'))
        {
            aside.classList.remove('closed');
            return;
        }
        aside.classList.add('closed')
    }
    const closeBtn = document.getElementById('closeBtn');
    closeBtn.onclick = closeAside;
}

// function to edit a task
function editTaskInput(task) {
    const textarea = document.querySelector("textarea");
    const newTask = [textarea.value, false];
    if (newTask[0] !== task) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.map(t => t[0] === task ? newTask : t);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        displayTasks();
        Notification("Task edited successfully");
    }
}

// function to mark a task as completed
function markAsCompleted(task) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let newTask= [task[0], !task[1]];
    tasks = tasks.map(t => t[0] === task[0] ? newTask : t);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    console.log(tasks);
    displayTasks();
}


// function to create a button
function creatButton(text , onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.onclick = onClick;
    return button;
}


// function to display a notification
function Notification(message) {
    const notification = document.querySelector('.notification')
    notification.classList.remove('notification-close');
    const notificationText = document.querySelector('.notification-text');
    notificationText.textContent = message;
    setTimeout(() => {
        notification.classList.add('notification-close');
    }, 3000);
}
