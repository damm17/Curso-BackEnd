import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

export const config = {
	isAdmin: true,
	hostname: "http://localhost:8080/",
	port: process.env.PORT,
};