import type { BlockModel } from '@blocksuite/store';
import { CSSResult, type CSSResultGroup, type CSSResultOrNative } from 'lit';

import type { BlockElement } from './block-element.js';
import { WidgetElement } from './widget-element.js';

export class ShadowlessWidgetElement<
  Model extends BlockModel = BlockModel,
  B extends BlockElement = BlockElement,
> extends WidgetElement<Model, B> {
  protected static override finalizeStyles(
    styles?: CSSResultGroup
  ): CSSResultOrNative[] {
    let elementStyles = super.finalizeStyles(styles);
    // XXX: This breaks component encapsulation and applies styles to the document.
    // These styles should be manually scoped.
    elementStyles.forEach((s: CSSResultOrNative) => {
      if (s instanceof CSSResult && typeof document !== 'undefined') {
        const styleRoot = document.head;
        const style = document.createElement('style');
        style.textContent = s.cssText;
        styleRoot.append(style);
      } else {
        console.error('unreachable');
      }
    });
    elementStyles = [];
    return elementStyles;
  }

  override createRenderRoot() {
    return this;
  }
}
