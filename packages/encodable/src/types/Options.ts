import { ColorScheme, ColorSchemeType } from '@encodable/color';
import { ScaleOrdinal } from 'd3-scale';
import { StringLike } from './Core';

export type NumberFormatter = (value: number | null | undefined) => string;
export type NumberFormatResolver = (format?: string) => NumberFormatter;

export type TimeFormatter = (value: Date | number | null | undefined) => string;
export type TimeFormatResolver = (params?: {
  format?: string;
  formatInLocalTime?: boolean;
}) => TimeFormatter;

export type CategoricalColorScaleResolver = (params?: {
  name?: string;
  namespace?: string;
}) => ScaleOrdinal<StringLike, string>;

export type ColorSchemeResolver = (params?: {
  name?: string;
  type?: ColorSchemeType;
}) => ColorScheme | undefined;

/**
 * All fields are optional.
 */
export type OptionsState = Partial<{
  numberFormatResolver: NumberFormatResolver;
  timeFormatResolver: TimeFormatResolver;
  categoricalColorScaleResolver: CategoricalColorScaleResolver;
  colorSchemeResolver: ColorSchemeResolver;
}>;
