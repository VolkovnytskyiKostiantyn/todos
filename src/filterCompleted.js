import render from './render';

export default function filterCompleted() {
  const viewMode = 'Completed';
  document.querySelector('.active').classList.remove('active');
  document.querySelector('.filter-button-completed').classList.add('active');
  render(viewMode);
}
