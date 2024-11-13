import MachineCondition from '../models/MachineSchema.js'
const saveMachineData = async (machineData) => {
    try {
        if (typeof machineData !== 'object' || machineData === null) {
            throw new TypeError("Invalid data: machineData must be an object.");
        }

        const newMachineCondition = new MachineCondition(machineData);
        await newMachineCondition.save();
        console.log("Machine data saved successfully!", machineData);
    } catch (err) {
        console.error("Error saving machine data:", err);
    }
};
export default saveMachineData;