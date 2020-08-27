import { DefaultOutput, D3Scale, ScaleConfig } from '../../types';
import { isContinuousScale } from '../../typeGuards/Scale';

export default function applyZero<Output extends DefaultOutput>(
  config: ScaleConfig<Output>,
  scale: D3Scale<Output>,
) {
  if ('zero' in config && config.zero === true && isContinuousScale(scale, config.type)) {
    const domain = scale.domain() as number[];
    const [a, b] = domain;
    const isDescending = b < a;
    const [min, max] = isDescending ? [b, a] : [a, b];
    const domainWithZero = [Math.min(0, min), Math.max(0, max)];
    scale.domain(isDescending ? domainWithZero.reverse() : domainWithZero);
  }
}
