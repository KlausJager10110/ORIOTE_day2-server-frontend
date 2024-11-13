
module.exports = (io, socket) => {
    const createOrder = (payload) => {
        // ...
    }

    const readOrder = (orderId, callback) => {
        // ...
    }

    socket.on("order:create", createOrder);
    socket.on("order:read", readOrder);
}