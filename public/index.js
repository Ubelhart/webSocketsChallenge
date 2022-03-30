const socket = io.connect();

function render(data) {
  const html = data
    .map((elem) => {
      return `<div>
            <strong>${elem.title}</strong>:
            <em>${elem.price}</em> </div>`;
    })
    .join(" ");
  document.getElementById("table").innerHTML = html;
}

socket.on("messages", function (data) {
  render(data);
});

function addMessage(e) {
  const mensaje = {
    author: document.getElementById("username").value,
    text: document.getElementById("texto").value,
  };
  socket.emit("new-message", mensaje);
  return false;
}
