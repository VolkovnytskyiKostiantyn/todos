export default function updateItemsLeft(todosArr) {
  let left = 0;
  todosArr.forEach((todo) => {
    if (!todo.isCompleted) {
      left += 1;
    }
  });
  if (left === 1) {
    document.querySelector('.quantity').innerText = `${left} item left`;
  } else {
    document.querySelector('.quantity').innerText = `${left} items left`;
  }
}
