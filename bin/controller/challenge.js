let crypto = require("crypto");

module.exports = function(req, res) {
    let token = crypto.randomBytes(8).toString('base64');
    res.set({"Content-Security-Policy":`font-src cdnjs.cloudflare.com 'self';\
    script-src 'self' 'nonce-${token}' 'strict-dynamic' 'unsafe-eval';\
    style-src 'self' 'unsafe-inline';\
    child-src 'none';\
    object-src 'none'; base-uri 'self' 'nonce-${token}';\
    connect-src 'self';\
    sandbox allow-scripts allow-modals allow-same-origin;\
    default-src 'self';`,
    'X-XSS-Protection': 0,
    'X-Frame-Options': 'deny',
    'X-DNS-Prefetch-Control': 'off',
    'X-Content-Type-Options': 'nosniff',
    'Access-Control-Allow-Origin': 'null',
    });
    return res.send(challenge_page({"hash": token, "name": req.query.name}));
}

function challenge_page(input) {
    return `
    <!doctype html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="x-dns-prefetch-control" content="off">
        <title>math-is-fun1</title>
        <link nonce="${input.hash}" href="/css/bootstrap.min.css" rel="stylesheet">
        <link nonce="${input.hash}" href="/css/dingus.css" rel="stylesheet">
        <script nonce="${input.hash}" src="/js/jquery.min.js"></script>
        <script nonce="${input.hash}" src="/js/commonmark.js"></script>
        <script nonce="${input.hash}" src="/js/Safe.js"></script>
        <script nonce="${input.hash}" src="/js/purify.min.js"></script>
        <script nonce="${input.hash}" src="/config?callback=DOMPurify.setConfig"></script>
        <script type="config">
            config['name']=${input.name || 'nameless'}
        </script>
        <script nonce="${input.hash}">
            let htmlwriter = new commonmark.HtmlRenderer({ sourcepos: false });
            let reader = new commonmark.Parser();
            let html;
            let con = $("[type='config']")[0].innerHTML.replace(/[ ]/g, "").split("\\n");
            for(let i of con) {
                let tmp
                i = i.match(/^(.*?)(?:\\[\\'(.*?)\\'\\])?=(.*)/);
                try {
                    console.log(i);
                    window[i[1]] = window[i[1]] || {}
                    try {
                        tmp = JSON.parse(i[3]);
                        i[2] ? window[i[1]][i[2]] = tmp : window[i[1]] = tmp;
                    }
                    catch(e) {
                        console.log(e);
                        i[2] ? window[i[1]][i[2]] = i[3] : window[i[1]] = i[3]
                    }
                }
                catch(e){
                    console.log(e);
                }
            }

            function MK_parser(input) {
                let clean = DOMPurify.sanitize(input);
                let tmp_dom = reader.parse(clean);
                html =  htmlwriter.render(tmp_dom);
                return html;
            }

            function viewed() {
                let Parsered = MK_parser($("textarea").val());
                $("#preview").html(Parsered);
                MathJax.Hub.Queue(["Typeset",MathJax.Hub,$("#preview")[0]]);
            }
        </script>
    </head>
    <body>
        <div class="container">
            <div class="row" id="main">
                <div class="col-md-6">
                    <textarea id="text" placeholder="add multiple lines">

2019.5.18

>This is a markdown test page,there have been some security issues here but don't worry,DOMpurify and CSP are protecting me so I no longer need to modify my code.
By the way,I set a cookie that is not httponly in admin Account,you can submit a link to admin,and he will view it,but only for the current domain name.
[click here to send message](/send_message.html)

2019.6.22

We have added a new feature, you can use a few short characters to describe a complex mathematical formula!

$$\\sqrt{x^2+y^2+z^2}$$
                    </textarea>
                </div>
                <div class="col-md-6" style="border: 1px; border-style: ridge;">
                    <div id="preview"></div>
                </div>
            </div>
        </div>

        <script nonce="${input.hash}">
        try {
            $("textarea")[0].value = 'hello '+ config['name'] + ":\\n" + $("textarea").val();
        }
        catch(e) {
            console.log(e);
        }
        
        try {
            $("textarea").keyup(viewed);
            onload = viewed;
        }
        catch(e) {
            console.log(e);
        }
        
        let search = {}
        try {
            let tmp_search = location.search.substr(1,).split("&");
            tmp_search.forEach((node) => {
                let [key, value] = node.split("=");
                search[key] = decodeURIComponent(value);
            })
            search.text ? $("textarea")[0].value = search.text : undefined;
        }
        catch(e) {
            console.log(e);
        }
        </script>
    </body>
    <footer>
        <script nonce="${input.hash}" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-MML-AM_CHTML"></script>
    </footer>
    </html>
    `;
}