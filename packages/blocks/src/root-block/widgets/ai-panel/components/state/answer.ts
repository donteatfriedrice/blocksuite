import { ShadowlessElement, WithDisposable } from '@blocksuite/block-std';
import { css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import type {
  AIItemConfig,
  AIItemGroupConfig,
} from '../../../../../_common/components/ai-item/index.js';
import { WarningIcon } from '../../../../../_common/icons/misc.js';
import { CopyIcon } from '../../../../../_common/icons/text.js';

export type AIPanelAnswerConfig = {
  responses: AIItemConfig[];
  actions: AIItemGroupConfig[];
};

@customElement('ai-panel-answer')
export class AIPanelAnswer extends WithDisposable(ShadowlessElement) {
  static override styles = css`
    .ai-panel-answer-container {
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 630px;
    }

    .ai-panel-answer {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      gap: 4px;
      align-self: stretch;
    }

    .ai-panel-answer-head {
      align-self: stretch;

      color: var(
        --light-textColor-textSecondaryColor,
        var(--textColor-textSecondaryColor, #8e8d91)
      );

      /* light/xsMedium */
      font-family: Inter;
      font-size: 12px;
      font-style: normal;
      font-weight: 500;
      line-height: 20px; /* 166.667% */
    }

    .ai-panel-answer-body {
      align-self: stretch;

      color: var(--light-textColor-textPrimaryColor, #121212);
      font-feature-settings:
        'clig' off,
        'liga' off;

      /* light/sm */
      font-family: Inter;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 22px; /* 157.143% */
    }

    .ai-panel-finish-tip {
      display: flex;
      width: 100%;
      height: 22px;
      align-items: center;
      gap: 8px;

      color: var(
        --light-textColor-textSecondaryColor,
        var(--textColor-textSecondaryColor, #8e8d91)
      );

      .ai-panel-text {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        flex: 1 0 0;

        /* light/xs */
        font-family: Inter;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 20px; /* 166.667% */
      }

      .ai-panel-right {
        display: flex;
        align-items: center;
        gap: 16px;

        .ai-panel-copy {
          display: flex;
          width: 20px;
          height: 20px;
          justify-content: center;
          align-items: center;

          border-radius: 8px;

          &:hover {
            background: var(
              --light-detailColor-hoverColor,
              rgba(0, 0, 0, 0.04)
            );
          }
        }
      }
    }
  `;

  @property({ attribute: false })
  config!: AIPanelAnswerConfig;

  @property({ attribute: false })
  finish = true;

  override render() {
    const responseGroups: AIItemGroupConfig[] = [
      {
        name: 'Responses',
        items: this.config.responses,
      },
    ];

    return html` <div class="ai-panel-answer-container" contenteditable="false">
      <div class="ai-panel-answer">
        <div class="ai-panel-answer-head">Answer</div>
        <div class="ai-panel-answer-body">
          <slot></slot>
        </div>
      </div>
      ${this.finish
        ? html`
            <div class="ai-panel-finish-tip">
              ${WarningIcon}
              <div class="ai-panel-text">
                AI outputs can be misleading or wrong
              </div>
              <div class="ai-panel-right">
                <div class="ai-panel-copy">${CopyIcon}</div>
              </div>
            </div>
            ${this.config.responses.length > 0
              ? html`
                  <ai-panel-divider></ai-panel-divider>
                  <ai-item-list .groups=${responseGroups}></ai-item-list>
                `
              : nothing}
            ${this.config.responses.length > 0 && this.config.actions.length > 0
              ? html`<ai-panel-divider></ai-panel-divider>`
              : nothing}
            ${this.config.actions.length > 0
              ? html`
                  <ai-item-list .groups=${this.config.actions}></ai-item-list>
                `
              : nothing}
          `
        : nothing}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ai-panel-answer': AIPanelAnswer;
  }
}
