import { initializeApp } from "firebase-admin";
import * as functions from "firebase-functions";
import next from "next";
initializeApp();
var app = next({
  dev: false,
  conf: { distDir: "dist/client" },
});
var handle = app.getRequestHandler();
export var server = functions.https.onRequest(function (request, response) {
  return app.prepare().then(function () {
    return handle(request, response);
  });
});
