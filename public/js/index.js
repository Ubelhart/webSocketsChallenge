const socket = io.connect();

document.getElementById("button").addEventListener("submit", (e) => {
  e.preventDefault();
});

function render(data) {
  const html = data
    .map((product) => {
      return `
        <tr>
          <td> ${product.title} </td>
          <td>${product.price}</td>
          <td><img src=${product.thumbnail} /></td>
        </tr>`;
    })
    .join(" ");
  document.getElementById("table").innerHTML = html;
}

socket.on("messages", (data) => {
  render(data);
});
