#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

console.log('🔥 Firebase Setup Helper for Calendar Backend');
console.log('='.repeat(50));

const envPath = join(process.cwd(), '.env');

try {
    const envContent = readFileSync(envPath, 'utf8');

    if (envContent.includes('your-firebase-project-id')) {
        console.log('⚠️  Please update your .env file with actual Firebase credentials:');
        console.log('');
        console.log('1. Go to Firebase Console: https://console.firebase.google.com/');
        console.log('2. Select your project or create a new one');
        console.log('3. Go to Project Settings > Service Accounts');
        console.log('4. Click "Generate new private key"');
        console.log('5. Copy the credentials to your .env file');
        console.log('');
        console.log('Required environment variables:');
        console.log('- FIREBASE_PROJECT_ID');
        console.log('- FIREBASE_CLIENT_EMAIL');
        console.log('- FIREBASE_PRIVATE_KEY');
        console.log('');
        console.log('After updating .env, run: npm run dev');
    } else {
        console.log('✅ Environment variables appear to be configured');
        console.log('🚀 You can now run: npm run dev');
    }
} catch (error) {
    console.log('❌ .env file not found. Please copy .env.example to .env and configure it.');
    console.log('Run: cp .env.example .env');
}

console.log('');
console.log('📚 For detailed setup instructions, see README.md');
