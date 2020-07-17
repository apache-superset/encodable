import {
  scaleLinear,
  scaleLog,
  scalePow,
  scaleSqrt,
  scaleTime,
  scaleUtc,
  scaleQuantile,
  scaleQuantize,
  scaleThreshold,
  scaleOrdinal,
  scalePoint,
  scaleBand,
} from 'd3-scale';
import { CategoricalScaleInput } from '../../types/Scale';
import { ScaleConfig } from '../../types/ScaleConfig';
import { ScaleType, Value } from '../../types/VegaLite';

export default function createScaleFromScaleType<Output extends Value>(
  config: ScaleConfig<Output>,
) {
  switch (config.type) {
    case ScaleType.LINEAR:
      return scaleLinear<Output>();
    case ScaleType.LOG:
      return scaleLog<Output>();
    case ScaleType.POW:
      return scalePow<Output>();
    case ScaleType.SQRT:
      return scaleSqrt<Output>();
    case ScaleType.TIME:
      return scaleTime<Output>();
    case ScaleType.UTC:
      return scaleUtc<Output>();
    case ScaleType.QUANTILE:
      return scaleQuantile<Output>();
    case ScaleType.QUANTIZE:
      return scaleQuantize<Output>();
    case ScaleType.THRESHOLD:
      return scaleThreshold<number | string | Date, Output>();
    case ScaleType.ORDINAL:
      return scaleOrdinal<CategoricalScaleInput, Output>();
    case ScaleType.POINT:
      return scalePoint<CategoricalScaleInput>();
    case ScaleType.BAND:
      return scaleBand<CategoricalScaleInput>();
    case ScaleType.SYMLOG:
      // TODO: d3-scale typings does not include scaleSymlog yet
      // needs to patch the declaration file before continue.
      throw new Error(`"scale.type = ${config.type}" is not supported yet.`);
    case ScaleType.BIN_ORDINAL:
      // TODO: Pending scale.bins implementation
      throw new Error(`"scale.type = ${config.type}" is not supported yet.`);
    default:
      return scaleLinear<Output>();
  }
}
