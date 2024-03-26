// import type { Chain, InitCommandCtx } from '@blocksuite/block-std';
import type { TemplateResult } from 'lit';

import {
  AIDoneIcon,
  AIPenIcon,
  AISearchIcon,
  ExplainIcon,
  ImproveWritingIcon,
  LanguageIcon,
  LongerIcon,
  MakeItRealIcon,
  ShorterIcon,
  TagIcon,
  ToneIcon,
} from '../../../../../_common/icons/ai.js';

// import type { AffineFormatBarWidget } from '../../format-bar.js';

export type AIActionGroup =
  | 'doc'
  | 'edit'
  | 'draft'
  | 'mindMap'
  | 'create'
  | 'code'
  | 'presentation'
  | 'draw'
  | 'others';

export interface AIActionSubConfigItem {
  type: string;
  action?: () => void;
}

export interface AIActionConfigItem {
  type: string;
  name: string;
  icon: TemplateResult | (() => HTMLElement);
  action?: () => void;
  subConfig?: AIActionSubConfigItem[];
}

export interface AIActionConfigGroup {
  name: AIActionGroup;
  items: AIActionConfigItem[];
}

export const TranslateSubConfig: AIActionSubConfigItem[] = [
  { type: 'English' },
  { type: 'Spanish' },
  { type: 'German' },
  { type: 'French' },
  { type: 'Italian' },
  { type: 'Simplified Chinese' },
  { type: 'Traditional Chinese' },
  { type: 'Japanese' },
  { type: 'Russian' },
  { type: 'Korean' },
];

export const ToneSubConfig: AIActionSubConfigItem[] = [
  { type: 'professional' },
  { type: 'informal' },
  { type: 'friendly' },
  { type: 'critical' },
];

export const DocActionGroup: AIActionConfigGroup = {
  name: 'doc',
  items: [
    {
      type: 'ask-ai-action',
      name: 'Summary',
      icon: AIPenIcon,
    },
  ],
};

export const EditActionGroup: AIActionConfigGroup = {
  name: 'edit',
  items: [
    {
      type: 'ask-ai-action',
      name: 'Translate to',
      icon: LanguageIcon,
      subConfig: TranslateSubConfig,
    },
    {
      type: 'ask-ai-action',
      name: 'Change tone to',
      icon: ToneIcon,
      subConfig: ToneSubConfig,
    },
    {
      type: 'ask-ai-action',
      name: 'Improve writing for it',
      icon: ImproveWritingIcon,
    },
    {
      type: 'ask-ai-action',
      name: 'Improve grammar for it',
      icon: AIDoneIcon,
    },
    {
      type: 'ask-ai-action',
      name: 'Fix spelling for it',
      icon: AIDoneIcon,
    },
    {
      type: 'ask-ai-action',
      name: 'Create headings',
      icon: AIPenIcon,
    },
    {
      type: 'ask-ai-action',
      name: 'Make longer',
      icon: LongerIcon,
    },
    {
      type: 'ask-ai-action',
      name: 'Make shorter',
      icon: ShorterIcon,
    },
  ],
};

export const DraftActionGroup: AIActionConfigGroup = {
  name: 'draft',
  items: [
    {
      type: 'ask-ai-action',
      name: 'Write an article about this',
      icon: AIPenIcon,
    },
    {
      type: 'ask-ai-action',
      name: 'Write a Twitter about this',
      icon: AIPenIcon,
    },
    {
      type: 'ask-ai-action',
      name: 'Write a poem about this',
      icon: AIPenIcon,
    },
    {
      type: 'ask-ai-action',
      name: 'Write a blog post about this',
      icon: AIPenIcon,
    },
    {
      type: 'ask-ai-action',
      name: 'Brainstorm ideas about this',
      icon: AIPenIcon,
    },
    {
      type: 'ask-ai-action',
      name: 'Write a outline from this',
      icon: AIPenIcon,
    },
  ],
};

export const MindMapActionGroup: AIActionConfigGroup = {
  name: 'mindMap',
  items: [
    {
      type: 'ask-ai-action',
      name: 'Explain from this mind-map node',
      icon: ExplainIcon,
    },
    {
      type: 'ask-ai-action',
      name: 'Brainstorm ideas with mind-map',
      icon: ExplainIcon,
    },
  ],
};

export const CreateActionGroup: AIActionConfigGroup = {
  name: 'create',
  items: [
    {
      type: 'ask-ai-action',
      name: 'Make it real',
      icon: MakeItRealIcon,
    },
  ],
};

export const CodeActionGroup: AIActionConfigGroup = {
  name: 'code',
  items: [
    {
      type: 'ask-ai-action',
      name: 'Check code error',
      icon: AIPenIcon,
    },
  ],
};

export const PresentationActionGroup: AIActionConfigGroup = {
  name: 'presentation',
  items: [
    {
      type: 'ask-ai-action',
      name: 'Create a presentation',
      icon: AIPenIcon,
    },
  ],
};

export const DrawActionGroup: AIActionConfigGroup = {
  name: 'draw',
  items: [
    {
      type: 'ask-ai-action',
      name: 'Make it real',
      icon: MakeItRealIcon,
    },
  ],
};

export const OthersActionGroup: AIActionConfigGroup = {
  name: 'others',
  items: [
    {
      type: 'ask-ai-action',
      name: 'Summary the webpage',
      icon: AIPenIcon,
    },
    {
      type: 'ask-ai-action',
      name: 'Explain this image',
      icon: AIPenIcon,
    },
    {
      type: 'ask-ai-action',
      name: 'Explain this code',
      icon: AIPenIcon,
    },
    {
      type: 'ask-ai-action',
      name: 'Find action items from it',
      icon: AISearchIcon,
    },
    {
      type: 'ask-ai-action',
      name: 'Explain this',
      icon: ExplainIcon,
    },
    {
      type: 'ask-ai-action',
      name: 'Add tag for this doc',
      icon: TagIcon,
    },
  ],
};

export const AIActionConfig: AIActionConfigGroup[] = [
  DocActionGroup,
  EditActionGroup,
  DraftActionGroup,
  MindMapActionGroup,
  CreateActionGroup,
  CodeActionGroup,
  PresentationActionGroup,
  DrawActionGroup,
  OthersActionGroup,
];
