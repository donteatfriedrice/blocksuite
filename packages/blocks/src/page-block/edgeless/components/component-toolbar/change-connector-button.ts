import '../buttons/tool-icon-button.js';
import '../panel/color-panel.js';
import '../buttons/menu-button.js';

import { countBy, maxBy } from '@blocksuite/global/utils';
import { WithDisposable } from '@blocksuite/lit';
import type { Page } from '@blocksuite/store';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

import type { CssVariableName } from '../../../../__internal__/theme/css-variables.js';
import { LineWidth } from '../../../../__internal__/utils/types.js';
import {
  ConnectorEndPointNoneIcon,
  CurveLineIcon,
  DashLineIcon,
  ElbowedLineIcon,
  EndPointArrowIcon,
  EndPointCircleIcon,
  EndPointDiamondIcon,
  EndPointTriangleIcon,
  FlipDirectionIcon,
  GeneralStyleIcon,
  LineStyleIcon,
  ScribbledStyleIcon,
  SmallArrowDownIcon,
  StartPointArrowIcon,
  StartPointCircleIcon,
  StartPointDiamondIcon,
  StartPointTriangleIcon,
  StraightLineIcon,
} from '../../../../icons/index.js';
import type { PhasorElementType } from '../../../../surface-block/index.js';
import {
  type ConnectorElement,
  ConnectorEndPoint,
  ConnectorEndPointStyle,
  ConnectorMode,
  DEFAULT_FRONT_END_POINT_STYLE,
  DEFAULT_REAR_END_POINT_STYLE,
  StrokeStyle,
} from '../../../../surface-block/index.js';
import type { SurfaceBlockComponent } from '../../../../surface-block/surface-block.js';
import type { EdgelessPageBlockComponent } from '../../edgeless-page-block.js';
import type { LineStyleButtonProps } from '../buttons/line-style-button.js';
import {
  type ColorEvent,
  ColorUnit,
  GET_DEFAULT_LINE_COLOR,
} from '../panel/color-panel.js';
import type { LineWidthEvent } from '../panel/line-width-panel.js';

function getMostCommonColor(elements: ConnectorElement[]): CssVariableName {
  const colors = countBy(elements, (ele: ConnectorElement) => ele.stroke);
  const max = maxBy(Object.entries(colors), ([_k, count]) => count);
  return max ? (max[0] as CssVariableName) : GET_DEFAULT_LINE_COLOR();
}

function getMostCommonMode(elements: ConnectorElement[]): ConnectorMode | null {
  const modes = countBy(elements, (ele: ConnectorElement) => ele.mode);
  const max = maxBy(Object.entries(modes), ([_k, count]) => count);
  return max ? (Number(max[0]) as ConnectorMode) : null;
}

function getMostCommonLineWidth(elements: ConnectorElement[]): LineWidth {
  const sizes = countBy(elements, (ele: ConnectorElement) => {
    return ele.strokeWidth;
  });
  const max = maxBy(Object.entries(sizes), ([_k, count]) => count);
  return max ? (Number(max[0]) as LineWidth) : LineWidth.LINE_WIDTH_FOUR;
}

export function getMostCommonLineStyle(
  elements: ConnectorElement[]
): LineStyleButtonProps['mode'] | null {
  const sizes = countBy(elements, (ele: ConnectorElement) => {
    switch (ele.strokeStyle) {
      case StrokeStyle.Solid: {
        return 'solid';
      }
      case StrokeStyle.Dashed: {
        return 'dash';
      }
      case StrokeStyle.None: {
        return 'none';
      }
    }
  });
  const max = maxBy(Object.entries(sizes), ([_k, count]) => count);
  return max ? (max[0] as LineStyleButtonProps['mode']) : null;
}

function getMostCommonRough(elements: ConnectorElement[]): boolean {
  const { trueCount, falseCount } = elements.reduce(
    (counts, ele) => {
      if (ele.rough) {
        counts.trueCount++;
      } else {
        counts.falseCount++;
      }
      return counts;
    },
    { trueCount: 0, falseCount: 0 }
  );

  return trueCount > falseCount;
}

