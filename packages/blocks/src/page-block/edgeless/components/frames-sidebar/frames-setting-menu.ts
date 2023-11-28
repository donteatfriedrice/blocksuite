import '../../../../_common/components/menu-divider.js';
import '../../../../_common/components/toggle-switch.js';

// import '../../../../_common/components/toggle-switch.js';
import { WithDisposable } from '@blocksuite/lit';
import { css, html, LitElement } from 'lit';

import { stopPropagation } from '../../../../_common/utils/event.js';

const styles = css`
  :host {
    display: block;
    width: 100%;
    height: 100%;
  }

  .frames-setting-menu-container {
    display: flex;
    flex-direction: column;
    width: 254px;
    height: 128px;
    padding: 8px;
  }

  .frames-setting-menu-item {
    display: flex;
    box-sizing: border-box;
    width: 100%;
    height: 28px;
    padding: 4px 12px;
    align-items: center;
  }

  .frames-setting-menu-item .setting-label {
    font-family: sans-serif;
    font-size: 12px;
    font-weight: 500;
    line-height: 20px;
    color: var(--affine-text-secondary-color);
    padding: 0 4px;
  }

  .frames-setting-menu-divider {
    width: 100%;
    height: 1px;
    box-sizing: border-box;
    background: var(--affine-border-color);
    margin: 8px 0;
  }

  .frames-setting-menu-item.action {
    gap: 4px;
  }

  .frames-setting-menu-item .action-label {
    width: 180px;
    height: 20px;
    padding: 0 4px;
    font-family: sans-serif;
    font-size: 12px;
    font-weight: 500;
    line-height: 20px;
    color: var(--affine-text-primary-color);
  }

  .frames-setting-menu-item .toggle-button {
    display: flex;
  }

  menu-divider {
    height: 16px;
  }
`;

export class FramesSettingMenu extends WithDisposable(LitElement) {
  static override styles = styles;

  override render() {
    return html`<div
      class="frames-setting-menu-container"
      @click=${stopPropagation}
    >
      <div class="frames-setting-menu-item">
        <div class="setting-label">Preview Settings</div>
      </div>
      <div class="frames-setting-menu-item action">
        <div class="action-label">Fill Screen</div>
        <div class="toggle-button"><toggle-switch></toggle-switch></div>
      </div>

      <menu-divider></menu-divider>

      <div class="frames-setting-menu-item">
        <div class="setting-label">Playback Settings</div>
      </div>
      <div class="frames-setting-menu-item action">
        <div class="action-label">Hide toolbar while presenting</div>
        <div class="toggle-button"><toggle-switch></toggle-switch></div>
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'frames-setting-menu': FramesSettingMenu;
  }
}
