import render from './render';

export default function filterAll() {
  const viewMode = 'All';
  document.querySelector('.active').classList.remove('active');
  document.querySelector('.filter-button-all').classList.add('active');
  render(viewMode);
}
