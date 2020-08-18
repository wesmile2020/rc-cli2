export function parseUrl(url: string) {
    const result: MapLike = {};
    const paramsStr = url.split('?')[1];
    if (!paramsStr) return result;
    const arr = paramsStr.split('&');
    for (let i = 0; i < arr.length; i += 1) {
        const [key, value] = arr[i].split('=');
        result[key] = value;
    }

    return result;
}
