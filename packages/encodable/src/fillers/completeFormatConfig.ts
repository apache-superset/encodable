import { FormatMixins, FieldType, ScaleType, FormatType } from '../types';

export interface CompleteFormatConfig {
  formatType: 'time' | 'number' | undefined;
  formatInLocalTime?: boolean;
  format: string | undefined;
}

export default function completeFormatConfig(
  config: FormatMixins & {
    /** Field type */
    type?: FieldType;
    scaleType?: ScaleType;
  },
): CompleteFormatConfig {
  const { formatType, formatInLocalTime, format, type, scaleType } = config;

  let resolvedFormatType: FormatType | undefined;
  if (typeof formatType !== 'undefined') {
    resolvedFormatType = formatType;
  } else if (type === 'quantitative') {
    resolvedFormatType = 'number';
  } else if (type === 'temporal' || scaleType === 'time' || scaleType === 'utc') {
    resolvedFormatType = 'time';
  } else if (typeof format !== 'undefined' && format.length > 0) {
    resolvedFormatType = 'number';
  }

  if (resolvedFormatType === 'time') {
    return {
      formatType: 'time',
      formatInLocalTime:
        formatInLocalTime || (typeof formatInLocalTime === 'undefined' && scaleType === 'time'),
      format,
    };
  }

  return {
    formatType: resolvedFormatType,
    format,
  };
}
