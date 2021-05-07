// brian taylor vann
// chunk utils

import type { Hooks } from "../type_flyweight/hooks.ts";
import type { RenderStructure } from "../type_flyweight/render.ts";
import type { Template } from "../type_flyweight/template.ts";

type HasTemplateChanged = (
  rs: RenderStructure<unknown, unknown>,
  template: Template<unknown, unknown>,
) => boolean;

type UpdateAttributesFunc = <N, A>(
  hooks: Hooks<N, A>,
  rs: RenderStructure<N, A>,
  template: Template<N, A>,
) => void;

interface UpdateDescendantsFuncParams<N, A> {
  hooks: Hooks<N, A>;
  rs: RenderStructure<N, A>;
  template: Template<N, A>;
  chunkLeftNode?: N;
  chunkParentNode?: N;
}

type UpdateDescendantsFunc = <N, A>(
  params: UpdateDescendantsFuncParams<N, A>,
) => boolean;

type DisconnectDescendants = <N, A>(
  hooks: Hooks<N, A>,
  rs: RenderStructure<N, A>,
) => void;

type GetUpdatedSiblings = <N, A>(rs: RenderStructure<N, A>) => N[];

const getUpdatedSiblings: GetUpdatedSiblings = (rs) => {
  const siblingsDelta = [];

  const siblings = rs.siblings;
  for (const siblingsID in siblings) {
    const siblingArray = siblings[siblingsID];
    for (const siblingID in siblingArray) {
      const sibling = siblingArray[siblingID];
      siblingsDelta.push(sibling);
    }
  }

  return siblingsDelta;
};

const hasTemplateChanged: HasTemplateChanged = (rs, template) => {
  const templateLength = template.templateArray.length;
  if (rs.template.templateArray.length !== templateLength) {
    return true;
  }

  let index = 0;
  while (index < templateLength) {
    const sourceStr = rs.template.templateArray[index];
    const targetStr = template.templateArray[index];
    if (sourceStr !== targetStr) {
      return true;
    }

    index += 1;
  }

  return false;
};

// compare future template to current template (past injection)
const updateAttributes: UpdateAttributesFunc = (hooks, rs, template) => {
  for (const attributesID in rs.attributes) {
    const pastInjection = rs.attributes[attributesID];
    const attributeValue = template.injections[attributesID];

    // check if attribute value has changed
    if (attributeValue === pastInjection.params.value) {
      continue;
    }

    // give yourself a chance to remove attribute
    pastInjection.params.value = attributeValue;
    hooks.setAttribute(pastInjection.params);
  }
};

const updateDescendants: UpdateDescendantsFunc = ({
  hooks,
  rs,
  template,
  chunkParentNode,
}) => {
  let siblingLevelUpdated = false;

  // iterate through descendants
  for (const descenantID in rs.descendants) {
    const pastDescendant = rs.descendants[descenantID];
    const descendant = template.injections[descenantID];

    // both descendants are strings
    const text = String(descendant);
    if (pastDescendant.kind === "TEXT" && !Array.isArray(descendant)) {
      if (pastDescendant.params.text === text) {
        continue;
      }
    }

    // both descendants are strings
    if (pastDescendant.kind === "TEXT") {
      hooks.removeDescendant(pastDescendant.params.textNode);
    }

    if (pastDescendant.kind === "CHUNK_ARRAY") {
      const { chunkArray } = pastDescendant.params;
      for (const chunkID in chunkArray) {
        chunkArray[chunkID].unmount();
      }
    }

    // assign new chunks
    const { leftNode, parentNode, siblingIndex } = pastDescendant.params;
    const parentDefault = parentNode ?? chunkParentNode;
    if (!siblingLevelUpdated) {
      siblingLevelUpdated = siblingIndex !== undefined;
    }

    if (Array.isArray(descendant)) {
      rs.descendants[descenantID] = {
        kind: "CHUNK_ARRAY",
        params: {
          chunkArray: descendant,
          leftNode,
          parentNode,
          siblingIndex,
        },
      };

      let currLeftNode = leftNode;
      for (const chunkID in descendant) {
        currLeftNode = descendant[chunkID].mount(parentDefault, currLeftNode);
      }
    }

    if (!Array.isArray(descendant)) {
      const textNode = hooks.createTextNode(text);

      rs.descendants[descenantID] = {
        kind: "TEXT",
        params: {
          parentNode: parentDefault,
          leftNode,
          siblingIndex,
          text,
          textNode,
        },
      };

      // add sibling to render structure to get mounted later
      if (siblingIndex !== undefined) {
        rs.siblings[siblingIndex] = [textNode];
      }

      hooks.insertDescendant({
        parentNode: parentDefault, // append actual parent
        descendant: textNode,
        leftNode,
      });
    }

    // disconnect all unmounted chunks
    if (pastDescendant.kind === "CHUNK_ARRAY") {
      const { chunkArray } = pastDescendant.params;
      for (const chunkID in chunkArray) {
        const chunk = chunkArray[chunkID];
        if (!chunk.effect.mounted) {
          chunk.disconnect();
        }
      }
    }
  }

  // return if sibling level nodes were updated
  return siblingLevelUpdated;
};

const disconnectDescendants: DisconnectDescendants = (hooks, rs) => {
  const attributes = rs.attributes;
  for (const attributeID in attributes) {
    const attribute = attributes[attributeID];
    hooks.removeAttribute(attribute.params);
  }

  for (const descendantID in rs.descendants) {
    const descendant = rs.descendants[descendantID];
    if (descendant.kind === "TEXT") {
      hooks.removeDescendant(descendant.params.textNode);
    }

    if (descendant.kind === "CHUNK_ARRAY") {
      const chunkArray = descendant.params.chunkArray;
      for (const chunkID in chunkArray) {
        const chunk = chunkArray[chunkID];
        chunk.unmount();
        chunk.disconnect();
      }
    }
  }
};

export {
  disconnectDescendants,
  getUpdatedSiblings,
  hasTemplateChanged,
  updateAttributes,
  updateDescendants,
};
