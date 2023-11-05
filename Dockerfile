FROM node:21-alpine3.17

# Create app directory
WORKDIR /app

# copy the source files
COPY . /app

# install dependencies
RUN npm install

# expose port 8080
EXPOSE 8080

# start the app
CMD ["npm", "start"]
