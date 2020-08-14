import { FormatMixins, Formatter } from '../../types';
import fallbackFormatter from './fallbackFormatter';
import EncodableOptions from '../../options/EncodableOptions';

export default function createFormatter({
  formatType,
  format,
  formatInLocalTime,
}: FormatMixins): Formatter {
  if (formatType === 'time') {
    const formatter = EncodableOptions.getTimeFormatResolver()({
      format,
      formatInLocalTime,
    });

    return (value: unknown) => formatter(value as Date | number | null | undefined);
  }
  if (formatType === 'number' || (typeof format !== 'undefined' && format.length > 0)) {
    const formatter = EncodableOptions.getNumberFormatResolver()(format);

    return (value: unknown) => formatter(value as number | null | undefined);
  }

  return fallbackFormatter;
}
