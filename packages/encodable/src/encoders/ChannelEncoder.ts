import { extent as d3Extent } from 'd3-array';
import { HasToString, IdentityFunction } from '../types/Base';
import { ChannelType, ChannelInput } from '../types/Channel';
import { PlainObject, Dataset } from '../types/Data';
import { ChannelDef } from '../types/ChannelDef';
import { Value } from '../types/VegaLite';
import { isTypedFieldDef, isValueDef } from '../typeGuards/ChannelDef';
import { isX, isY, isXOrY } from '../typeGuards/Channel';
import ChannelEncoderAxis from './ChannelEncoderAxis';
import createGetterFromChannelDef, { Getter } from '../parsers/createGetterFromChannelDef';
import completeChannelDef from '../fillers/completeChannelDef';
import createFormatterFromChannelDef from '../parsers/format/createFormatterFromChannelDef';
import createScaleFromScaleConfig from '../parsers/scale/createScaleFromScaleConfig';
import identity from '../utils/identity';
import applyDomain from '../parsers/scale/applyDomain';
import applyZero from '../parsers/scale/applyZero';
import applyNice from '../parsers/scale/applyNice';
import { AllScale } from '../types/Scale';
import { isCompleteValueDef, isCompleteFieldDef } from '../typeGuards/CompleteChannelDef';
import { CompleteChannelDef } from '../types/CompleteChannelDef';

type EncodeFunction<Output> = (value: ChannelInput) => Output | null | undefined;

export default class ChannelEncoder<Def extends ChannelDef<Output>, Output extends Value = Value> {
  readonly name: string | Symbol | number;

  readonly channelType: ChannelType;

  readonly originalDefinition: Def;

  readonly definition: CompleteChannelDef<Output>;

  readonly scale?: AllScale<Output>;

  readonly axis?: ChannelEncoderAxis<Def, Output>;

  private readonly getValue: Getter<Output>;

  private readonly encodeFunc: IdentityFunction<Output> | EncodeFunction<Output> | (() => Output);

  readonly formatValue: (value: ChannelInput | HasToString) => string;

  constructor({
    name,
    channelType,
    definition: originalDefinition,
  }: {
    name: string;
    channelType: ChannelType;
    definition: Def;
  }) {
    this.name = name;
    this.channelType = channelType;

    this.originalDefinition = originalDefinition;
    this.definition = completeChannelDef(this.channelType, originalDefinition);

    this.getValue = createGetterFromChannelDef(this.definition);
    this.formatValue = createFormatterFromChannelDef(this.definition);

    if (this.definition.scale) {
      const scale = createScaleFromScaleConfig(this.definition.scale);
      this.encodeFunc = (value: ChannelInput) => scale(value) as Output;
      this.scale = scale;
    } else {
      const { definition } = this;
      this.encodeFunc = isCompleteValueDef(definition) ? () => definition.value : identity;
    }

    if (this.definition.axis) {
      this.axis = new ChannelEncoderAxis(this);
    }
  }

  encodeValue: {
    (value: ChannelInput | Output): Output | null | undefined;
    (value: ChannelInput | Output, otherwise: Output): Output;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = (value: ChannelInput | Output, otherwise?: Output): any => {
    if (typeof otherwise !== 'undefined' && (value === null || typeof value === 'undefined')) {
      return otherwise;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.encodeFunc(value as any);
  };

  encodeDatum: {
    (datum: PlainObject): Output | null | undefined;
    (datum: PlainObject, otherwise: Output): Output;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = (datum: PlainObject, otherwise?: Output): any =>
    typeof otherwise === 'undefined'
      ? this.encodeValue(this.getValueFromDatum(datum))
      : this.encodeValue(this.getValueFromDatum(datum), otherwise);

  formatDatum = (datum: PlainObject): string => this.formatValue(this.getValueFromDatum(datum));

  getValueFromDatum = <T extends ChannelInput | Output>(datum: PlainObject, otherwise?: T) => {
    const value = this.getValue(datum);

    return otherwise !== undefined && (value === null || value === undefined)
      ? otherwise
      : (value as T);
  };

  getDomainFromDataset = (data: Dataset) => {
    if (isValueDef(this.definition)) {
      const { value } = this.definition;

      return [value];
    }

    const { type } = this.definition;
    if (type === 'nominal' || type === 'ordinal') {
      return Array.from(new Set(data.map(d => this.getValueFromDatum(d)))) as ChannelInput[];
    }
    if (type === 'quantitative') {
      const extent = d3Extent(data, d => this.getValueFromDatum<number>(d));

      return typeof extent[0] === 'undefined' ? [0, 1] : (extent as [number, number]);
    }
    if (type === 'temporal') {
      const extent = d3Extent(data, d => this.getValueFromDatum<number | Date>(d));

      return typeof extent[0] === 'undefined'
        ? [0, 1]
        : (extent as [number, number] | [Date, Date]);
    }

    return [];
  };

  getDomain() {
    if (this.scale && 'domain' in this.scale) {
      return this.scale.domain();
    }

    return [];
  }

  setDomain(domain: ChannelInput[]) {
    if (this.definition.scale !== false && this.scale && 'domain' in this.scale) {
      const config = this.definition.scale;
      applyDomain(config, this.scale, domain);
      applyZero(config, this.scale);
      applyNice(config, this.scale);
    }

    return this;
  }

  setDomainFromDataset(data: Dataset) {
    return this.scale && 'domain' in this.scale
      ? this.setDomain(this.getDomainFromDataset(data))
      : this;
  }

  getTitle() {
    return this.definition.title;
  }

  isGroupBy() {
    if (isTypedFieldDef(this.definition)) {
      const { type } = this.definition;

      return (
        this.channelType === 'Category' ||
        this.channelType === 'Text' ||
        (this.channelType === 'Color' && (type === 'nominal' || type === 'ordinal')) ||
        (isXOrY(this.channelType) && (type === 'nominal' || type === 'ordinal'))
      );
    }

    return false;
  }

  isX() {
    return isX(this.channelType);
  }

  isXOrY() {
    return isXOrY(this.channelType);
  }

  isY() {
    return isY(this.channelType);
  }

  hasLegend() {
    return this.definition.legend !== false;
  }

  hasValueDefinition() {
    return isCompleteValueDef(this.definition);
  }

  hasFieldDefinition() {
    return isCompleteFieldDef(this.definition);
  }
}
