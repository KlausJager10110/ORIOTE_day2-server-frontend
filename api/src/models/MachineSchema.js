import mongoose from 'mongoose';

const machineConditionSchema = new mongoose.Schema({
    machine_id: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    },
    temperature: {
        type: Number,
        required: true
    },
    vibration_level: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['operational', 'maintenance_required', 'error'],
        required: true
    },
    error_code: {
        type: String,
        default: null
    },
    pressure: {
        type: Number,
        required: true
    },
    humidity: {
        type: Number,
        required: true
    },
    power_usage: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    }
});

const MachineCondition = mongoose.model('MachineCondition', machineConditionSchema);

export default MachineCondition;
