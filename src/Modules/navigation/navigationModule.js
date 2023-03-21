import config from "../../Config";

const navigationModule = {
  redirectTo: (path) => {
    window.location = path;
  },

  gotoLogin: () => {
    window.location =
      config.relativePath + "/login?nextScreen=" + window.location.pathname;
  },

  matchCurrentPath: (path) => {
    if (!path) return false;

    let r1 = new RegExp(`^${Config.relativePath}${path}/+.*`);

    return !!(window.location.pathname + "/").match(r1);
  },

  getQueries: () => {
    let searchParams = new URLSearchParams(window.location.search);
    const params = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  },

  getQuery: (key) => {
    let searchParams = new URLSearchParams(window.location.search);
    return searchParams.get(key);
  },

  addQuery: (params = {}, navigate) => {
    let pathname = window.location.pathname;
    let searchParams = new URLSearchParams(window.location.search);

    for (const key in params) {
      if (Object.hasOwnProperty.call(params, key)) {
        const value = params[key];
        searchParams.set(key, value);
      }
    }

    let url = `${pathname}?${searchParams.toString()}`;
    navigate(url);
  },

  navigate(pathname, navigate, params = {}) {
    let searchParams = new URLSearchParams();
    for (const key in params) {
      if (Object.hasOwnProperty.call(params, key)) {
        const value = params[key];
        searchParams.set(key, value);
      }
    }
    let url = `${pathname}?${searchParams.toString()}`;
    navigate(url);
  },

  removeQuery: (keys, navigate) => {
    let searchParams = new URLSearchParams(window.location.search);
    let pathname = window.location.pathname;

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      searchParams.delete(key);
    }

    let url = `${pathname}?${searchParams.toString()}`;
    navigate(url);
  },
};

export default navigationModule;
