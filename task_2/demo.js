const myList = document.getElementById("list");
const doneList = document.getElementById("donelist");
const addTodoInput = document.querySelector('#itemname');
const todoNoItemText = document.getElementById("noitem");
const doneListNoItemText = document.getElementById("doneitem");

let todo = [];


function saveList() {
  localStorage.setItem("todo", JSON.stringify(todo));
}

function getList() {
  const todoUsStorage = JSON.parse(localStorage.getItem("todo")) || [];
  todo = todoUsStorage;
}

function renderAllItem() {
  for(let i = 0; i < todo.length; i++) {
    addTodoItem(todo[i])
  }
}

function addItemOnEnterPress(e) {
  if (e.keyCode === 13) {
    const todoItem = {
      value: e.target.value,
      completed: false,
      _id: `f${(+new Date).toString(16)}`,
      isNew: true
    }
    addTodoItem(todoItem);
  }
}

function clearInput() {
  addTodoInput.value = '';
}

function getTodoHtmlById(id) {
  return document.querySelector(`.${id}`) || null;
}

function removeTodoItemById(id) {
  todo = todo.filter(item => item._id !== id);
}

// Вынести в старт
getList();
renderAllItem();
addTodoInput.addEventListener('keypress', addItemOnEnterPress)


function createTodoItem(data) {
  const item = document.createElement("li");
  const span = document.createElement("span");
  const check = document.createElement("input");
  const spanimg = document.createElement("span");

  item.appendChild(check);
  item.appendChild(spanimg);
  item.appendChild(span);

  item.classList.add(data._id)
  check.setAttribute('type', 'checkbox');
  check.classList.add("check-item");
  check.checked = data.completed;
  span.classList.add("list-item");
  span.textContent = data.value;
  spanimg.classList.add("glyphicon");
  spanimg.classList.add("glyphicon-remove");

  return {span, item, spanimg, check}
}

function onRemoveClick(data) {
  const item = getTodoHtmlById(data._id);
  item.remove();
  removeTodoItemById(data._id)
  saveList();
  displayTitle();
}

function onCompleteClick(event, data) {
  const isChecked = event.target.checked;
  const item = getTodoHtmlById(data._id);
  if (isChecked) {
    data.completed = true;
    removeTodoItemById(data._id)
    todo.push(data)
    myList.removeChild(item);
    doneList.appendChild(item);
  } else {
    data.completed = false;
    doneList.removeChild(item);
    myList.appendChild(item);
  }
  saveList();
  displayTitle();
}

function createEditForm(data) {
  const form = document.createElement("span");
  const text = document.createElement("input");
  const ok = document.createElement("button");
  const cancel = document.createElement("button");

  text.value = data.value;
  ok.innerHTML = "OK";
  cancel.innerHTML = "Cancel";

  form.appendChild(text);
  form.appendChild(ok);
  form.appendChild(cancel);

  return {form, ok, cancel, text};
}

function onEditResolve({data, form, currentItem, text, parent}) {
  const value = text.value;
  data.value = value;
  currentItem.removeChild(form);
  currentItem.innerHTML = value;
  parent.appendChild(currentItem);
  saveList();
}

function onEditReject({currentItem, data, parent, form}) {
  currentItem.removeChild(form);
  currentItem.innerHTML = data.value;
  parent.appendChild(currentItem);
}

function onEdit(data) {
  const parent = getTodoHtmlById(data._id);
  const currentItem =  parent.querySelector('.list-item');
  currentItem.innerHTML = "";

  const {form, cancel, ok, text} = createEditForm(data);
  currentItem.appendChild(form);

  ok.addEventListener("click",
    () => onEditResolve({data, currentItem, form, text, parent})
  );
  cancel.addEventListener("click",
    () => onEditReject({currentItem, form, data, parent})
  );
}

function addTodoItem(data) {
  const {span, item, check, spanimg} = createTodoItem(data);
  if (!data.completed) {
    myList.appendChild(item);
  } else {
    doneList.appendChild(item);
  }

  if (data.isNew) {
    delete  data.isNew;
    todo.push(data);
  }

  check.addEventListener("change", (event) => onCompleteClick(event, data));
  span.addEventListener("dblclick", () => onEdit(data));
  spanimg.addEventListener("click", () => onRemoveClick(data));


  clearInput();
  saveList();
  displayTitle();
}

function displayTitle() {
  const completedItem = todo.filter(item => item.completed).length;
  const noCompletedItem = todo.length - completedItem;
  todoNoItemText.style.display = noCompletedItem ? 'none' : 'block';
  doneListNoItemText.style.display = completedItem ? 'none' : 'block';
}


function remove_list(id) {
  const root = document.getElementById(id);
  while (root.firstChild) {
    root.removeChild(document.getElementById(id).firstChild);

  }

  if (id === 'list') {
    todo = todo.filter(item => item.completed);
  } else  {
    todo = todo.filter(item => !item.completed);
  }

  saveList();
  displayTitle();
}
