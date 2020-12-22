// Proxy fetch so we can add things like base url.
const rawReq = new Proxy(fetch, {
  apply: (target, _, args) => {
    const opt = args[1] ? args[1] : {};
    let host = process.env.REACT_APP_API_BASE_URL;
    if (!host) {
      host = `${window.location.origin}/api/v1`;
    }
    const url = `${host}/${args[0]}`;
    // Call fetch, always assume json.
    return target(url, opt);
  },
});

export default rawReq;
