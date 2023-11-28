import { assertExists } from '@blocksuite/global/utils';
import { ShadowlessElement, WithDisposable } from '@blocksuite/lit';
import { html } from 'lit';
import { property, query } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

import type { RichText } from '../../../../_common/components/rich-text/rich-text.js';
import type { FrameBlockModel } from '../../../../frame-block/frame-model.js';

export class FrameCardTitleEditor extends WithDisposable(ShadowlessElement) {
  @query('rich-text')
  richText!: RichText;

  @property({ attribute: false })
  frameModel!: FrameBlockModel;

  get vEditor() {
    assertExists(this.richText.vEditor);
    return this.richText.vEditor;
  }

  get vEditorContainer() {
    return this.vEditor.rootElement;
  }

  override async getUpdateComplete(): Promise<boolean> {
    const result = await super.getUpdateComplete();
    await this.richText?.updateComplete;
    return result;
  }

  override firstUpdated(): void {
    this.updateComplete.then(() => {
      this.vEditor.selectAll();

      this.vEditor.slots.updated.on(() => {
        this.requestUpdate();
      });

      this.disposables.addFromEvent(this.vEditorContainer, 'blur', () => {
        this._unmount();
      });
    });
  }

  private _unmount() {
    // dispose in advance to avoid execute `this.remove()` twice
    this.disposables.dispose();
    this.remove();
  }

  override render() {
    const virgoStyle = styleMap({
      transformOrigin: 'top left',
      borderRadius: '4px',
      width: 'fit-content',
      padding: '4px 10px',
      fontSize: '12px',
      position: 'absolute',
      left: '0px',
      top: '0px',
      minWidth: '8px',
      fontFamily: 'var(--affine-font-family)',
      background: 'var(--affine-white)',
      color: 'var(--affine-black)',
      outline: 'none',
      zIndex: '1',
      border: `1px solid
        var(--affine-primary-color)`,
      boxShadow: `0px 0px 0px 2px rgba(30, 150, 235, 0.3)`,
    });
    return html`<rich-text
      .yText=${this.frameModel.title.yText}
      .enableFormat=${false}
      .enableAutoScrollHorizontally=${false}
      .enableAutoScrollVertically=${false}
      style=${virgoStyle}
    ></rich-text>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'frame-card-title-editor': FrameCardTitleEditor;
  }
}
