import { getTimeFormatter, LOCAL_PREFIX } from '@superset-ui/time-format';
import { TimeFormatResolver } from '../../types';

const defaultTimeFormatResolver: TimeFormatResolver = ({ format, formatInLocalTime = false }) => {
  const formatString = formatInLocalTime
    ? LOCAL_PREFIX + format?.replace(LOCAL_PREFIX, '')
    : format;
  return getTimeFormatter(formatString);
};

export default defaultTimeFormatResolver;
