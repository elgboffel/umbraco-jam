import { initializeApp } from "firebase-admin";
import * as functions from "firebase-functions";
import next from "next";

initializeApp();

const isDev = process.env.NODE_ENV === "development";

const app = next({
  dev: isDev,
  conf: { distDir: "dist/mcCode/client" },
});

const handle = app.getRequestHandler();

export const server = functions.https.onRequest((request, response) => {
  return app.prepare().then(() => handle(request, response));
});
