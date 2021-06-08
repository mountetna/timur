import * as d3 from 'd3';

export const createScale = (domain, range) => {
  if (domain[0] instanceof Date) {
    return d3.time.scale()
      .range(range)
      .domain(domain);
  }
 else if (typeof domain[0] === 'string') {
    return d3.scale.ordinal()
      .domain(domain)
      .rangeBands(range, 0.05);
  }
 else {
    return d3.scale.linear()
      .range(range)
      .domain(domain);
  }
};

const tickDecimalPlaces = (ticks) => {
  const interval = Math.abs(ticks[1] - ticks[0]);
  const places = Math.ceil(-Math.log10(interval));
  return places < 0 ? 0 : places;
};

export const tickFormatter = (ticks, scale) => {
  if (typeof ticks[0] == 'number') {
    const places = tickDecimalPlaces(ticks);
    return (tick) => tick.toFixed(places);
  }

  if (ticks[0] instanceof Date) {
    return (tick) => scale.tickFormat()(tick);
  }

  return (tick) => tick;
};
