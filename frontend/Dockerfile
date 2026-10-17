FROM node:20-alpine AS build
WORKDIR /app

# Change the copy line to only expect package.json
COPY package.json ./

# Change 'npm ci' to 'npm install'
RUN npm install

COPY . .
RUN npm run build

# Runtime stage
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80