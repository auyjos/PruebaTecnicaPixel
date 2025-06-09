import admin from 'firebase-admin';
import dotenv from 'dotenv';
import { createRequire } from 'module';
import path from 'path'; // Import the path module
import { fileURLToPath } from 'url'; // To get __dirname in ES modules

dotenv.config();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const initializeFirebase = async () => {
    if (!admin.apps.length) {
        try {
            // Option 1: Using service account key file
            if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
                const require = createRequire(import.meta.url);
                // Resolve the path from the backend project root
                // __dirname is .../backend/src/services
                // process.env.FIREBASE_SERVICE_ACCOUNT_PATH is relative to backend root e.g. "./project.json"
                const serviceAccountPath = path.resolve(__dirname, '..', '..', process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
                // console.log(`Attempting to load service account from: ${serviceAccountPath}`); // For debugging
                const serviceAccount = require(serviceAccountPath);
                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount),
                    projectId: process.env.FIREBASE_PROJECT_ID, // Optional if already in service account file
                });
            }
            // Option 2: Using environment variables (now a fallback or alternative)
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
