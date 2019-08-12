
const NAMED_PARAM=/:([\w]+)/g;
const GLOB_PARAM=/\*([\w]+)$/g;
const ROUTE_PART=/(:[\w]+|\*[\w]+$)/g;

const UNSAFE=/[^\-_.!~*'()a-zA-Z\d;\/?:@&=+$,]/g;

const route_regexp = (template) => template.
  // any :params match separator-free strings
  replace(NAMED_PARAM, '([^\\.\\/\\?\\#]+)').
  // any *params match arbitrary strings
  replace(GLOB_PARAM, '(.+?)').
  // ignore any trailing slashes in the route
  replace(/\/$/, '');

const routeParts = (template) => {
  let parts = [];
  // this does not replace, merely uses replace() to scan
  if (template) template.replace(
    ROUTE_PART,
    (part) => parts.push(part.replace(/^./,''))
  );
  return parts;
};

const routePath = (template, params) => {
  let index = 0;
  return '/' + template.replace(
    ROUTE_PART,
    part => params[index++]
  );
};

const matchRoute = ({ path, hash }, route) => (
  // match the route part
  path.match(route.path_regexp) && (!hash || (route.hash_regexp && hash.match(route.hash_regexp)))
);

const routeParams = ({path,hash}, route) => {
  let [ _, ...values ] = decodeURIComponent(path).match(route.path_regexp);

  if (hash) {
    let [ _, ...hash_values ] = hash.match(route.hash_regexp);
    values = values.concat(hash_values);
  }

  let params = route.parts.reduce(
    (map, key, index) => {
      map[key] = values[index];
      return map;
    },
    {}
  );
  return params;
}

export const setRoutes = (routes) => {
  window.Routes = window.Routes || {};

  routes.forEach(route => {
    let [ path, hash ] = route.template.split(/#/);
    route.path_regexp = new RegExp(`^/${ route_regexp(path) }/?$`);
    route.hash_regexp = hash ? new RegExp(`^#${route_regexp(hash)}$`) : null;
    route.parts = routeParts(path).concat(routeParts(hash));
    if (route.name) {
      window.Routes[`${route.name}_path`] = (...params) =>
        routePath(route.template, params);
    }
  });
}

export const findRoute = (location, routes) => {
  let route = routes.find(route => matchRoute(location,route));
  let params = route  && routeParams(location, route);
  return { route, params };
}
