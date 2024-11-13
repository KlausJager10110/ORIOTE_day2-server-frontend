import punchMachineData from '../models/punchMachineDataSchema.js'

export const getPunchMachineDataById = async (req, res, next) => {
    try {
      const { id } = req.params; // Destructure the `id` from the request parameters
      const data = await punchMachineData.findById(id); // Use the id directly for the query
  
      if (!data) {
        return res.status(404).json({ message: 'Punch machine data not found' });
      }
  
      // Return the fetched data with a 200 OK response
      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching punch machine data:', error);
      res.status(500).json({ message: 'Error fetching punch machine data' });
    }
  };
  

export const getPunchMachineData = async (req, res) => {
    try {

        const data = await punchMachineData.findOne(); // You can add filters if needed (e.g., based on query params)

        // Return the fetched data with a 200 OK response
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching punch machine data:', error);
        res.status(500).json({ message: 'Error fetching punch machine data' });
    }
};


// Controller to add new punch machine data
export const addPunchMachineData = async (req, res) => {
    try {
        // Destructure the data from the request body
        const { energyConsumption, voltage, pressure, force, cycleCount, positionOfThePunch } = req.body;

        // Validate the energyConsumption object
        if (!energyConsumption || typeof energyConsumption !== 'object' || !energyConsumption.power) {
            return res.status(400).json({ message: 'Invalid energyConsumption: Must be an object with a "power" field.' });
        }

        // Validate the voltage object
        if (!voltage || typeof voltage !== 'object' || !voltage['L1_GND'] || !voltage['L2_GND'] || !voltage['L3_GND']) {
            return res.status(400).json({ message: 'Invalid voltage: Must be an object with "L1_GND", "L2_GND", and "L3_GND" fields.' });
        }

        // Validate pressure (must be a number)
        if (typeof pressure !== 'number') {
            return res.status(400).json({ message: 'Invalid pressure: Must be a number.' });
        }

        // Validate force (must be a number)
        if (typeof force !== 'number') {
            return res.status(400).json({ message: 'Invalid force: Must be a number.' });
        }

        // Validate cycleCount (must be a positive integer)
        if (typeof cycleCount !== 'number' || cycleCount < 0 || !Number.isInteger(cycleCount)) {
            return res.status(400).json({ message: 'Invalid cycleCount: Must be a positive integer.' });
        }

        // Validate positionOfThePunch (must be a number)
        if (typeof positionOfThePunch !== 'number') {
            return res.status(400).json({ message: 'Invalid positionOfThePunch: Must be a number.' });
        }

        // Create a new instance of the model with the provided data
        const newPunchMachineData = new punchMachineData({
            energyConsumption,
            voltage,
            pressure,
            force,
            cycleCount,
            positionOfThePunch,
        });

        // Save the new data to the database
        const savedData = await newPunchMachineData.save();

        console.log('Saved data to database:', savedData);

        // Return the saved data with a 201 Created response
        res.status(201).json({
            message: 'Punch machine data added successfully',
            data: savedData,
        });
    } catch (error) {
        console.error('Error adding punch machine data:', error);
        res.status(500).json({
            message: 'Error adding punch machine data',
            error: error.message,
        });
    }
};


// Controller to update existing punch machine data
export const updatePunchMachineData = async (req, res) => {
    try {
        const { id } = req.params; // Get the id of the document to update
        const { energyConsumption, voltage, pressure, force, cycleCount, positionOfThePunch } = req.body;

        // Validate the energyConsumption object
        if (!energyConsumption || typeof energyConsumption !== 'object' || !energyConsumption.power) {
            return res.status(400).json({ message: 'Invalid energyConsumption: Must be an object with a "power" field.' });
        }

        // Validate the voltage object
        if (!voltage || typeof voltage !== 'object' || !voltage['L1_GND'] || !voltage['L2_GND'] || !voltage['L3_GND']) {
            return res.status(400).json({ message: 'Invalid voltage: Must be an object with "L1_GND", "L2_GND", and "L3_GND" fields.' });
        }

        // Validate pressure (must be a number)
        if (typeof pressure !== 'number') {
            return res.status(400).json({ message: 'Invalid pressure: Must be a number.' });
        }

        // Validate force (must be a number)
        if (typeof force !== 'number') {
            return res.status(400).json({ message: 'Invalid force: Must be a number.' });
        }

        // Validate cycleCount (must be a positive integer)
        if (typeof cycleCount !== 'number' || cycleCount < 0 || !Number.isInteger(cycleCount)) {
            return res.status(400).json({ message: 'Invalid cycleCount: Must be a positive integer.' });
        }

        // Validate positionOfThePunch (must be a number)
        if (typeof positionOfThePunch !== 'number') {
            return res.status(400).json({ message: 'Invalid positionOfThePunch: Must be a number.' });
        }

        // Find the document by ID and update it
        const updatedData = await punchMachineData.findByIdAndUpdate(
            id,
            {
                energyConsumption,
                voltage,
                pressure,
                force,
                cycleCount,
                positionOfThePunch,
            },
            { new: true } // Return the updated document
        );

        if (!updatedData) {
            return res.status(404).json({ message: 'Punch machine data not found' });
        }

        // Return the updated data with a 200 OK response
        res.status(200).json({
            message: 'Punch machine data updated successfully',
            data: updatedData,
        });
    } catch (error) {
        console.error('Error updating punch machine data:', error);
        res.status(500).json({
            message: 'Error updating punch machine data',
            error: error.message,
        });
    }
};

// Controller to delete punch machine data
export const deletePunchMachineData = async (req, res) => {
    try {
        const { id } = req.params; // Get the id of the document to delete

        // Find and delete the document by ID
        const deletedData = await punchMachineData.findByIdAndDelete(id);

        if (!deletedData) {
            return res.status(404).json({ message: 'Punch machine data not found' });
        }

        // Return a success message with a 200 OK response
        res.status(200).json({
            message: 'Punch machine data deleted successfully',
            data: deletedData,
        });
    } catch (error) {
        console.error('Error deleting punch machine data:', error);
        res.status(500).json({
            message: 'Error deleting punch machine data',
            error: error.message,
        });
    }
};