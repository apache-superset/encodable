import { format as d3Format, formatLocale, FormatLocaleDefinition } from 'd3-format';
import { NumberFormatFunction, NumberFormatterMetadata } from '../../types';
import createNumberFormatter from '../createNumberFormatter';

interface Config extends NumberFormatterMetadata {
  formatString: string;
  locale?: FormatLocaleDefinition;
}

export default function createD3NumberFormatter({
  formatString,
  locale,
  id,
  label,
  description,
}: Config) {
  let formatFunc: NumberFormatFunction;
  let isInvalid = false;

  try {
    formatFunc =
      typeof locale === 'undefined'
        ? d3Format(formatString)
        : formatLocale(locale).format(formatString);
  } catch (error) {
    formatFunc = value => `${value} (Invalid format: ${formatString})`;
    isInvalid = true;
  }

  return createNumberFormatter(formatFunc, {
    id: id ?? formatString,
    label,
    description,
    isInvalid,
  });
}
