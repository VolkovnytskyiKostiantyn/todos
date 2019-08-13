export default function addSrc(obj, index, node, todos) {
  const newObj = Object.assign({}, obj);
  newObj.src = node;
  todos[index] = newObj;
}
