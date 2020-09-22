import { initializeApp } from "firebase-admin";
import * as functions from "firebase-functions";
import next from "next";

initializeApp();

const app = next({
    dev: false,
    conf: { distDir: "dist/client" },
});

const handle = app.getRequestHandler();

export const server = functions.https.onRequest((request, response) => {
    response.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    
    return app.prepare().then(() => handle(request, response));
});
