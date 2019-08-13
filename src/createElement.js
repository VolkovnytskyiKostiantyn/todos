export default function createElement(tag) {
  return document.createElement(`${tag.toUpperCase()}`);
}
