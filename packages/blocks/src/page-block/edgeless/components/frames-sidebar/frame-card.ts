import { WithDisposable } from '@blocksuite/lit';
import { css, html, LitElement } from 'lit';
import { property, query } from 'lit/decorators.js';

import type { FrameBlockModel } from '../../../../frame-block/frame-model.js';
import { FrameCardTitleEditor } from './frame-card-title-editor.js';

export type ReorderEvent = CustomEvent<{
  currentNumber: number;
  targetNumber: number;
  realIndex: number;
}>;

export type SelectEvent = CustomEvent<{
  id: string;
  selected: boolean;
  index: number;
  multiselect: boolean;
}>;

export type DragEvent = CustomEvent<{
  clientX: number;
  clientY: number;
  pageX: number;
  pageY: number;
}>;

export type FitViewEvent = CustomEvent<{
  block: FrameBlockModel;
}>;

const styles = css`
  :host {
    display: block;
  }

  .frame-card-container {
    display: flex;
    flex-direction: column;
    width: 284px;
    height: 198px;
    gap: 8px;
  }

  .frame-card-title {
    display: flex;
    width: 100%;
    height: 20px;
    box-sizing: border-box;
    gap: 6px;
    font-size: 12px;
    font-family: Inter;
    cursor: default;
  }

  .frame-card-title .index {
    display: flex;
    align-self: center;
    align-items: center;
    justify-content: center;
    min-width: 18px;
    height: 16px;
    box-sizing: border-box;
    border-radius: 2px;
    background: var(--light-text-color-text-primary-color, #121212);
    margin-left: 2px;

    color: var(--light-white-pure-white, #fff);
    text-align: center;
    font-weight: 500;
    line-height: 16px;
  }

  .frame-card-title .content {
    flex: 1 0 0;
    height: 20px;
    color: var(--light-text-color-text-primary-color, #121212);
    font-weight: 400;
    line-height: 20px;
    position: relative;
  }

  .frame-card-body {
    display: flex;
    width: 100%;
    height: 170px;
    box-sizing: border-box;
    padding: 8px;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    border: 1px solid var(--light-detail-color-border-color, #e3e2e4);
    background: var(--light-white-pure-white, #fff);
    box-shadow: 0px 0px 12px 0px rgba(66, 65, 73, 0.18);
    cursor: pointer;
  }

  .frame-card-body.selected {
    outline: 2px solid var(--affine-blue-500);
  }
`;

export class FrameCard extends WithDisposable(LitElement) {
  static override styles = styles;

  @property({ attribute: false })
  frame!: FrameBlockModel;

  @property({ attribute: false })
  index!: number;

  @query('.frame-card-title .content')
  titleElement!: HTMLElement;

  @property({ attribute: false })
  status: 'selected' | 'dragging' | 'none' = 'none';

  private _dispatchSelectEvent(e: MouseEvent) {
    const event = new CustomEvent('select', {
      detail: {
        id: this.frame.id,
        selected: this.status !== 'selected',
        index: this.index,
        multiselect: e.shiftKey,
      },
    }) as SelectEvent;

    this.dispatchEvent(event);
  }

  private _dispatchFitViewEvent(e: MouseEvent) {
    e.stopPropagation();

    const event = new CustomEvent('fitview', {
      detail: {
        block: this.frame,
      },
    });

    this.dispatchEvent(event);
  }

  override connectedCallback() {
    super.connectedCallback();
    const { disposables } = this;

    disposables.add(
      this.frame.propsUpdated.on(({ key }) => {
        console.log('frame updated! Key is : ', key);
      })
    );
  }

  override firstUpdated() {
    this.disposables.addFromEvent(this.titleElement, 'dblclick', () => {
      const titleEditor = new FrameCardTitleEditor();
      titleEditor.frameModel = this.frame;
      this.titleElement.appendChild(titleEditor);
    });
  }

  override render() {
    return html`<div class="frame-card-container">
      <div class="frame-card-title">
        <div class="index">${this.index + 1}</div>
        <div class="content">${this.frame.title}</div>
      </div>
      <div
        class="frame-card-body ${this.status === 'selected' ? 'selected' : ''}"
        @click=${this._dispatchSelectEvent}
        @dblclick=${this._dispatchFitViewEvent}
      ></div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'frame-card': FrameCard;
  }
}
