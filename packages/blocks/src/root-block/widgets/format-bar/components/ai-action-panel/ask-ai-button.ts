import './ai-action-panel.js';

import { assertExists } from '@blocksuite/global/utils';
import { computePosition, flip, offset, shift } from '@floating-ui/dom';
import { html } from 'lit';
import { ref, type RefOrCallback } from 'lit/directives/ref.js';
import { styleMap } from 'lit/directives/style-map.js';

import { whenHover } from '../../../../../_common/components/hover/when-hover.js';
import { StarIcon } from '../../../../../_common/icons/ai.js';
import type { AffineFormatBarWidget } from '../../format-bar.js';

const AskAIPanel = (
  formatBar: AffineFormatBarWidget,
  containerRef?: RefOrCallback
) => {
  return html`<div ${ref(containerRef)} class="ask-ai-panel">
    <ai-action-panel .host=${formatBar.host}></ai-action-panel>
  </div>`;
};

export const AskAIButton = (formatBar: AffineFormatBarWidget) => {
  // const editorHost = formatBar.host;

  const { setFloating, setReference } = whenHover(isHover => {
    if (!isHover) {
      const panel =
        formatBar.shadowRoot?.querySelector<HTMLElement>('.ask-ai-panel');
      if (!panel) return;
      panel.style.display = 'none';
      return;
    }
    const button =
      formatBar.shadowRoot?.querySelector<HTMLElement>('.ask-ai-button');
    const panel =
      formatBar.shadowRoot?.querySelector<HTMLElement>('.ask-ai-panel');
    assertExists(button);
    assertExists(panel);
    panel.style.display = 'flex';
    computePosition(button, panel, {
      placement: 'bottom-start',
      middleware: [
        flip(),
        offset(10),
        shift({
          padding: 16,
        }),
      ],
    })
      .then(({ x, y }) => {
        panel.style.left = `${x}px`;
        panel.style.top = `${y}px`;
      })
      .catch(console.error);
  });

  const askAIPanel = AskAIPanel(formatBar, setFloating);

  const buttonStyle = styleMap({
    color: 'var(--affine-brand-color)',
    fontWeight: '500',
    fontSize: 'var(--affine-font-sm)',
  });

  const labelStyle = styleMap({
    lineHeight: '22px',
    paddingLeft: '4px',
  });

  return html`<div ${ref(setReference)} class="ask-ai-button">
    <icon-button
      class="ask-ai-icon-button"
      width="75px"
      height="32px"
      style=${buttonStyle}
    >
      ${StarIcon} <span style=${labelStyle}>Ask AI</span></icon-button
    >
    ${askAIPanel}
  </div>`;
};
