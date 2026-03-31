// Import files dynamically.
function importAll(r: Rspack.Context) {
    let files = {};
    r.keys().map(item => { files[item.replace('./', '')] = r(item); });
    return files;
}
export const images: {[key:string]: string} = importAll(require.context('../images', false, '/\.png/'));
