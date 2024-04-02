import type { EditorHost } from '@blocksuite/block-std';
import {
  type AffineAIPanelWidget,
  type AffineAIPanelWidgetConfig,
  defaultImageProxyMiddleware,
  MarkdownAdapter,
} from '@blocksuite/blocks';
import type { CopilotClient } from '@blocksuite/presets';
import { type Doc, DocCollection, Job } from '@blocksuite/store';

export function getGenerateAnswer({
  copilotClient,
  panel,
}: {
  copilotClient: CopilotClient;
  panel: AffineAIPanelWidget;
}) {
  const generateAnswer: AffineAIPanelWidgetConfig['generateAnswer'] = ({
    input,
    update,
    finish,
    signal,
  }) => {
    console.log(copilotClient, panel, input, update, finish, signal);
    update(mockData);
  };
  //   copilotClient
  //     .createSession({
  //       workspaceId: panel.host.doc.collection.id,
  //       docId: panel.host.doc.id,
  //       action: true,
  //       model: 'Gpt4TurboPreview',
  //       promptName: '',
  //     })
  //     .then(sessionId => {
  //       const stream = copilotClient.textToTextStream(input, sessionId);
  //       let timeout: ReturnType<typeof setTimeout> | null = null;
  //       stream.addEventListener('message', e => {
  //         if (timeout) clearTimeout(timeout);
  //         update((panel.answer ?? '') + e.data);

  //         // Terminate after 5 seconds of inactivity
  //         timeout = setTimeout(() => {
  //           finish('error');
  //           stream.close();
  //         }, 5000);
  //       });
  //       stream.addEventListener('error', () => {
  //         if (timeout) clearTimeout(timeout);
  //         finish('success');
  //       });
  //       signal.addEventListener('abort', () => {
  //         stream.close();
  //       });
  //     })
  //     .catch(console.error);
  // };
  return generateAnswer;
}

export async function markDownToDoc(host: EditorHost, answer: string) {
  const schema = host.std.doc.collection.schema;
  // Should not create a new doc in the original collection
  const collection = new DocCollection({ schema });
  const job = new Job({
    collection,
    middlewares: [defaultImageProxyMiddleware],
  });
  const mdAdapter = new MarkdownAdapter();
  // remove empty lines of answer
  mdAdapter.applyConfigs(job.adapterConfigs);
  const snapshot = await mdAdapter.toDocSnapshot({
    file: answer,
    assets: job.assetsManager,
  });
  const doc = await job.snapshotToDoc(snapshot);
  if (!doc) throw new Error('Failed to convert markdown to doc');
  return doc as Doc;
}

const mockData: string = `# AFFiNE - not just a note-taking app

There are lots of apps out there, so why chose AFFiNE?

AFFiNE is **feature-rich** - offering a wide-range of *blocks* that *empower* your docs

AFFiNE is **privacy focused** - with a local-first approach, keep control of your data

AFFiNE is **open**-**source** - you can check us out on

***

# Let's **Write**, **Draw** and **Plan** with **AFFiNE**

### Create Your Workspace

Creating a workspace in AFFiNE is easy! With just a few clicks, you can create a new workspace and start organising your content in a clean, user-friendly interface.

### Organise Your Pages

Manage your favourites and add links between your pages to easily navigate between them. This makes it easy to keep track of your content, and ensures that you always know where everything is.

### Write Your Content

Easily create rich, interactive pages that combine text, images, and other media to create a dynamic, engaging experience.

### Draw and Be Creative

Our Edgeless Mode can be utilised as a whiteboard, allowing you to create content that extends beyond the boundaries of a traditional page - limited only by your imagination.

### Plan Effectively and Efficiently

With powerful databases, you can create content within tables and leverage powerful features such as adding due dates, tracking progress, and adding tags and status labels.

## More support?

There are some useful resources in the Help and Feedback section.

If you are looking for more support, you can come and join the awesome [AFFiNE Community](https://community.affine.pro) . Whether you want to share new ideas or interact with other like-minded individuals - we look forward to having you.

***
`;
