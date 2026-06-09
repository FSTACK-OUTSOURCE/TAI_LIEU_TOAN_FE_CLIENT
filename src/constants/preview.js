export const normalizePreviewUrl = (url) => {
    if (!url) return url;
    try {
        const parsedUrl = new URL(url);
        if (
            parsedUrl.hostname.includes("drive.google.com") &&
            parsedUrl.pathname.includes("/file/d/") &&
            /\/view\/?$/.test(parsedUrl.pathname)
        ) {
            parsedUrl.pathname = parsedUrl.pathname.replace(
                /\/view\/?$/,
                "/preview",
            );
            parsedUrl.search = "";
            parsedUrl.hash = "";
            return parsedUrl.toString();
        }
    } catch {
        return url;
    }
    return url;
};
