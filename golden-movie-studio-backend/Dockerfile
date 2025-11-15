FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

# Configuração do host para aceitar conexões externas
ENV HOST=0.0.0.0
ENV PORT=3000

CMD ["npm", "start"]
