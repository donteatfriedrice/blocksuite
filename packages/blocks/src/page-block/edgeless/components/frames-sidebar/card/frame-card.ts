import { WithDisposable } from '@blocksuite/lit';
import { css, html, LitElement, nothing } from 'lit';
import { property, query } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

import { on, once } from '../../../../../_common/utils/event.js';
import type { FrameBlockModel } from '../../../../../frame-block/frame-model.js';
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

    position: relative;
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

  .frame-card-title .card-index {
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

  .frame-card-title .card-content {
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

  .frame-card-container.selected .frame-card-body {
    outline: 2px solid var(--affine-blue-500);
  }

  .frame-card-container.dragging {
    pointer-events: none;
    transform-origin: 16px 8px;
    position: fixed;
    top: 0;
    left: 0;
    contain: size layout paint;
    z-index: calc(var(--affine-z-index-popover, 0) + 3);
  }

  .frame-card-container.dragging .frame-card-title {
    display: none;
  }

  .frame-card-container.placeholder {
    /* pointer-events: none; */
    opacity: 0.5;
  }
`;

export class FrameCard extends WithDisposable(LitElement) {
  static override styles = styles;

  @property({ attribute: false })
  frame!: FrameBlockModel;

  @property({ attribute: false })
  cardIndex!: number;

  @property({ attribute: false })
  frameIndex!: string;

  @property({ attribute: false })
  status: 'selected' | 'dragging' | 'placeholder' | 'none' = 'none';

  @property({ attribute: false })
  stackOrder!: number;

  @property({ attribute: false })
  pos!: { x: number; y: number };

  @property({ attribute: false })
  width?: number;

  @query('.frame-card-container')
  containerElement!: HTMLElement;

  @query('.frame-card-title .card-content')
  titleElement!: HTMLElement;

  private _dispatchSelectEvent(e: MouseEvent) {
    e.stopPropagation();
    const event = new CustomEvent('select', {
      detail: {
        id: this.frame.id,
        selected: this.status !== 'selected',
        index: this.cardIndex,
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

  private _dispatchDragEvent(e: MouseEvent) {
    e.preventDefault();

    const { clientX: startX, clientY: startY } = e;
    const disposeDragStart = on(this.ownerDocument, 'mousemove', e => {
      if (
        Math.abs(startX - e.clientX) < 5 &&
        Math.abs(startY - e.clientY) < 5
      ) {
        return;
      }
      if (this.status !== 'selected') {
        this._dispatchSelectEvent(e);
      }

      const event = new CustomEvent('drag', {
        detail: {
          clientX: e.clientX,
          clientY: e.clientY,
          pageX: e.pageX,
          pageY: e.pageY,
        },
      });

      this.dispatchEvent(event);
      disposeDragStart();
    });

    once(this.ownerDocument, 'mouseup', () => {
      disposeDragStart();
    });
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
    const { pos, stackOrder, width } = this;
    const containerStyle =
      this.status === 'dragging'
        ? styleMap({
            transform: `${
              stackOrder === 0
                ? `translate(${pos.x - 16}px, ${pos.y - 8}px)`
                : `translate(${pos.x - 10}px, ${pos.y - 16}px) scale(0.96)`
            }`,
            width: width ? `${width}px` : undefined,
          })
        : {};

    return html`<div
      class="frame-card-container ${this.status ?? ''}"
      style=${containerStyle}
    >
      <div class="frame-card-title">
        <div class="card-index">${this.cardIndex + 1}</div>
        <div class="card-content">${this.frame.title}</div>
      </div>
      <div
        class="frame-card-body"
        @click=${this._dispatchSelectEvent}
        @dblclick=${this._dispatchFitViewEvent}
        @mousedown=${this._dispatchDragEvent}
      ></div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'frame-card': FrameCard;
  }
}
