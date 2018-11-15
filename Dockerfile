FROM node:9.9.0
#修改源，安装依赖项
RUN npm config set registry https://registry.npm.taobao.org

#创建前端目录，并安装依赖项
COPY frontend /frontend
WORKDIR /frontend
RUN npm install
RUN npm run build

#创建后端目录，并安装依赖项
COPY backend /backend
WORKDIR /backend
RUN npm install

ENV BACKEND_ROOT /backend
ENV FRONTEND_ROOT /frontend
ENV PORT 80
EXPOSE 80
#运行
CMD npm start

