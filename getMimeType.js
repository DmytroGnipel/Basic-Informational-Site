export default function getMimeType(path) {
  let mimes = {
    html: "text/html",
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    png: "image/png",
    svg: "image/svg+xml",
    json: "application/json",
    js: "text/javascript",
    css: "text/css",
    ico: "image/x-icon",
  };
  if (Array.isArray(path.match(/\.[a-z]+$/))) {
    let [ext] = path.match(/\.[a-z]+$/);
    const newExt = ext.split("");
    newExt.shift();
    const result = newExt.join("");
    return mimes[result];
  }
  return "text/plain";
}