function getMostCommonEndPointStyle(
  elements: ConnectorElement[],
  end: ConnectorEndPoint
): ConnectorEndPointStyle | null {
  const modes = countBy(elements, (ele: ConnectorElement) =>
    end === ConnectorEndPoint.Front
      ? ele.frontEndPointStyle
      : ele.rearEndPointStyle
  );
  const max = maxBy(Object.entries(modes), ([_k, count]) => count);
  return max ? (max[0] as ConnectorEndPointStyle) : null;
}

@customElement('edgeless-change-connector-button')
export class EdgelessChangeConnectorButton extends WithDisposable(LitElement) {
  static override styles = [
    css`
      :host {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        color: var(--affine-text-primary-color);
        fill: currentColor;
      }

      menu-divider {
        height: 24px;
      }

      .connector-style-sub-menu {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
      }
    `,
  ];

  @property({ attribute: false })
  edgeless!: EdgelessPageBlockComponent;

  @property({ attribute: false })
  elements: ConnectorElement[] = [];

  @property({ attribute: false })
  page!: Page;

  @property({ attribute: false })
  surface!: SurfaceBlockComponent;

  private _setConnectorMode(mode: ConnectorMode) {
    this.page.captureSync();
    this.elements.forEach(element => {
      if (element.mode !== mode) {
        this.surface.updateElement<PhasorElementType.CONNECTOR>(element.id, {
          mode,
        });
      }
    });
  }

  private _setConnectorRough(rough: boolean) {
    this.page.captureSync();
    this.elements.forEach(element => {
      if (element.rough !== rough) {
        this.surface.updateElement<PhasorElementType.CONNECTOR>(element.id, {
          rough,
        });
      }
    });
  }

  private _setConnectorColor(stroke: CssVariableName) {
    this.page.captureSync();

    let shouldUpdate = false;
    this.elements.forEach(element => {
      if (element.stroke !== stroke) {
        shouldUpdate = true;
        this.surface.updateElement<PhasorElementType.CONNECTOR>(element.id, {
          stroke,
        });
      }
    });
    if (shouldUpdate) this.requestUpdate();
  }

  private _setConnectorStrokeWidth(strokeWidth: number) {
    this.elements.forEach(ele => {
      this.surface.updateElement<PhasorElementType.CONNECTOR>(ele.id, {
        strokeWidth,
      });
    });
  }

  private _setConnectorStrokeStyle(strokeStyle: StrokeStyle) {
    this.elements.forEach(ele => {
      this.surface.updateElement<PhasorElementType.CONNECTOR>(ele.id, {
        strokeStyle,
      });
    });
  }

  private _setConnectorEndPointStyle(
    end: ConnectorEndPoint,
    style: ConnectorEndPointStyle
  ) {
    this.elements.forEach(ele => {
      if (end === ConnectorEndPoint.Front) {
        this.surface.updateElement<PhasorElementType.CONNECTOR>(ele.id, {
          frontEndPointStyle: style,
        });
      } else {
        this.surface.updateElement<PhasorElementType.CONNECTOR>(ele.id, {
          rearEndPointStyle: style,
        });
      }
    });
  }

  private _flipEndPointStyle(
    frontEndPointStyle: ConnectorEndPointStyle,
    rearEndPointStyle: ConnectorEndPointStyle
  ) {
    if (frontEndPointStyle === rearEndPointStyle) return;

    this.elements.forEach(ele => {
      this.surface.updateElement<PhasorElementType.CONNECTOR>(ele.id, {
        frontEndPointStyle: rearEndPointStyle,
        rearEndPointStyle: frontEndPointStyle,
      });
    });
  }

  private _getEndPointIcon(
    end: ConnectorEndPoint,
    style: ConnectorEndPointStyle
  ) {
    switch (style) {
      case ConnectorEndPointStyle.None: {
        return ConnectorEndPointNoneIcon;
      }
      case ConnectorEndPointStyle.Arrow: {
        return end === ConnectorEndPoint.Front
          ? StartPointArrowIcon
          : EndPointArrowIcon;
      }
      case ConnectorEndPointStyle.Triangle: {
        return end === ConnectorEndPoint.Front
          ? StartPointTriangleIcon
          : EndPointTriangleIcon;
      }
      case ConnectorEndPointStyle.Circle: {
        return end === ConnectorEndPoint.Front
          ? StartPointCircleIcon
          : EndPointCircleIcon;
      }
      case ConnectorEndPointStyle.Diamond: {
        return end === ConnectorEndPoint.Front
          ? StartPointDiamondIcon
          : EndPointDiamondIcon;
      }
    }
  }

