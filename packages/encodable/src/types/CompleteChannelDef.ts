import { Value, ValueDef, Type } from './VegaLite';
import { CompleteAxisConfig } from '../fillers/completeAxisConfig';
import { CompleteLegendConfig } from '../fillers/completeLegendConfig';
import { CompleteScaleConfig } from '../fillers/completeScaleConfig';
import { NonValueDef } from './ChannelDef';

export interface CompleteValueDef<Output extends Value = Value> extends ValueDef<Output> {
  axis: false;
  legend: false;
  scale: false;
  title: '';
}

export interface HalfCompleteFieldDef<Output extends Value = Value>
  extends Omit<NonValueDef<Output>, 'title' | 'scale'> {
  type: Type;
  scale: CompleteScaleConfig<Output>;
  title: string;
}

export type HalfCompleteChannelDef<Output extends Value = Value> =
  | CompleteValueDef<Output>
  | HalfCompleteFieldDef<Output>;

export type CompleteFieldDef<Output extends Value = Value> = Omit<
  NonValueDef<Output>,
  'title' | 'axis' | 'scale'
> & {
  type: Type;
  axis: CompleteAxisConfig;
  legend: CompleteLegendConfig;
  scale: CompleteScaleConfig<Output>;
  title: string;
};

export type CompleteChannelDef<Output extends Value = Value> =
  | CompleteValueDef<Output>
  | CompleteFieldDef<Output>;
