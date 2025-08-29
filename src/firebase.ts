import admin from "firebase-admin";
import serviceAccount from "../serviceAccountKey.json" with { type: "json" };

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(
            serviceAccount as admin.ServiceAccount
        ),
    });
}

const db = admin.firestore();
const auth = admin.auth();

export { db, auth };