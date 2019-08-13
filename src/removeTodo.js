import render, { todos } from './render';

export default function removeTodo(event) {
  const indexToDelete = todos.findIndex(todo => todo.src === event.target.parentNode);
  if (indexToDelete + 1) {
    todos.splice(indexToDelete, 1);
  }
  render();
}
