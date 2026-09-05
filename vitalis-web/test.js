const email = 'admin@gmail.com';
const password = 'Admin1234';
const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = 'Admin1234';

const cleanEmail = email.trim().toLowerCase();
const cleanPassword = password.trim();

const matchesEnv = cleanEmail === ADMIN_EMAIL.toLowerCase() && cleanPassword === ADMIN_PASSWORD;
const matchesHardcoded = cleanEmail === "admin@gmail.com" && cleanPassword === "Admin1234";

console.log({ matchesEnv, matchesHardcoded });
