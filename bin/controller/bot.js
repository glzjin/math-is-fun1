const sleep = require("../tool/Sleep");
const make_flag = require("../tool/make_flag");
const check_bot_error = require("../tool/check_bot_error");

module.exports = async function(req) {
    console.log(req.query);
    
    let error = "Bot error, please wait and send again"
    let ret = error;
    let page;
    let link = req.query.link;
    let challenge_url = "http://47.110.128.101/";
    try {
        if(!global.browser) {
            let times = 0;
            console.log("sleep start");
            while(!global.browser && times < 30) {
                console.log("sleep times:",times);
                await sleep(100);
                times += 1;
            }
            console.log("sleep end");
            if( !(times < 30) ) {
                process.exit();
            }
        }
        else {
            console.log("browser already exists");
        }

        page =  
        await global.browser.newPage()
        .catch(e => {
            throw e;
        })

        let res = new Promise((resolve, reject) => {
            page.on('dialog', res => {
                res.accept("");
                resolve(true);
            })
            setTimeout(() => {
                reject();
            }, 2000);
        })
        .catch(err => {
            if(err) {
                console.log("Page closed with an error:", err);
                page.close();
                page = undefined;
            }
            return err;
        })
        link = link || "";
        await page.setCookie({
            name: "flag",
            value: make_flag(),
            url: challenge_url,
        });
        await page.goto(`${challenge_url}challenge?${link}`);
        ret = "The message was successfully sent to the administrator";
        if ((await res) === true ) {
            ret = "what's that?!";
        }
    }
    catch(e) {
        console.log("bot error",e);
        check_bot_error()
        .catch(e => console.log(e)); 
        ret = error;
    }
    finally {
        if(page) {
            try {
                page.close();
            }
            catch(e) {
                console.log(e);
            }
        }
    }
    return ret || error;
}
