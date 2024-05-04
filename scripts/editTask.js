const form = document.querySelector('.form');
const titleInput = document.querySelector('#title-input');
const detailInput = document.querySelector('#detail-input');
const deadlineInput = document.querySelector('#deadline-input');
const priorityDropdown = document.querySelector('#priority-dropdown');

let tasks = JSON.parse(localStorage.getItem('tasks'));
const editableTask = tasks.find(
  task => task.id === +JSON.parse(sessionStorage.getItem('editable task'))
);

let taskTitleText = editableTask.title;
let taskDetailText = editableTask.detail;
let taskDeadlineDate = editableTask.deadline;

titleInput.value = taskTitleText;
detailInput.value = taskDetailText;

if (taskDeadlineDate !== 'Not set') {
  deadlineInput.value = taskDeadlineDate.split('.').reverse().join('-');
}

priorityDropdown.value = editableTask.priority;

function editCurrentTask(event) {
  event.preventDefault();
  taskTitleText = titleInput.value;
  taskDetailText = detailInput.value;
  taskDeadlineDate = deadlineInput.value;

  if (taskDeadlineDate === '') {
    taskDeadlineDate = 'Not set';
  } else {
    taskDeadlineDate = taskDeadlineDate.split('-').reverse().join('.');
  }

  function validateInput(inputText, input) {
    if (inputText === '') {
      input.classList.add('field__control--error');
      return true;
    } else {
      input.classList.remove('field__control--error');
      return false;
    }
  }

  if (event.submitter.id === 'update-button') {
    let isErrorTitle = validateInput(taskTitleText, titleInput);
    let isErrorDetail = validateInput(taskDetailText, detailInput);
  
    if (isErrorTitle || isErrorDetail) {
      return false;
    }

    editableTask.title = taskTitleText;
    editableTask.detail = taskDetailText;
    editableTask.deadline = taskDeadlineDate;
    editableTask.priority = priorityDropdown.value;

    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
  
  window.location.href = './index.html';
}

form.addEventListener('submit', editCurrentTask);
