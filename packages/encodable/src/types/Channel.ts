import { XFieldDef, YFieldDef, MarkPropChannelDef, TextChannelDef } from './ChannelDef';
import { DefaultOutput } from './Core';

/** Possible input for a channel */
export type ChannelInput = number | string | boolean | null | Date | undefined;

/**
 * Define all channel types and mapping to channel definition grammar
 */
export interface ChannelTypeToDefMap<Output extends DefaultOutput = DefaultOutput> {
  /** position on x-axis */
  X: XFieldDef<Output>;
  /** position on y-axis */
  Y: YFieldDef<Output>;
  /** position on x-axis but as a range, e.g., bar chart or heat map */
  XBand: XFieldDef<Output>;
  /** position on y-axis but as a range, e.g., bar chart or heat map */
  YBand: YFieldDef<Output>;
  /** numeric attributes of the mark, e.g., size, opacity */
  Numeric: MarkPropChannelDef<Output>;
  /** categorical attributes of the mark, e.g., color, visibility, shape */
  Category: MarkPropChannelDef<Output>;
  /** color of the mark */
  Color: MarkPropChannelDef<Output>;
  /** plain text, e.g., tooltip, key */
  Text: TextChannelDef<Output>;
}

export type ChannelType = keyof ChannelTypeToDefMap;
