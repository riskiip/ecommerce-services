const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
/* Create schema first */
const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user'
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    cart: {
        type: Array,
        default: []
    },
    address: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address"
    }],
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }],
    refreshToken: {
        type: String
    }
}, {
    timestamps: true
});

// Hash password using bcrypt
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
})

// Find password to login
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

/* Then export model using schema that we design earlier */
module.exports = mongoose.model("User", userSchema);