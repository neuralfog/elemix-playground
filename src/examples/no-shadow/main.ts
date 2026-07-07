import { createApp } from '@neuralfog/elemix';
import pageCss from './page.scss?inline';
import { PageAlert } from './PageAlert';

const style = document.createElement('style');
style.textContent = pageCss;
document.head.appendChild(style);

createApp(PageAlert).mount(document.body);
