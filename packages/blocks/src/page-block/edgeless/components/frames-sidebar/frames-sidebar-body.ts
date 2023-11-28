import './frame-card.js';

import { WithDisposable } from '@blocksuite/lit';
import { css, html, LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';

import type { FrameBlockModel } from '../../../../models.js';
import { EdgelessBlockType } from '../../../../surface-block/edgeless-types.js';
import { Bound } from '../../../../surface-block/utils/bound.js';
import type { EdgelessPageBlockComponent } from '../../edgeless-page-block.js';
import type { FitViewEvent, SelectEvent } from './frame-card.js';

const styles = css`
  :host {
    display: block;
    box-sizing: content-box;
    width: 100%;
    height: 100%;
    /* overflow-y: scroll; */
  }

  .frames-sidebar-body {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 12px;
  }

  .no-frames-placeholder {
    margin-top: 240px;
    align-self: center;
    width: 230px;
    height: 48px;
    color: var(--affine-text-secondary-color, #8e8d91);
    text-align: center;

    /* light/base */
    font-size: 15px;
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
  }
`;

const { FRAME } = EdgelessBlockType;

export class FramesSidebarBody extends WithDisposable(LitElement) {
  static override styles = styles;

  @property({ attribute: false })
  edgeless!: EdgelessPageBlockComponent;

  @state()
  private _frames: FrameBlockModel[] = [];

  // Store the ids of the selected frames
  @state()
  private _selected: string[] = [];

  @property({ attribute: false })
  fitPadding!: number[];

  get viewportPadding(): [number, number, number, number] {
    return this.fitPadding
      ? ([0, 0, 0, 0].map((val, idx) =>
          Number.isFinite(this.fitPadding[idx]) ? this.fitPadding[idx] : val
        ) as [number, number, number, number])
      : [0, 0, 0, 0];
  }

  private _updateFrames() {
    this._frames = this.edgeless.surface.frame.frames.sort(
      this.edgeless.surface.compare
    );
  }

  private _selectFrame(e: SelectEvent) {
    const { selected, id, multiselect } = e.detail;

    if (!selected) {
      // de-select frame
      this._selected = this._selected.filter(frameId => frameId !== id);
    } else if (multiselect) {
      this._selected = [...this._selected, id];
    } else {
      this._selected = [id];
    }

    this.edgeless.selectionManager.setSelection({
      elements: this._selected,
      editing: false,
    });
  }

  private _fitToElement(e: FitViewEvent) {
    const { block } = e.detail;
    const bound = Bound.deserialize(block.xywh);

    this.edgeless.surface.viewport.setViewportByBound(
      bound,
      this.viewportPadding,
      true
    );
  }

  private _renderEmptyContent() {
    const emptyContent = html` <div class="no-frames-placeholder">
      Add frames to organize and present your Edgeless
    </div>`;

    return emptyContent;
  }

  private _renderFrames() {
    const selectedFrames = new Set(this._selected);
    const frameCards = this._frames.map(
      (frame, index) =>
        html`<frame-card
          .frame=${frame}
          .index=${index}
          .status=${selectedFrames.has(frame.id) ? 'selected' : 'none'}
          @select=${this._selectFrame}
          @fitview=${this._fitToElement}
        ></frame-card>`
    );

    return frameCards;
  }

  override connectedCallback() {
    super.connectedCallback();
    const { surface, page } = this.edgeless;
    this._frames = surface.frame.frames.sort(surface.compare);

    const { disposables } = this;
    disposables.add(
      page.slots.blockUpdated.on(({ flavour, type }) => {
        if (flavour === FRAME && type !== 'update') {
          requestAnimationFrame(() => {
            this._updateFrames();
          });
        }
      })
    );
    disposables.add(
      page.slots.blockUpdated.on(e => {
        if (e.type === 'update') {
          this._updateFrames();
        }
      })
    );
  }

  override render() {
    return html`<div class="frames-sidebar-body">
      ${this._frames.length ? this._renderFrames() : this._renderEmptyContent()}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'frames-sidebar-body': FramesSidebarBody;
  }
}
