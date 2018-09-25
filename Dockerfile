FROM node:9.9.0
RUN npm config set registry https://registry.npm.taobao.org
COPY myapp/package.json /app/package.json
COPY package-lock.json /app/package-lock.json
WORKDIR /app
RUN npm install
COPY myapp /app
ENV TEST_ROOT /app
ENV PORT 80
EXPOSE 80
CMD npm start

