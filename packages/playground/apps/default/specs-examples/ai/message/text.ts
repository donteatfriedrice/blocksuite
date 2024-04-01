import type { EditorHost } from '@blocksuite/block-std';
import {
  type AffineAIPanelWidgetConfig,
  PageEditorBlockSpecs,
} from '@blocksuite/blocks';
import { html } from 'lit';

import { markDownToDoc } from '../utils';

export const textRenderer: AffineAIPanelWidgetConfig['answerRenderer'] = async (
  host: EditorHost,
  answer: string
) => {
  const previewDoc = await markDownToDoc(host, answer);
  previewDoc.awarenessStore.setReadonly(previewDoc, true);
  return html` <style>
      :host {
        user-select: none;
        overflow-y: auto;
      }
      .affine-ai-preview-editor {
        max-height: var(30vh, 320px);
      }
    </style>
    <div class="affine-ai-preview-editor affine-page-viewport">
      ${host.renderSpecPortal(previewDoc, PageEditorBlockSpecs)}
    </div>`;
};
