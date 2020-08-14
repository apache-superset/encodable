import { SyncRegistry } from '@encodable/registry';
import { getCategoricalScheme, getColorSchemeRegistry } from '../scheme';
import stringifyAndTrim from '../utils/stringifyAndTrim';
import { ColorNamespaceStore } from './types';
import ScaleCategoricalColor from './ScaleCategoricalColor';

export default class ColorNamespace {
  readonly store: ColorNamespaceStore;

  readonly scales: SyncRegistry<ScaleCategoricalColor>;

  constructor(nameOrStore: string | ColorNamespaceStore) {
    this.store =
      typeof nameOrStore === 'string'
        ? {
            name: nameOrStore,
            manualColors: {},
            scales: {},
          }
        : nameOrStore;

    this.scales = new SyncRegistry<ScaleCategoricalColor>();
  }

  get name() {
    return this.store.name;
  }

  /**
   * Check if the specified value is subjected to manual color assignment
   * @param value
   */
  hasManualColor(value: string) {
    return typeof this.store.manualColors[stringifyAndTrim(value)] !== 'undefined';
  }

  /**
   * Enforce specific color for given value
   * This will apply across all color scales
   * in this namespace.
   * @param {*} value value
   * @param {*} manualColor color
   */
  setColor(value: string, manualColor: string) {
    this.store.manualColors[stringifyAndTrim(value)] = manualColor;

    return this;
  }

  /**
   * Removed enforced specific color for given value
   * This will apply across all color scales
   * in this namespace.
   * @param {*} value value
   * @param {*} manualColor color
   */
  unsetColor(value: string) {
    delete this.store.manualColors[stringifyAndTrim(value)];

    return this;
  }

  /**
   * Clear all manually assigned colors
   */
  clearManualColors() {
    this.store.manualColors = {};

    return this;
  }

  hasScale(scheme: string) {
    return typeof this.store.scales[scheme] !== 'undefined';
  }

  getScale(scheme?: string) {
    const schemeName =
      scheme ?? getColorSchemeRegistry().categorical.getDefaultKey() ?? 'undefined';
    if (typeof this.store.scales[schemeName] === 'undefined') {
      // create scale
      const scale = new ScaleCategoricalColor(
        getCategoricalScheme(schemeName)?.colors ?? [],
        this.store.manualColors,
      );
      // add store to lookup
      this.store.scales[schemeName] = scale.store;
      this.scales.registerValue(schemeName, scale);
      return scale;
    }

    if (this.scales.has(schemeName)) {
      return this.scales.get(schemeName)!;
    }

    // create scale
    const scale = new ScaleCategoricalColor(
      this.store.scales[schemeName]!,
      this.store.manualColors,
    );
    this.scales.registerValue(schemeName, scale);
    return scale;
  }
}
