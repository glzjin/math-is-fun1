let start_bot = require("../tool/browser");
let browser_close = require("./browser_close");

module.exports = async function() {
    if(checking) {
        console.log("other process is checking exit wite code 0");
        return 0;
    }
    else {
        console.log("checking start please wait...");
        checking = true;
    }
    let page = undefined;
    let error_times = 0;
    let times = 0;
    while(times <= 3) {
        try {
            page = await global.browser.newPage();
        }
        catch(e) {
            error_times += 1;
            if(page) {
                try {
                    await page.close();
                }
                catch(e){console.log(e);}
                page = undefined;
            }
            console.log(e);
        }
        times += 1;
    }
    if(error_times >= 2) {
        console.log("error find browser restaring");
        await browser_close();
        browser = undefined;
        await start_bot();
    }
    else {
        console.log("error not find");
    }
    console.log("checking end");
    checking = false;
}