export const getAllMachines = (req, res) => {
    res.status(200).json({
        message: "Machine Data",
        data: [
            // Sample machine data (replace with actual data retrieval in a real app)
            { id: 1, name: "Machine 1", status: "active" },
            { id: 2, name: "Machine 2", status: "inactive" }
        ]
    });
};

// You can add other functions here for handling other routes, if needed
