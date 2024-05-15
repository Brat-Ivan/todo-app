import { PRIORITY, SORT_DROPDOWN_TEXT, PRIORITY_ARR } from "./constants.js";

const taskList = document.querySelector('.task-list');
const taskTemplate = document.querySelector('#task-template');
const emptyListTemplate = document.querySelector('#empty-list-template');
const sortDropdown = document.querySelector('#sort-dropdown');
const uncompletedBtn = document.querySelector('#uncompleted-button');
const uncompletedBtnText = uncompletedBtn.querySelector('.nav-bar__button-text');

let tasks = [];

function renderTasks() {
  tasks = JSON.parse(localStorage.getItem('tasks'));
  tasks.forEach(task => {
    const currentTask = taskTemplate.content.cloneNode(true);
    const taskListItem = currentTask.querySelector('.task-list__item');
    const taskElement = currentTask.querySelector('.task');
    const taskTitle = currentTask.querySelector('.task__title');
    const taskDetail = currentTask.querySelector('.task__detail');
    const taskDeadline = currentTask.querySelector('.task__deadline');
    const taskPriority = currentTask.querySelector('.task__priority');
    const editBtn = currentTask.querySelector('.task__button');

    taskTitle.textContent = task.title;
    taskDetail.textContent = task.detail;
    taskDeadline.textContent = `Deadline: ${task.deadline}`;
    taskPriority.textContent = `Priority: ${task.priority}`;
    taskListItem.id = task.id;

    if (task.priority === PRIORITY.high) {
      taskElement.classList.add('task--priority--high');
    } else if (task.priority === PRIORITY.medium) {
      taskElement.classList.add('task--priority--medium');
    } else if (task.priority === PRIORITY.low) {
      taskElement.classList.add('task--priority--low');
    }
    
    if (task.done) {
      taskListItem.classList.toggle('task-list__item--done-task');
      editBtn.classList.add('task__button--disabled');
    }

    taskList.insertAdjacentElement('beforeend', taskListItem);
  });
}

if (localStorage.getItem('tasks')) {
  renderTasks();
}

function checkEmptyList() {
  const tasksLength = tasks.length;
  if (
    !tasksLength ||
    (tasksLength === taskList.querySelectorAll('.task-list__item--done-task').length &&
    taskList.classList.contains('task-list--hidden-completed'))
  ) {
    const emptyList = emptyListTemplate.content.cloneNode(true);
    const emptyListItem = emptyList.querySelector('.empty-list');
    const emptyListText = emptyListItem.querySelector('.empty-list__text');
    
    if (tasksLength) {
      emptyListText.textContent = 'All tasks are completed';
    } else {
      emptyListText.textContent = 'ToDo list is empty';
    }

    const emptyListElement = document.querySelector('.empty-list');

    if (!emptyListElement) {
      taskList.insertAdjacentElement('afterbegin', emptyListItem);
    }
  } else {
    const emptyListElement = document.querySelector('.empty-list');
    
    if (emptyListElement) {
      emptyListElement.remove();
    }
  }
}

checkEmptyList();

function editTask(event) {
  if (event.target.id !== 'edit-btn') return;
  event.preventDefault();

  const parentNode = event.target.closest('.task-list__item');
  const editBtn = parentNode.querySelector('.task__button');

  if (!editBtn.classList.contains('task__button--disabled')) {
    sessionStorage.setItem('editable task', JSON.stringify(parentNode.id));
    window.location.href = './edit-task.html';
  }
}

taskList.addEventListener('click', editTask);

function deleteTask(event) {
  if (event.target.id !== 'delete-btn') return;

  const parentNode = event.target.closest('.task-list__item');
  const taskId = +parentNode.id;
  const taskIndex = tasks.findIndex(task => task.id === taskId);
  
  tasks.splice(taskIndex, 1);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  parentNode.remove();
  checkEmptyList();
}

taskList.addEventListener('click', deleteTask);

function doneTask(event) {
  if (event.target.id !== 'done-btn') return;

  const parentNode = event.target.closest('.task-list__item');
  const taskId = +parentNode.id;
  const task = tasks.find(task => task.id === taskId);
  const editBtn = parentNode.querySelector('.task__button');
  
  task.done = !task.done;
  localStorage.setItem('tasks', JSON.stringify(tasks));
  parentNode.classList.toggle('task-list__item--done-task');
  editBtn.classList.toggle('task__button--disabled');

  if (uncompletedBtnText.textContent === 'All') {
    checkEmptyList();
  }
}

taskList.addEventListener('click', doneTask);

function sortTasks() {
  const sortDropdownValue = sortDropdown.value;
  const taskListItems = document.querySelectorAll('.task-list__item');

  let item1;
  let item2;

  const sortedItems = [...taskListItems].sort((a, b) => {
    if (sortDropdownValue === SORT_DROPDOWN_TEXT.title) {
      item1 = a.children[0].children[0].children[0].textContent.toLowerCase();
      item2 = b.children[0].children[0].children[0].textContent.toLowerCase();

      if (item1 > item2) return 1;
    } else if (sortDropdownValue === SORT_DROPDOWN_TEXT.deadline) {
      item1 = +a.children[0].children[0].children[2].children[0].textContent.slice(10).split('.').reverse().join('');
      item2 = +b.children[0].children[0].children[2].children[0].textContent.slice(10).split('.').reverse().join('');

      if (isNaN(item1) && !isNaN(item2) || isNaN(item1) || item1 > item2) return 1;
    } else if (sortDropdownValue === SORT_DROPDOWN_TEXT.priority) {
      item1 = a.children[0].children[0].children[2].children[1].textContent;
      item2 = b.children[0].children[0].children[2].children[1].textContent;

      if (PRIORITY_ARR.indexOf(item1) > PRIORITY_ARR.indexOf(item2)) return 1;
    } else {
      item1 = +a.id;
      item2 = +b.id;

      if (item1 < item2) return 1;
    }

    return -1;
  });

  taskList.innerHTML = '';

  sortedItems.forEach(elem => taskList.appendChild(elem));
}

sortDropdown.addEventListener('change', sortTasks);

function hideCompletedTasks() {
  taskList.classList.toggle('task-list--hidden-completed');
  if (uncompletedBtnText.textContent === 'Uncompleted') {
    uncompletedBtnText.textContent = 'All';
  } else {
    uncompletedBtnText.textContent = 'Uncompleted';
  }
  checkEmptyList();
}

uncompletedBtn.addEventListener('click', hideCompletedTasks)
