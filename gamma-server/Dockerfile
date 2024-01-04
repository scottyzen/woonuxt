FROM node:18
ARG WP_AUTH_TEST
# Create app directory
WORKDIR /usr/src/app


# set environment file based on the argument
ENV ENV_FILE=.env.$WP_AUTH_TEST

# copy environment file to container
COPY $ENV_FILE /app/.env
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "node", "app.js" ]