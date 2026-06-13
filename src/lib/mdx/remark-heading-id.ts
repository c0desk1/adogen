import { visit } from 'unist-util-visit';
import type { Root, Heading, PhrasingContent } from 'mdast';

function sluggify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function remarkHeadingId() {
  return (tree: Root) => {
    visit(tree, 'heading', (node: Heading) => {
      let text = '';
      const collectText = (nodes: PhrasingContent[]) => {
        for (const child of nodes) {
          if (child.type === 'text') {
            text += child.value;
          } else if ('children' in child && child.children) {
            collectText(child.children as PhrasingContent[]);
          }
        }
      };
      collectText(node.children);

      const id = sluggify(text);
      if (id) {
        node.data = node.data || {};
        node.data.hProperties = {
          ...(node.data.hProperties || {}),
          id,
        };
      }
    });
  };
}
