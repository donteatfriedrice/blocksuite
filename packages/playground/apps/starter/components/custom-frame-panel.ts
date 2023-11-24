import { registerFramesSidebarComponents } from '@blocksuite/blocks';
import type { EditorContainer } from '@blocksuite/editor';
import { WithDisposable } from '@blocksuite/lit';
import type { Page } from '@blocksuite/store';
import { css, html, LitElement, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('custom-frame-panel')
export class CustomFramePanel extends WithDisposable(LitElement) {
  static override styles = css`
    .custom-frame-container {
      position: absolute;
      top: 0;
      right: 0;
      border: 1px solid var(--affine-border-color, #e3e2e4);
      background: var(--affine-background-overlay-panel-color);
      height: 100vh;
      width: 316px;
      display: flex;
      justify-content: center;
      box-sizing: border-box;
      padding-top: 12px;
      z-index: 1;
    }
  `;
  @state()
  private _show = false;

  @property({ attribute: false })
  page!: Page;

  @property({ attribute: false })
  editor!: EditorContainer;

  private _renderPanel() {
    return html`<frames-panel .page=${this.page}></frames-panel>`;
  }

  public toggleDisplay() {
    this._show = !this._show;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.page = this.editor.page;

    registerFramesSidebarComponents(components => {
      Object.entries(components).forEach(([name, component]) => {
        customElements.define(name, component);
      });
    });
  }

  override render() {
    return html`
      ${this._show
        ? html`<div class="custom-frame-container">${this._renderPanel()}</div>`
        : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'custom-frame-panel': CustomFramePanel;
  }
}
