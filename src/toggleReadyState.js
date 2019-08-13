export default function toggleReadyState(event) {
  let isChoosenCompleted = false;
  const choosenIndex = todos.findIndex((todo) => {
    if (todo.src === event.target.closest('LI')) {
      isChoosenCompleted = todo.isCompleted;
      return true;
    }
    return false;
  });
  if (isChoosenCompleted) {
    todos[choosenIndex].isCompleted = false;
  } else {
    todos[choosenIndex].isCompleted = true;
  }
}
