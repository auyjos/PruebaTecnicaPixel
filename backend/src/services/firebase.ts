import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

const initializeFirebase = async () => {
    if (!admin.apps.length) {
        try {
            // Option 1: Using service account key file
            if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
                const serviceAccount = await import(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount.default),
                    projectId: process.env.FIREBASE_PROJECT_ID,
                });
            }
            // Option 2: Using environment variables
            else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
                admin.initializeApp({
                    credential: admin.credential.cert({
                        projectId: process.env.FIREBASE_PROJECT_ID,
                        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
                    }),
                    projectId: process.env.FIREBASE_PROJECT_ID,
                });
            } else {
                throw new Error('Firebase configuration is missing. Please provide either FIREBASE_SERVICE_ACCOUNT_PATH or all required environment variables.');
            }

            console.log('Firebase Admin SDK initialized successfully');
        } catch (error) {
            console.error('Error initializing Firebase Admin SDK:', error);
            process.exit(1);
        }
    }
};

export { admin, initializeFirebase };
