// Знаходимо елементи на сторініці
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];

if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach((task) => renderTask(task));
}

checkEmptyList();

form.addEventListener('submit', addTask);
tasksList.addEventListener('click', deleteTask);
tasksList.addEventListener('click', doneTask);

function addTask(event) {
    // Відміняємо відправку форми
    event.preventDefault();

    // Забираємо текст з поля вводу
    const taskText = taskInput.value;

    // Описуємо задачу у вигляді об'єкта
    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false,
    };

    // Додаємо задачу в масив з задачами
    tasks.push(newTask);

    // Додаємо задачу в localStorage
    saveToLocalStorage()

    // Формуємо CSS класс
    const cssClass = newTask.done ? 'task-title task-title--done' : 'task-title';

    // Рендеримо НОВУ задачу
    renderTask(newTask);

    // Чистимо поле вводу
    taskInput.value = '';
    taskInput.focus();

    checkEmptyList();
}

function deleteTask(event) {
    // Перевірка що клік був не кнопку "Видалити"
    if (event.target.dataset.action !== 'delete') {
        return;
    }
    
    // Перевірка кліку на кнопку "Видалити"
    const parentNode = event.target.closest('.list-group-item');

    // Знаходимо ID задачі (переводимо строку у число)
    const id = Number(parentNode.id);

    // Видаляємо задачу з масиву через метод filter
    tasks = tasks.filter((task) => task.id !== id);

    // Зберегаємо перелік задач в localStorage
    saveToLocalStorage()

    // Видаляємо задачу з розмітки
    parentNode.remove();
    checkEmptyList();
}

function doneTask(event) {
    // Перевірка що клік був не кнопку "Зроблено"
    if (event.target.dataset.action !== 'done') {
        return;
    }

    const parentNode = event.target.closest('.list-group-item');

    // Знаходимо ID задачі
    const id = Number(parentNode.id);
    const task = tasks.find((task) => task.id === id);
    task.done = !task.done;

    // Зберегаємо перелік задач в localStorage
    saveToLocalStorage()
    
    // Перевірка кліку на кнопку "Зроблено"
    const taskTitle = parentNode.querySelector('.task-title');
    taskTitle.classList.toggle('task-title--done');
}

function checkEmptyList() {
    if (tasks.length === 0) {
		const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
					<img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
					<div class="empty-list__title">Список дел пуст</div>
				</li>`;
		tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
	}

	if (tasks.length > 0) {
		const emptyListEl = document.querySelector('#emptyList');
		emptyListEl ? emptyListEl.remove() : null;
	}
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task) {
    // Формуємо CSS класс
    const cssClass = task.done ? 'task-title task-title--done' : 'task-title';

    // Робимо рендер для нової задачі
    const taskHTML = `
    <li id='${task.id}' class="list-group-item d-flex justify-content-between task-item">
					<span class="${cssClass}">${task.text}</span>
					<div class="task-item__buttons">
						<button type="button" data-action="done" class="btn-action">
							<img src="./img/tick.svg" alt="Done" width="18" height="18">
						</button>
						<button type="button" data-action="delete" class="btn-action">
							<img src="./img/cross.svg" alt="Done" width="18" height="18">
						</button>
					</div>
				</li>`;
    
    // Додаємо задачу на сторінку
    tasksList.insertAdjacentHTML('beforeend', taskHTML);
}



