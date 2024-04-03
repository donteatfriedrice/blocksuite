import { type EditorHost, ShadowlessElement } from '@blocksuite/block-std';
import {
  type AffineAIPanelWidgetConfig,
  PageEditorBlockSpecs,
} from '@blocksuite/blocks';
import type { Doc } from '@blocksuite/store';
import { css, html, nothing, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { markDownToDoc } from '../markdown-utils.js';

@customElement('ai-answer-text')
export class AIAnswerText extends ShadowlessElement {
  static override styles = css`
    .ai-answer-text-container {
      max-height: 340px;
      width: 100%;
      display: block;
      overflow-y: auto;
      overflow-x: hidden;
      user-select: none;
    }

    .ai-answer-text-editor.affine-page-viewport {
      background: transparent;
    }

    .ai-answer-text-editor .affine-page-root-block-container {
      padding: 0;
      width: 100%;
    }

    .ai-answer-text-container::-webkit-scrollbar {
      width: 5px;
      height: 100px;
    }
    .ai-answer-text-container::-webkit-scrollbar-thumb {
      border-radius: 20px;
    }
    .ai-answer-text-container:hover::-webkit-scrollbar-thumb {
      background-color: var(--affine-black-30);
    }
    .ai-answer-text-container::-webkit-scrollbar-corner {
      display: none;
    }
  `;

  @property({ attribute: false })
  host!: EditorHost;

  @property({ attribute: false })
  answer!: string;

  private _previewDoc: Doc | null = null;

  override async updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    if (changedProperties.has('answer')) {
      this._previewDoc = await markDownToDoc(this.host, this.answer);
      this._previewDoc.awarenessStore.setReadonly(this._previewDoc, true);
      this.requestUpdate();
    }
  }

  override render() {
    if (!this._previewDoc) return nothing;
    return html`
      <div class="ai-answer-text-container">
        <div class="ai-answer-text-editor affine-page-viewport">
          ${this.host.renderSpecPortal(this._previewDoc, PageEditorBlockSpecs)}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ai-answer-text': AIAnswerText;
  }
}

export const textRenderer: AffineAIPanelWidgetConfig['answerRenderer'] = (
  host: EditorHost,
  answer: string
) => {
  return html`<ai-answer-text
    .host=${host}
    .answer=${answer}
  ></ai-answer-text>`;
};
