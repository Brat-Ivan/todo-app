const taskList = document.querySelector('.task-list');
const taskTemplate = document.querySelector('#task-template');
const emptyListTemplate = document.querySelector('#empty-list-template');

let tasks = [];

function renderTasks() {
  tasks = JSON.parse(localStorage.getItem('tasks'));
  tasks = tasks.filter(task => task.done);
  tasks.forEach(task => {
    const currentTask = taskTemplate.content.cloneNode(true);
    const taskListItem = currentTask.querySelector('.task-list__item');
    const taskElement = currentTask.querySelector('.task');
    const taskTitle = currentTask.querySelector('.task__title');
    const taskDetail = currentTask.querySelector('.task__detail');

    taskTitle.textContent = task.title;
    taskDetail.textContent = task.detail;

    if (task.priority === 'High') {
      taskElement.classList.add('task--priority--high');
    } else if (task.priority === 'Medium') {
      taskElement.classList.add('task--priority--medium');
    } else if (task.priority === 'Low') {
      taskElement.classList.add('task--priority--low');
    }
    
    taskList.insertAdjacentElement('beforeend', taskListItem);
  });
}

if (localStorage.getItem('tasks')) {
  renderTasks();
}

function checkEmptyList() {
  if (tasks.length === 0) {
    const emptyList = emptyListTemplate.content.querySelector('.empty-list');
    taskList.insertAdjacentElement('afterbegin', emptyList);
  }
}

checkEmptyList();
