FROM node:20.14.0 AS build
WORKDIR /app

COPY package*.json ./

RUN npm install && npm cache clean --force

COPY . .
RUN npm run build -- --configuration production --project=proyecto

FROM nginx:alpine

COPY --from=build /app/dist/proyecto/browser /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
