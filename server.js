import app from "./src/app.js";
import { config } from "./src/environment/config.js";

const PORT = config.port || 8080;

app.listen(PORT, () => {
	console.log(`Servidor escuchando en el puerto ${PORT}`);
});
