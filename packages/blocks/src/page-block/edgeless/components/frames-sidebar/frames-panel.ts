import './frames-sidebar-header.js';

import { WithDisposable } from '@blocksuite/lit';
import { css, html, LitElement } from 'lit';

import { FramesSettingMenu } from './frames-setting-menu.js';
import { FramesSidebarHeader } from './frames-sidebar-header.js';

const styles = css`
  :host {
    display: flex;
    flex-direction: column;
    width: 284px;
    height: 100%;
  }
`;

export class FramesPanel extends WithDisposable(LitElement) {
  static override styles = styles;

  override render() {
    return html`<frames-sidebar-header></frames-sidebar-header>`;
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
};

export function registerFramesSidebarComponents(
  callback: (components: typeof componentsMap) => void
) {
  callback(componentsMap);
}
