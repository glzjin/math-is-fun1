const puppeteer = require("puppeteer");

module.exports = async function () {
    try{
        browser = await (puppeteer.launch({
            //setting time out
            timeout: 10000,

            ignoreHTTPSErrors: false,
            // if this is true open devtools, headless always true
            devtools: false,
            // headless don't have GUI
            headless: true,
            
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        }));
        checking = false;
    }
    catch(e) {
        console.log(e);
        return false;
    }
    return true;
}