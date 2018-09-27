FROM node:9.9.0
#修改源，安装依赖项
RUN npm config set registry https://registry.npm.taobao.org
RUN apt update
RUN apt install -y mysql-client

#初始化数据库
COPY db_initialize.sql /database/db_initialize.sql
WORKDIR /database
RUN mysql -uroot -pawesome-coding -hDatabase.fantastic67.secoder.local <db_initialize.sql

#创建前端目录，并安装依赖项
COPY frontend /frontend
WORKDIR /frontend
RUN npm install
RUN npm run build

#创建后端目录，并安装依赖项
COPY myapp /app
WORKDIR /app
RUN npm install

ENV TEST_ROOT /app
ENV PORT 80
EXPOSE 80
#运行
CMD npm start

