FROM cypress/included:latest

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

CMD ["npx", "cypress", "run"]
