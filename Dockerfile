# Stage 1: Build an Angular Docker Image
FROM node:14.15.3 as build
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY . /app
ARG configuration=prod
#set angular heap size according to our project requirements by editing max-old-space-size below
RUN node --max-old-space-size=5000 node_modules/@angular/cli/bin/ng build --prod --aot=true --output-hashing=all --build-optimizer=true --optimization=true --source-map=false
# Stage 2, use the compiled app, ready for production with Nginx
FROM nginx
COPY --from=build /app/dist/app1 /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]