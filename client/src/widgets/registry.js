import { textWidget } from './text';
import { imageWidget } from './image';
import { chartWidget } from './chart';

const plugins = [textWidget, imageWidget, chartWidget];

const byKind = new Map(plugins.map((p) => [p.kind, p]));

export const widgetRegistry = {
  get(kind) {
    const p = byKind.get(kind);
    if (!p) throw new Error(`Unknown widget kind: ${kind}`);
    return p;
  },
  all() {
    return plugins;
  },
  byCategory() {
    return { basic: [...plugins], media: [], interactive: [], layout: [] };
  },
};
