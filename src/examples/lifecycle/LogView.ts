import { Component, tpl } from '@neuralfog/elemix';
import { repeat } from '@neuralfog/elemix/directives';
import type { Template } from '@neuralfog/elemix/types';

import css from './LogView.scss?inline';
import { log } from './store';

// #component
export class LogView extends Component {
    // #styles
    styles = css;

    template = (): Template => tpl`<div class="log">
        ${
            log.entries.length
                ? repeat(
                      log.entries,
                      (e) => tpl`<div class=${{ entry: true, [e.hint]: true }}>
                          <span class="n">${e.id}</span><span class="h">// #${e.hint}</span> ${e.fn}()
                      </div>`,
                      (e) => String(e.id),
                  )
                : tpl`<div class="empty">No events yet — mount the child.</div>`
        }
    </div>`;
}
