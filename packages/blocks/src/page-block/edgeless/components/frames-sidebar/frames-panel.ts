import './frames-sidebar-header.js';

import { WithDisposable } from '@blocksuite/lit';
import { type Page } from '@blocksuite/store';
import { css, html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

// import { ToggleSwitch } from '../../../../_common/components/toggle-switch.js';
import { FramesSettingMenu } from './frames-setting-menu.js';
import { FramesSidebarHeader } from './frames-sidebar-header.js';

const styles = css`
  :host {
    display: flex;
    flex-direction: column;
    width: 284px;
    height: 100%;
  }

  .frames-sidebar-body {
    width: 284px;
    height: 2000px;
    background: var(--affine-black-10);
  }
`;

export class FramesPanel extends WithDisposable(LitElement) {
  static override styles = styles;

  @property({ attribute: false })
  page!: Page;

  get edgeless() {
    return this.ownerDocument.querySelector('affine-edgeless-page');
  }

  override render() {
    return html`<frames-sidebar-header></frames-sidebar-header>
      <div class="frames-sidebar-body"></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'frames-panel': FramesPanel;
  }
}

const componentsMap = {
  'frames-panel': FramesPanel,
  'frames-sidebar-header': FramesSidebarHeader,
  'frames-setting-menu': FramesSettingMenu,
  // 'toggle-switch': ToggleSwitch,
};

export function registerFramesSidebarComponents(
  callback: (components: typeof componentsMap) => void
) {
  callback(componentsMap);
}
