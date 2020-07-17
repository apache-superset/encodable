import { InterpolatorFactory } from 'd3-scale';
import { Value } from '../../types/VegaLite';
import { D3Scale } from '../../types/Scale';
import { ScaleConfig } from '../../types/ScaleConfig';
import createColorInterpolator from './createColorInterpolator';

export default function applyInterpolate<Output extends Value>(
  config: ScaleConfig<Output>,
  scale: D3Scale<Output>,
) {
  if (
    'interpolate' in config &&
    typeof config.interpolate !== 'undefined' &&
    'interpolate' in scale
  ) {
    scale.interpolate(
      (createColorInterpolator(config.interpolate) as unknown) as InterpolatorFactory<
        Output,
        Output
      >,
    );
  }
}
