import { ValueDef, Value, Type, FormatMixins } from './VegaLite';
import { WithScale } from './Scale';
import { WithXAxis, WithYAxis } from './Axis';
import { WithLegend } from './Legend';

export type PropertyValue =
  | {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any;
    }
  | boolean
  | null
  | undefined;

export type Formatter = (d: unknown) => string;

export interface FieldDef extends FormatMixins {
  field: string;
  title?: string;
  /** not used at the moment */
  bin?: boolean;
}

export interface TypedFieldDef extends FieldDef {
  type: Type;
}

export type TextFieldDef = FieldDef;

export type ScaleFieldDef<Output extends Value = Value> = TypedFieldDef & WithScale<Output>;

export type MarkPropFieldDef<Output extends Value = Value> = ScaleFieldDef<Output> & WithLegend;

// PositionFieldDef is { field: 'fieldName', scale: xxx, axis: xxx }

type PositionFieldDefBase<Output extends Value = Value> = ScaleFieldDef<Output>;

export type XFieldDef<Output extends Value = Value> = PositionFieldDefBase<Output> & WithXAxis;

export type YFieldDef<Output extends Value = Value> = PositionFieldDefBase<Output> & WithYAxis;

export type PositionFieldDef<Output extends Value = Value> = XFieldDef<Output> | YFieldDef<Output>;

export type MarkPropChannelDef<Output extends Value = Value> =
  | MarkPropFieldDef<Output>
  | ValueDef<Output>;

export type TextChannelDef<Output extends Value = Value> = TextFieldDef | ValueDef<Output>;

export type ChannelDef<Output extends Value = Value> =
  | ValueDef<Output>
  | XFieldDef<Output>
  | YFieldDef<Output>
  | MarkPropFieldDef<Output>
  | TextFieldDef;

/** Channel definitions that are not constant value */
export type NonValueDef<Output extends Value = Value> = Exclude<
  ChannelDef<Output>,
  ValueDef<Output>
>;

/** Pattern for extracting output type from channel definition */
export type ExtractChannelOutput<Def> = Def extends ChannelDef<infer Output> ? Output : never;
