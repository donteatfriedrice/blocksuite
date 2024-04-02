import { type EditorHost } from '@blocksuite/block-std';
import {
  type AffineAIPanelWidgetConfig,
  PageEditorBlockSpecs,
} from '@blocksuite/blocks';
import type { Doc } from '@blocksuite/store';
import { css, html, LitElement, nothing, type PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

import { markDownToDoc } from '../utils';

@customElement('ai-answer-preview')
export class AIAnswerPreview extends LitElement {
  static override styles = css`
    .text-renderer-container {
      max-height: 340px;
      width: 100%;
      display: flex;
      overflow-y: auto;
      overflow-x: hidden;
      user-select: none;
    }

    .affine-ai-preview-editor.affine-page-viewport {
      background: transparent;
    }

    .affine-ai-preview-editor .affine-page-root-block-container {
      padding: 0;
    }

    .text-renderer-container::-webkit-scrollbar {
      width: 5px;
      height: 100px;
    }
    .text-renderer-container::-webkit-scrollbar-thumb {
      border-radius: 20px;
    }
    .text-renderer-container:hover::-webkit-scrollbar-thumb {
      background-color: var(--affine-black-30);
    }
    .text-renderer-container::-webkit-scrollbar-corner {
      display: none;
    }
  `;

  @property({ attribute: false })
  host!: EditorHost;

  @property({ attribute: false })
  answer!: string;

  @query('.text-renderer-container')
  private _textRendererContainer!: HTMLDivElement;

  private _previewDoc: Doc | null = null;

  override async updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    if (changedProperties.has('answer')) {
      this._previewDoc = await markDownToDoc(this.host, this.answer);
      this._previewDoc.awarenessStore.setReadonly(this._previewDoc, true);
      this.requestUpdate();
    }
  }

  override firstUpdated() {
    const styles = document.head.querySelectorAll('style');
    // If styles, clone style node and append to this element
    if (styles.length && this._textRendererContainer) {
      console.log('styles: ', styles);
      styles.forEach(style => {
        const clone = style.cloneNode(true);
        this._textRendererContainer.append(clone);
      });
    }
  }

  override render() {
    if (!this._previewDoc) return nothing;
    return html`
      <div class="text-renderer-container">
        <div class="affine-ai-preview-editor affine-page-viewport">
          ${this.host.renderSpecPortal(this._previewDoc, PageEditorBlockSpecs)}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ai-answer-preview': AIAnswerPreview;
  }
}

export const textRenderer: AffineAIPanelWidgetConfig['answerRenderer'] = (
  host: EditorHost,
  answer: string
) => {
  return html`<ai-answer-preview
    .host=${host}
    .answer=${answer}
  ></ai-answer-preview>`;
};
