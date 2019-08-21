FROM debian:stretch-slim

COPY ./sources.list /etc/apt/sources.list

RUN apt-get update\
	&& apt-get install -y curl\
	&& apt-get install -y wget\
	&& curl -sL http://deb.nodesource.com/setup_10.x | bash  - \
	&& echo 'deb http://deb.nodesource.com/node_10.x stretch main' > /etc/apt/sources.list.d/nodesource.list\
	&& echo 'deb-src http://deb.nodesource.com/node_10.x stretch main' >> /etc/apt/sources.list.d/nodesource.list\
	&& apt-get install -y nodejs\
	&& npm install -g cnpm --registry=https://registry.npm.taobao.org

COPY ./linux_signing_key.pub /tmp/linux_signing_key.pub

RUN apt-key add /tmp/linux_signing_key.pub\
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-unstable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst ttf-freefont \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

RUN cnpm i puppeteer \
    && groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /node_modules

STOPSIGNAL SIGTERM

COPY ./bin/ /pptruser/challenge/

RUN echo 06021e10733c477c898f1e86f2c42986 > /etc/machine-id && \
		cd /pptruser/challenge/ && \
 		cnpm install puppeteer && \
		cnpm install

COPY start.sh /start.sh
RUN chmod +x /start.sh

CMD ["/start.sh"]
