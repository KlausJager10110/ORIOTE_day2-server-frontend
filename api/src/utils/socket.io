const io = new socketIO(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});


const onConnection = (socket) => {
    console.log('A client connected: ', socket.id);

    MachineHandler(io, socket);

    socket.on("topicSelect", (topicSelect) => {
        addTopicHandler(topicSelect, (message) => {
            console.log("emit message");
            io.emit(topicSelect, message);
            saveMachineData(JSON.parse(message));
        });
    });

    socket.on('disconnect', () => {
        console.log(`Client ${socket.id} disconnected`);
    });
};

io.on("connection", onConnection);

