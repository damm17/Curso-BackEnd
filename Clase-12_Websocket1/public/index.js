
const socket = io();

const saveProduct = document.getElementById("saveProduct");
saveProduct.addEventListener("submit", e => {
    e.preventDefault();
    const product = {
        title: e.target[0].value,
        price: e.target[1].value,
        thumbnail: e.target[2].value
    }
    socket.emit('savedProduct', product)
});

socket.on('catalogo', data => {
    console.log('catalogo', data)

    const dynamicTable = document.getElementById("dynamic-table");
    dynamicTable.innerHTML = '';
    if (dynamicTable && data.length > 0) {
        const table = document.createElement("table");
        table.classList.add("table");
        const tableHead = document.createElement("thead");
        tableHead.innerHTML = `
            <tr>
                <th scope="col">#</th>
                <th scope="col">Nombre</th>
                <th scope="col">Precio</th>
                <th scope="col">Foto</th>
            </tr>
        `
        const tableBody = document.createElement("tbody");
        data.forEach(element => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <th scope="row">${element.id}</th>
                <td>${element.title}</td>
                <td>${element.price}</td>
                <td><img src=${element.thumbnail} class="img-thumbnail" width="50" /></td>
            `
            tableBody.appendChild(tr);
        });
        table.appendChild(tableHead)
        table.appendChild(tableBody)
        dynamicTable.appendChild(table);
    } else {
        const emptyMsg = `
        <div class="alert alert-warning" role="alert">
            No hay ningún producto en el catálogo.
        </div>
        `
        dynamicTable.innerHTML = emptyMsg;
    }
});