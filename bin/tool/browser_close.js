module.exports = async function (arg) {
    try {
        await global.browser.close();
    }
    catch(e) {
        console.error("find an error in function browser_close",e);
        return false;
    }
    return true;
}