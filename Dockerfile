# Tentukan direktori kerja di dalam container
ARG NODE_VERSION=lts
FROM node:${NODE_VERSION}-alpine

# FROM gcr.io/cloud-builders/gcloud

WORKDIR /app

# Salin package.json dan yarn.lock ke dalam direktori kerja
COPY package.json yarn.lock ./

# Install dependensi menggunakan npm
RUN npm install

# Salin seluruh kode sumber ke dalam direktori kerja
COPY ./ .

ENV HOST 0.0.0.0

EXPOSE 8080

# Eksekusi perintah start aplikasi
CMD ["yarn", "start"]