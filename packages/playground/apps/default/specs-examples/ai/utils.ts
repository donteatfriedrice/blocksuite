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
  const collection = new DocCollection({ schema });
  const job = new Job({
    collection,
    middlewares: [defaultImageProxyMiddleware],
  });
  const mdAdapter = new MarkdownAdapter();
  // remove empty lines of answer
  answer = answer.replace(/^\s*[\r\n]/gm, '');
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

![](assets//static/27f983d0765289c19d10ee0b51c00c3c7665236a1a82406370d46e0a.gif.gif)

### Organise Your Pages

Manage your favourites and add links between your pages to easily navigate between them. This makes it easy to keep track of your content, and ensures that you always know where everything is.

![](assets//static/1326bc48553a572c6756d9ee1b30a0dfdda26222fc2d2c872b14e609.gif.gif)

### Write Your Content

Easily create rich, interactive pages that combine text, images, and other media to create a dynamic, engaging experience.

![](assets//static/28516717d63e469cd98729ff46be6595711898bab3dc43302319a987.gif.gif)

### Draw and Be Creative

Our Edgeless Mode can be utilised as a whiteboard, allowing you to create content that extends beyond the boundaries of a traditional page - limited only by your imagination.

![](assets//static/9288be57321c8772d04e05dbb69a22742372b3534442607a2d6a9998.gif.gif)

### Plan Effectively and Efficiently

With powerful databases, you can create content within tables and leverage powerful features such as adding due dates, tracking progress, and adding tags and status labels.

![](assets//static/c820edeeba50006b531883903f5bb0b96bf523c9a6b3ce5868f03db5.gif.gif)

## More support?

There are some useful resources in the Help and Feedback section.

If you are looking for more support, you can come and join the awesome [AFFiNE Community](https://community.affine.pro) . Whether you want to share new ideas or interact with other like-minded individuals - we look forward to having you.

![](assets//static/e93536e1be97e3b5206d43bf0793fdef24e60044d174f0abdefebe08.gif.gif)



***

| Title           | Title           | Tag  | Progress |
| --------------- | --------------- | ---- | -------- |
| Download AFFiNE | Download AFFiNE | Tag1 | 100      |
| Learn AFFiNE    | Learn AFFiNE    | Tag2 | 41       |
| Use AFFiNE      | Use AFFiNE      | Tag3 | 23       |

![](assets//static/047ebf2c9a5c7c9d8521c2ea5e6140ff7732ef9e28a9f944e9bf3ca4.png.png)

![](assets//static/6aa785ee927547ce9dd9d7b43e01eac948337fe57571443e87bc3a60.png.png)
`;
