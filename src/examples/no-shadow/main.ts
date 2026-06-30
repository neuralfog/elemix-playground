import pageCss from './page.scss?inline';
import './PageAlert';

const style = document.createElement('style');
style.textContent = pageCss;
document.head.appendChild(style);

document.body.insertAdjacentHTML('beforeend', '<page-alert></page-alert>');
