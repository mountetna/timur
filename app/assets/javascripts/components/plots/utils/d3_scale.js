export const createScale = (domain, range) => {
  let scale
  if (domain[0] instanceof Date) {
    scale = d3.time.scale()
  } else {
    scale = d3.scale.linear()
  }

  return scale.range(range).domain(domain)
}

const tickDecimalPlaces = (ticks) => {
  const interval = Math.abs(ticks[1] - ticks[0])
  const places = Math.ceil(-Math.log10(interval))
  return places < 0 ? 0 : places
}

export const tickFormatter = (ticks, scale) => {
  if (typeof ticks[0] == "number") {
    const places = tickDecimalPlaces(ticks)
    return (tick) => tick.toFixed(places)
  }

  if (ticks[0] instanceof Date) {
    return (tick) => scale.tickFormat()(tick)
  }

  return (tick) => tick
}
