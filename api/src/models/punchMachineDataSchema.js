import mongoose from 'mongoose';

const punchMachineDataSchema = new mongoose.Schema(
    {
        energyConsumption: {
            power: { type: Number, required: true },
        },
        voltage: {
            L1_GND: { type: Number, required: true },
            L2_GND: { type: Number, required: true },
            L3_GND: { type: Number, required: true },
        },
        pressure: { type: Number, required: true },
        force: { type: Number, required: true },
        cycleCount: { type: Number, required: true },
        positionOfThePunch: { type: Number, required: true },
        timestamp: {
            type: Date, default: () => {
                let currentUTCDate = new Date();
                let utcPlus7Date = new Date(currentUTCDate.getTime() + 7 * 60 * 60 * 1000);
                return utcPlus7Date;
            }
        },  // Sets default timestamp with Bangkok time
    },
    { timestamps: true } // Automatically adds 'createdAt' and 'updatedAt' fields in UTC
);

const PunchMachineData = mongoose.model('PunchMachineData', punchMachineDataSchema);

export default PunchMachineData;
