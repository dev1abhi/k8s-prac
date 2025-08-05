
const B_URL = '/todos'; 

async function loadTodos() {
  try {
    const response = await fetch(B_URL);
    const todos = await response.json();
    const list = document.getElementById('todoList');
    list.innerHTML = '';
    todos.forEach(todo => {
      const li = document.createElement('li');
      li.textContent = todo.text;
      list.appendChild(li);
    });
  } catch (err) {
    console.error('Failed to fetch todos:', err);
    document.getElementById('todoList').innerHTML = '<li>Error loading todos</li>';
  }
}

async function addTodo() {
  const input = document.getElementById('todoInput');
  const text = input.value.trim();
  if (!text) return;

  try {
    const response = await fetch(B_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    if (!response.ok) throw new Error('Failed to add todo');

    const newTodo = await response.json();
    const li = document.createElement('li');
    li.textContent = newTodo.text;
    document.getElementById('todoList').appendChild(li);
    input.value = '';
  } catch (err) {
    console.error('Error:', err);
  }
}

loadTodos();



async function loadImage() {
  try {
    const res = await fetch('/image');
    const data = await res.json();
    document.getElementById('randomImage').src = data.image;
  } catch (err) {
    console.error('Image loading failed');
  }
}

loadImage(); 
