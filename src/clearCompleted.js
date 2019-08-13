import render, { todos } from './render';

export default function clearCompleted() {
  todos = todos.filter(todo => !todo.isCompleted === true);
  render();
}
