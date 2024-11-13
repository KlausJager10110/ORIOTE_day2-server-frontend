export default (io, socket) => {

    const create = (data) => {
        console.log('Create machine:', data);  // Ensure you pass necessary data from client
        socket.emit('machine:update', { message: "Machine created successfully", machineData: data });
    };

    const read = () => {
        console.log('Read machine');
        // Add your logic to fetch and send machine data
    };

    const update = (data) => {
        console.log('Update machine:', data);
        // Add your logic to update machine data
    };

    const deleted = (machineId) => {
        console.log('Deleted machine:', machineId);
        // Add your logic to delete the machine from the database
    };

    // Bind the events correctly
    socket.on("machine:create", create);
    socket.on("machine:read", read);
    socket.on("machine:update", update);
    socket.on("machine:delete", deleted);

};
