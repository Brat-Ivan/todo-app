const form = document.querySelector('.form');
const titleInput = document.querySelector('#title-input');
const detailInput = document.querySelector('#detail-input');
const deadlineInput = document.querySelector('#deadline-input');
const priorityDropdown = document.querySelector('#priority-dropdown');

let tasks = [];

if (localStorage.getItem('tasks')) {
  tasks = JSON.parse(localStorage.getItem('tasks'));
}

function addTask(event) {
  event.preventDefault();

  const taskTitleText = titleInput.value;
  const taskDetailText = detailInput.value;
  let taskDeadlineDate = deadlineInput.value;

  function validateInput(inputText, input) {
    if (!inputText) {
      input.classList.add('field__control--error');
      return true;
    } else {
      input.classList.remove('field__control--error');
      return false;
    }
  }

  let isErrorTitle = validateInput(taskTitleText, titleInput);
  let isErrorDetail = validateInput(taskDetailText, detailInput);

  if (isErrorTitle || isErrorDetail) {
    return false;
  }

  if (!taskDeadlineDate) {
    taskDeadlineDate = 'Not set';
  } else {
    taskDeadlineDate = taskDeadlineDate.split('-').reverse().join('.');
  }

  const newTask = {
    title: taskTitleText,
    detail: taskDetailText,
    deadline: taskDeadlineDate,
    priority: priorityDropdown.value,
    id: Date.now(),
    done: false
  }
  
  tasks.unshift(newTask);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  window.location.href = './index.html';
}

form.addEventListener('submit', addTask);
