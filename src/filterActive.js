import render from './render';

export default function filterActive() {
  const viewMode = 'Active';
  document.querySelector('.active').classList.remove('active');
  document.querySelector('.filter-button-active').classList.add('active');
  render(viewMode);
}
