FROM node:9.9.0
RUN npm config set registry https://registry.npm.taobao.org
COPY frontend /frontend
COPY myapp /app
WORKDIR /frontend
RUN npm install
RUN npm run build
WORKDIR /app
RUN npm install
ENV TEST_ROOT /app
ENV PORT 80
EXPOSE 80
CMD npm start

