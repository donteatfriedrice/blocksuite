import './components/index.js';

import type { EditorHost } from '@blocksuite/block-std';
import { ShadowlessWidgetElement } from '@blocksuite/block-std';
import { assertExists } from '@blocksuite/global/utils';
import {
  autoUpdate,
  computePosition,
  type ReferenceElement,
} from '@floating-ui/dom';
import { css, html, nothing, type TemplateResult } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';

import type {
  AIPanelAnswerConfig,
  AIPanelErrorConfig,
} from './components/index.js';

export interface AffineAIPanelWidgetConfig {
  answerRenderer: (host: EditorHost, answer: string) => TemplateResult<1>;
  generateAnswer: (props: {
    input: string;
    update: (answer: string) => void;
    finish: (type: 'success' | 'error') => void;
    // Used to allow users to stop actively when generating
    signal: AbortSignal;
  }) => void;

  finishStateConfig: AIPanelAnswerConfig;
  errorStateConfig: AIPanelErrorConfig;
}

export type AffineAIPanelState =
  | 'hidden'
  | 'input'
  | 'generating'
  | 'finished'
  | 'error';

export const AFFINE_AI_PANEL_WIDGET = 'affine-ai-panel-widget';

@customElement(AFFINE_AI_PANEL_WIDGET)
export class AffineAIPanelWidget extends ShadowlessWidgetElement {
  static override styles = css`
    .ai-panel-container {
      display: flex;
      width: 630px;
      padding: 8px 12px;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;

      outline: none;
      border-radius: 8px;
      border: 1px solid var(--affine-border-color);
      background: var(--affine-background-overlay-panel-color);

      /* light/toolbarShadow */
      box-shadow: var(--affine-shadow-1);

      gap: 8px;
      overflow: hidden;
      user-select: none;
    }
  `;

  @property({ attribute: false })
  config: AffineAIPanelWidgetConfig | null = null;

  @property()
  state: AffineAIPanelState = 'hidden';

  @query('.ai-panel-container')
  container!: HTMLDivElement;

  toggle = (reference: ReferenceElement, input?: string) => {
    if (input) {
      this._inputText = input;
      this.generate();
    } else {
      // reset state
      this.hide();
      this.state = 'input';
    }

    this._abortController.signal.addEventListener(
      'abort',
      autoUpdate(reference, this, () => {
        computePosition(reference, this, {
          placement: 'bottom-start',
        })
          .then(({ x, y }) => {
            this.style.left = `${x}px`;
            this.style.top = `${y}px`;
          })
          .catch(console.error);
      })
    );
  };

  hide = () => {
    this._resetAbortController();
    this.state = 'hidden';
    this._inputText = null;
    this._answer = null;
  };

  /**
   * You can evaluate this method multiple times to regenerate the answer.
   */
  generate = () => {
    assertExists(this.config);
    const text = this._inputText;
    assertExists(text);

    this._resetAbortController();
    // reset answer
    this._answer = null;

    const update = (answer: string) => {
      this._answer = answer;
      this.requestUpdate();
    };
    const finish = (type: 'success' | 'error') => {
      if (type === 'error') {
        this.state = 'error';
      } else {
        this.state = 'finished';
      }

      this._resetAbortController();
    };

    this.state = 'generating';
    this.config.generateAnswer({
      input: text,
      update,
      finish,
      signal: this._abortController.signal,
    });
  };

  stopGenerating = () => {
    this._abortController.abort();
    this.state = 'finished';
  };

  private _abortController = new AbortController();
  private _resetAbortController = () => {
    this._abortController.abort();
    this._abortController = new AbortController();
  };

  private _inputText: string | null = null;
  get inputText() {
    return this._inputText;
  }

  private _answer: string | null = null;
  get answer() {
    return this._answer;
  }

  private _inputFinish = (text: string) => {
    this._inputText = text;
    this.generate();
  };

  override connectedCallback() {
    super.connectedCallback();

    this.tabIndex = -1;
    this.style.outline = 'none';
    this.style.position = 'absolute';
    this.style.zIndex = '1';
    this.style.top = '0';
    this.style.left = '0';
    this.disposables.addFromEvent(this, 'blur', e => {
      console.log('target: ', e);
      if (!e.relatedTarget || this.contains(e.relatedTarget as Node)) return;
      console.log('blur:', this);
      this.hide();
    });
  }

  override render() {
    if (this.state === 'hidden') {
      this.style.display = 'none';
      return nothing;
    } else {
      this.style.display = 'flex';
    }

    if (!this.config) return nothing;
    const config = this.config;

    this.updateComplete
      .then(() => {
        this.focus();
      })
      .catch(console.error);
    return html` <div class="ai-panel-container">
      ${choose(this.state, [
        [
          'input',
          () =>
            html`<ai-panel-input
              .onFinish=${this._inputFinish}
            ></ai-panel-input>`,
        ],
        [
          'generating',
          () => html`
            ${this.answer
              ? html`
                  <ai-panel-answer
                    .finish=${false}
                    .config=${config.finishStateConfig}
                  >
                    ${this.answer &&
                    config.answerRenderer(this.host, this.answer)}
                  </ai-panel-answer>
                `
              : nothing}
            <ai-panel-generating
              .stopGenerating=${this.stopGenerating}
            ></ai-panel-generating>
          `,
        ],
        [
          'finished',
          () => html`
            <ai-panel-answer .config=${config.finishStateConfig}>
              ${this.answer && config.answerRenderer(this.host, this.answer)}
            </ai-panel-answer>
          `,
        ],
        [
          'error',
          () => html`
            <ai-panel-error .config=${config.errorStateConfig}></ai-panel-error>
          `,
        ],
      ])}
    </div>`;
  }
}
