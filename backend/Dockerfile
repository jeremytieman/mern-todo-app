FROM node:10.13-alpine
ENV NODE_ENV production
ARG port_arg=4000
ENV PORT ${port_arg}
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent
COPY . .
EXPOSE ${port_arg}
CMD npm start