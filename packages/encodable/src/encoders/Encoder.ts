import { ChannelDef, TypedFieldDef } from '../types/ChannelDef';
import { MayBeArray } from '../types/Base';
import { isTypedFieldDef, isValueDef } from '../typeGuards/ChannelDef';
import { isNotArray } from '../typeGuards/Base';
import ChannelEncoder from './ChannelEncoder';
import {
  EncodingConfig,
  DeriveEncoding,
  DeriveChannelTypes,
  DeriveChannelEncoders,
  DeriveSingleChannelEncoder,
} from '../types/Encoding';
import { Dataset } from '../types/Data';
import { ChannelInput } from '../types/Channel';
import { LegendGroupInformation } from '../types/Legend';

export default class Encoder<Config extends EncodingConfig> {
  readonly encoding: DeriveEncoding<Config>;

  readonly channelTypes: DeriveChannelTypes<Config>;

  readonly channels: DeriveChannelEncoders<Config>;

  readonly legends: {
    [key: string]: DeriveSingleChannelEncoder<Config>[];
  };

  constructor({
    channelTypes,
    encoding,
  }: {
    channelTypes: DeriveChannelTypes<Config>;
    encoding: DeriveEncoding<Config>;
  }) {
    this.channelTypes = channelTypes;
    this.encoding = encoding;
    const channelNames = this.getChannelNames();

    // Create channel encoders
    const channels: { [k in keyof Config]?: MayBeArray<ChannelEncoder<ChannelDef>> } = {};

    channelNames.forEach(name => {
      const channelEncoding = encoding[name] as MayBeArray<ChannelDef>;
      if (Array.isArray(channelEncoding)) {
        const definitions = channelEncoding;
        channels[name] = definitions.map(
          (definition, i) =>
            new ChannelEncoder({
              channelType: channelTypes[name],
              definition,
              name: `${name}[${i}]`,
            }),
        );
      } else {
        const definition = channelEncoding;
        channels[name] = new ChannelEncoder({
          channelType: channelTypes[name],
          definition,
          name: name as string,
        });
      }
    });

    this.channels = channels as DeriveChannelEncoders<Config>;

    // Group the channels that use the same field together
    // so they can share the same legend.
    this.legends = {};
    channelNames
      .map(name => this.channels[name])
      .forEach(c => {
        if (isNotArray(c) && c.hasLegend() && isTypedFieldDef(c.definition)) {
          const { field } = c.definition;
          const channelEncoder = (c as unknown) as DeriveSingleChannelEncoder<Config>;
          if (this.legends[field]) {
            this.legends[field].push(channelEncoder);
          } else {
            this.legends[field] = [channelEncoder];
          }
        }
      });
  }

  getChannelNames() {
    return Object.keys(this.channelTypes) as (keyof Config)[];
  }

  getChannelEncoders() {
    return this.getChannelNames().flatMap(name => this.channels[name]);
  }

  getGroupBys() {
    const fields = this.getChannelEncoders()
      .filter(c => c.isGroupBy())
      .map(c => (c.definition as TypedFieldDef).field!);

    return Array.from(new Set(fields));
  }

  private createLegendItemsFactory(field: string) {
    const channelEncoders = flatMap(
      this.getChannelEncoders().filter(e => isNotArray(e) && isValueDef(e.definition)),
    ).concat(this.legends[field]);

    return (domain: ChannelInput[]) =>
      domain.map((input: ChannelInput) => ({
        input,
        output: channelEncoders.reduce(
          (prev: Partial<{ [k in keyof Config]: Config[k]['1'] }>, curr) => {
            const map = prev;
            map[curr.name as keyof Config] = curr.encodeValue(input);

            return map;
          },
          {},
        ),
      }));
  }

  getLegendInformation(data: Dataset = []): LegendGroupInformation<Config>[] {
    return (
      Object.keys(this.legends)
        // for each field that was encoded
        .map((field: string) => {
          // get all the channels that use this field
          const channelEncoders = this.legends[field];
          const firstEncoder = channelEncoders[0];
          const definition = firstEncoder.definition as TypedFieldDef;
          const createLegendItems = this.createLegendItemsFactory(field);

          if (definition.type === 'nominal') {
            return {
              channelEncoders,
              createLegendItems,
              field,
              items: createLegendItems(firstEncoder.getDomainFromDataset(data)),
              type: definition.type,
            };
          }

          return {
            channelEncoders,
            createLegendItems,
            field,
            type: definition.type,
          };
        })
    );
  }

  setDomainFromDataset(data: Dataset) {
    this.getChannelEncoders().forEach(channelEncoder => {
      channelEncoder.setDomainFromDataset(data);
    });

    return this;
  }

  hasLegend() {
    return Object.keys(this.legends).length > 0;
  }
}
