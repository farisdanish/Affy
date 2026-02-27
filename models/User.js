const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ['admin', 'agent', 'merchant', 'user'], default: 'user' },
}, { timestamps: true });