  override render() {
    const selectedColor = getMostCommonColor(this.elements);
    const selectedMode = getMostCommonMode(this.elements);
    const selectedLineSize =
      getMostCommonLineWidth(this.elements) ?? LineWidth.LINE_WIDTH_FOUR;
    const selectedRough = getMostCommonRough(this.elements);
    const selectedLineStyle = getMostCommonLineStyle(this.elements);
    const selectedStartPointStyle =
      getMostCommonEndPointStyle(this.elements, ConnectorEndPoint.Front) ??
      DEFAULT_FRONT_END_POINT_STYLE;
    const selectedEndPointStyle =
      getMostCommonEndPointStyle(this.elements, ConnectorEndPoint.Rear) ??
      DEFAULT_REAR_END_POINT_STYLE;

    return html`
      <edgeless-menu-button
        .padding=${4}
        class="connector-color-button"
        .iconInfo=${{
          icon: html`${ColorUnit(selectedColor)}`,
          tooltip: 'Color',
        }}
        .menuChildren=${html` <edgeless-color-panel
          .value=${selectedColor}
          @select=${(e: ColorEvent) => this._setConnectorColor(e.detail)}
        >
        </edgeless-color-panel>`}
      ></edgeless-menu-button>

      <menu-divider .vertical=${true} .dividerMargin=${12}></menu-divider>

      <edgeless-menu-button
        class="line-styles-button"
        .padding=${8}
        .gap=${8}
        .iconInfo=${{
          icon: html`${LineStyleIcon}${SmallArrowDownIcon}`,
          tooltip: 'Border style',
        }}
        .menuChildren=${html`
          <edgeless-line-width-panel
            .selectedSize=${selectedLineSize as LineWidth}
            @select=${(e: LineWidthEvent) => {
              this._setConnectorStrokeWidth(e.detail);
            }}
          ></edgeless-line-width-panel>
          <menu-divider
            .vertical=${true}
            .dividerMargin=${2}
            style=${styleMap({ height: '24px' })}
          ></menu-divider>
          <edgeless-tool-icon-button
            class=${`edgeless-component-line-style-button-${StrokeStyle.Solid}`}
            .tooltip=${'Solid'}
            .active=${selectedLineStyle === StrokeStyle.Solid}
            .activeMode=${'background'}
            .iconContainerPadding=${2}
            @click=${() => this._setConnectorStrokeStyle(StrokeStyle.Solid)}
          >
            ${StraightLineIcon}
          </edgeless-tool-icon-button>
          <edgeless-tool-icon-button
            class=${`edgeless-component-line-style-button-${StrokeStyle.Dashed}`}
            .tooltip=${'Dash'}
            .active=${selectedLineStyle === StrokeStyle.Dashed}
            .activeMode=${'background'}
            .iconContainerPadding=${2}
            @click=${() => this._setConnectorStrokeStyle(StrokeStyle.Dashed)}
          >
            ${DashLineIcon}
          </edgeless-tool-icon-button>
        `}
      >
      </edgeless-menu-button>

      <menu-divider .vertical=${true} .dividerMargin=${12}></menu-divider>

      <edgeless-menu-button
        .padding=${8}
        .gap=${8}
        .iconInfo=${{
          icon: html`${selectedRough
            ? ScribbledStyleIcon
            : GeneralStyleIcon}${SmallArrowDownIcon}`,
          tooltip: 'Style',
        }}
        .menuChildren=${html`
          <edgeless-tool-icon-button
            .tooltip=${'General'}
            .iconContainerPadding=${2}
            .active=${!selectedRough}
            .activeMode=${'background'}
            @click=${() => this._setConnectorRough(false)}
          >
            ${GeneralStyleIcon}
          </edgeless-tool-icon-button>
          <edgeless-tool-icon-button
            .tooltip=${'Scribbled'}
            .active=${selectedRough}
            .activeMode=${'background'}
            .iconContainerPadding=${2}
            @click=${() => this._setConnectorRough(true)}
          >
            ${ScribbledStyleIcon}
          </edgeless-tool-icon-button>
        `}
      >
      </edgeless-menu-button>

      <menu-divider .vertical=${true} .dividerMargin=${12}></menu-divider>

      <div class="connector-style-sub-menu">
        <edgeless-menu-button
          .padding=${8}
          .gap=${8}
          .iconInfo=${{
            icon: html`${this._getEndPointIcon(
              ConnectorEndPoint.Front,
              selectedStartPointStyle
            )}${SmallArrowDownIcon}`,
            tooltip: 'Start Point Style',
          }}
          .menuChildren=${html`
            <edgeless-tool-icon-button
              .tooltip=${'None'}
              .iconContainerPadding=${2}
              .active=${selectedStartPointStyle === ConnectorEndPointStyle.None}
              .activeMode=${'background'}
              @click=${() =>
                this._setConnectorEndPointStyle(
                  ConnectorEndPoint.Front,
                  ConnectorEndPointStyle.None
                )}
            >
              ${ConnectorEndPointNoneIcon}
            </edgeless-tool-icon-button>
            <edgeless-tool-icon-button
              .tooltip=${'Arrow'}
              .iconContainerPadding=${2}
              .active=${selectedStartPointStyle ===
              ConnectorEndPointStyle.Arrow}
              .activeMode=${'background'}
              @click=${() =>
                this._setConnectorEndPointStyle(
                  ConnectorEndPoint.Front,
                  ConnectorEndPointStyle.Arrow
                )}
            >
              ${StartPointArrowIcon}
            </edgeless-tool-icon-button>
            <edgeless-tool-icon-button
              .tooltip=${'Triangle'}
              .iconContainerPadding=${2}
              .active=${selectedStartPointStyle ===
              ConnectorEndPointStyle.Triangle}
              .activeMode=${'background'}
              @click=${() =>
                this._setConnectorEndPointStyle(
                  ConnectorEndPoint.Front,
                  ConnectorEndPointStyle.Triangle
                )}
            >
              ${StartPointTriangleIcon}
            </edgeless-tool-icon-button>
            <edgeless-tool-icon-button
              .tooltip=${'Circle'}
              .iconContainerPadding=${2}
              .active=${selectedStartPointStyle ===
              ConnectorEndPointStyle.Circle}
              .activeMode=${'background'}
              @click=${() =>
                this._setConnectorEndPointStyle(
                  ConnectorEndPoint.Front,
                  ConnectorEndPointStyle.Circle
                )}
            >
              ${StartPointCircleIcon}
            </edgeless-tool-icon-button>
            <edgeless-tool-icon-button
              .tooltip=${'Diamond'}
              .iconContainerPadding=${2}
              .active=${selectedStartPointStyle ===
              ConnectorEndPointStyle.Diamond}
              .activeMode=${'background'}
              @click=${() =>
                this._setConnectorEndPointStyle(
                  ConnectorEndPoint.Front,
                  ConnectorEndPointStyle.Diamond
                )}
            >
              ${StartPointDiamondIcon}
            </edgeless-tool-icon-button>
          `}
        >
        </edgeless-menu-button>

        <edgeless-tool-icon-button
          .tooltip=${'Flip Direction'}
          .iconContainerPadding=${2}
          .disabled=${false}
          @click=${() =>
            this._flipEndPointStyle(
              selectedStartPointStyle,
              selectedEndPointStyle
            )}
        >
          ${FlipDirectionIcon}
        </edgeless-tool-icon-button>

        <edgeless-menu-button
          .padding=${8}
          .gap=${8}
          .iconInfo=${{
            icon: html`${this._getEndPointIcon(
              ConnectorEndPoint.Rear,
              selectedEndPointStyle
            )}${SmallArrowDownIcon}`,
            tooltip: 'End Point Style',
          }}
          .menuChildren=${html`
            <edgeless-tool-icon-button
              .tooltip=${'Diamond'}
              .iconContainerPadding=${2}
              .active=${selectedEndPointStyle ===
              ConnectorEndPointStyle.Diamond}
              .activeMode=${'background'}
              @click=${() =>
                this._setConnectorEndPointStyle(
                  ConnectorEndPoint.Rear,
                  ConnectorEndPointStyle.Diamond
                )}
            >
              ${EndPointDiamondIcon}
            </edgeless-tool-icon-button>
            <edgeless-tool-icon-button
              .tooltip=${'Circle'}
              .iconContainerPadding=${2}
              .active=${selectedEndPointStyle === ConnectorEndPointStyle.Circle}
              .activeMode=${'background'}
              @click=${() =>
                this._setConnectorEndPointStyle(
                  ConnectorEndPoint.Rear,
                  ConnectorEndPointStyle.Circle
                )}
            >
              ${EndPointCircleIcon}
            </edgeless-tool-icon-button>
            <edgeless-tool-icon-button
              .tooltip=${'Triangle'}
              .iconContainerPadding=${2}
              .active=${selectedEndPointStyle ===
              ConnectorEndPointStyle.Triangle}
              .activeMode=${'background'}
              @click=${() =>
                this._setConnectorEndPointStyle(
                  ConnectorEndPoint.Rear,
                  ConnectorEndPointStyle.Triangle
                )}
            >
              ${EndPointTriangleIcon}
            </edgeless-tool-icon-button>
            <edgeless-tool-icon-button
              .tooltip=${'Arrow'}
              .iconContainerPadding=${2}
              .active=${selectedEndPointStyle === ConnectorEndPointStyle.Arrow}
              .activeMode=${'background'}
              @click=${() =>
                this._setConnectorEndPointStyle(
                  ConnectorEndPoint.Rear,
                  ConnectorEndPointStyle.Arrow
                )}
            >
              ${EndPointArrowIcon}
            </edgeless-tool-icon-button>
            <edgeless-tool-icon-button
              .tooltip=${'None'}
              .iconContainerPadding=${2}
              .active=${selectedEndPointStyle === ConnectorEndPointStyle.None}
              .activeMode=${'background'}
              @click=${() =>
                this._setConnectorEndPointStyle(
                  ConnectorEndPoint.Rear,
                  ConnectorEndPointStyle.None
                )}
            >
              ${ConnectorEndPointNoneIcon}
            </edgeless-tool-icon-button>
          `}
        >
        </edgeless-menu-button>

        <edgeless-menu-button
          .padding=${8}
          .gap=${8}
          .iconInfo=${{
            icon: html`${selectedMode === ConnectorMode.Straight
              ? StraightLineIcon
              : selectedMode === ConnectorMode.Orthogonal
              ? ElbowedLineIcon
              : CurveLineIcon}${SmallArrowDownIcon}`,
            tooltip: 'Connector Shape',
          }}
          .menuChildren=${html`
            <edgeless-tool-icon-button
              .tooltip=${'Straight'}
              .iconContainerPadding=${2}
              .active=${selectedMode === ConnectorMode.Straight}
              .activeMode=${'background'}
              @click=${() => this._setConnectorMode(ConnectorMode.Straight)}
            >
              ${StraightLineIcon}
            </edgeless-tool-icon-button>
            <edgeless-tool-icon-button
              .tooltip=${'Elbowed'}
              .iconContainerPadding=${2}
              .active=${selectedMode === ConnectorMode.Orthogonal}
              .activeMode=${'background'}
              @click=${() => this._setConnectorMode(ConnectorMode.Orthogonal)}
            >
              ${ElbowedLineIcon}
            </edgeless-tool-icon-button>
            <edgeless-tool-icon-button
              .tooltip=${'Curve'}
              .iconContainerPadding=${2}
              .active=${selectedMode === ConnectorMode.Curve}
              .activeMode=${'background'}
              @click=${() => this._setConnectorMode(ConnectorMode.Curve)}
            >
              ${CurveLineIcon}
            </edgeless-tool-icon-button>
          `}
        >
        </edgeless-menu-button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'edgeless-change-connector-button': EdgelessChangeConnectorButton;
  }
}
