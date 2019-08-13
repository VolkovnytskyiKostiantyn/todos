import render, { todos } from './render';

let nextId = 1;

export default function addTodo(event) {
  if (event.key === 'Enter') {
    todos.push({
      title: event.target.value,
      isCompleted: false,
      id: nextId,
    });
    render();
    nextId += 1;
    document.querySelector('.input-field').value = '';
  }
}
