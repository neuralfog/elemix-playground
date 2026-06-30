import { Component, defineComponent, html, type Template } from '@neuralfog/elemix';
import { repeat } from '@neuralfog/elemix/directives';

import css from './LogView.scss?inline';

import { log } from './store';

export class LogView extends Component {
    static styles = [css];

    template = (): Template => html`<div class="log">
        ${
            log.value.entries.length
                ? repeat(
                      log.value.entries,
                      (e) => html`<div .class=${{ entry: true, [e.event]: true }}>
                          <span class="n">${e.id}</span>${e.event}()
                      </div>`,
                      (e) => String(e.id),
                  )
                : html`<div class="empty">No events yet — mount the child.</div>`
        }
    </div>`;
}

defineComponent('log-view', LogView);
