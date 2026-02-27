// Import images.
function importAll(r: Rspack.Context) {
    let images = {};
    r.keys().map(item => { images[item.replace('./', '')] = r(item); });
    return images;
}
export const images = importAll(require.context('../images', false, '/\.png/'));
