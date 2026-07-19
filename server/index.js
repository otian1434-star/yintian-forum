const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

function normalizePath(pathname) {
  if (pathname === "/") return "/index.html";
  return pathname;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    url.pathname = normalizePath(url.pathname);

    if (env?.ASSETS?.fetch) {
      const response = await env.ASSETS.fetch(new Request(url, request));
      if (response.status !== 404) return response;
    }

    const extension = url.pathname.slice(url.pathname.lastIndexOf("."));
    return new Response("Not Found", {
      status: 404,
      headers: { "content-type": MIME_TYPES[extension] || "text/plain; charset=utf-8" },
    });
  },
};
