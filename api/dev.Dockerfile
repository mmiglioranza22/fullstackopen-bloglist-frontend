FROM node:20

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm ci

USER node
 
CMD echo "containerized dev server starting. Secrets should run from own env file..." && npm run dev:container