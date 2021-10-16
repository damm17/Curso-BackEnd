const options = {
    client: 'sqlite3',
    connection: {
        filename: './DB/mensajes.sqlite'
    },
    useNullAsDefault: true
}

console.log('Conectando a la base de datos...');

export default options;