import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

export const config = {
	port: 8080,
    uri: 'mongodb://localhost:27017/ecommerceNew',
    mongoConfig: {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
};