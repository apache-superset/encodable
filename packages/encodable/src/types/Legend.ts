import { FieldType } from './Core';
import { ChannelInput } from './Channel';
import { EncodingConfig, DeriveSingleChannelEncoder } from './Encoding';

export type Legend = {};

export interface WithLegend {
  legend?: boolean | Legend;
}

export type LegendItemInformation<Config extends EncodingConfig> = {
  input: ChannelInput;
  output: Partial<{ [k in keyof Config]: Config[k]['1'] }>;
};

interface BaseLegendGroupInformation<Config extends EncodingConfig> {
  field: string;
  channelEncoders: DeriveSingleChannelEncoder<Config, keyof Config>[];
  createLegendItems: (domain: ChannelInput[]) => LegendItemInformation<Config>[];
}

export interface NominalLegendGroupInformation<Config extends EncodingConfig>
  extends BaseLegendGroupInformation<Config> {
  type: 'nominal';
  items: LegendItemInformation<Config>[];
}

export interface NonNominalLegendGroupInformation<Config extends EncodingConfig>
  extends BaseLegendGroupInformation<Config> {
  type: Exclude<FieldType, 'nominal'>;
}

export type LegendGroupInformation<Config extends EncodingConfig> =
  | NominalLegendGroupInformation<Config>
  | NonNominalLegendGroupInformation<Config>;
