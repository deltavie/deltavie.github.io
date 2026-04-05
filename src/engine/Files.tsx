// Import files dynamically.
function importAll(r: Rspack.Context) {
    let files = {};
    // @ts-ignore
    r.keys().map(item => { files[item.replace('./', '')] = r(item); });
    return files;
}
// @ts-ignore
export const images: {[key:string]: string} = importAll(require.context('../images', false, '/\.png/'));
