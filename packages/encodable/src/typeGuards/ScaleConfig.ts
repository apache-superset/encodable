import {
  ScaleConfig,
  LinearScaleConfig,
  PowScaleConfig,
  SqrtScaleConfig,
  SymlogScaleConfig,
  ContinuousScaleConfig,
  DiscretizingScaleConfig,
  DiscreteScaleConfig,
  QuantizeScaleConfig,
} from '../types/scale/ScaleConfig';
import isPropertySupportedByScaleType from '../parsers/scale/isPropertySupportedByScaleType';
import {
  continuousScaleTypesSet,
  discretizingScaleTypesSet,
  discreteScaleTypesSet,
} from '../parsers/scale/scaleCategories';
import { DefaultOutput } from '../types/Core';

export function isContinuousScaleConfig<Output extends DefaultOutput = DefaultOutput>(
  config: ScaleConfig,
): config is ContinuousScaleConfig<Output> {
  return continuousScaleTypesSet.has(config.type);
}

export function isDiscretizingScaleConfig<Output extends DefaultOutput = DefaultOutput>(
  config: ScaleConfig,
): config is DiscretizingScaleConfig<Output> {
  return discretizingScaleTypesSet.has(config.type);
}

export function isDiscreteScaleConfig<Output extends DefaultOutput = DefaultOutput>(
  config: ScaleConfig,
): config is DiscreteScaleConfig<Output> {
  return discreteScaleTypesSet.has(config.type);
}

export function isScaleConfigWithZero<Output extends DefaultOutput = DefaultOutput>(
  config: ScaleConfig,
): config is
  | LinearScaleConfig<Output>
  | PowScaleConfig<Output>
  | SqrtScaleConfig<Output>
  | SymlogScaleConfig<Output>
  | QuantizeScaleConfig<Output> {
  return isPropertySupportedByScaleType('zero', config.type);
}
