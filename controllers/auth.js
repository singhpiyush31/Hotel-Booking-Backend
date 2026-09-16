const bcrypt = require("bcrypt");

const User = require("../models/user");
const { sendEmail } = require("../utils/sendEmail");

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

exports.register = async (req, res) => {
    try {
        const { name, email, password, role, adminSecret } = req.body;

        if (!name || !email || !password) {
            return res
                .status(400)
                .json({ message: "All fields are required!" });
        }

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const existEmail = await User.findOne({ email: email });

        if (existEmail) {
            return res.status(404).json({ message: "Email already exist!" });
        }

        let finalRole = "User";

        if (role === "Owner") finalRole = "Owner";

        if (
            process.env.ADMIN_SECRET &&
            adminSecret &&
            adminSecret === process.env.ADMIN_SECRET
        ) {
            finalRole = "Admin";
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: passwordHash,
            role: finalRole,
        });
        await user.save();

        await sendEmail({
            to: email,
            subject: "Welcome to Hotel Booking!",
            text: `Hi ${name}, \n \n Your account is ready. Role: ${user.role}. \n \n Happy Booking!.`,
        });

        res.status(201).json({
            message: "User registered successfully!",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error!",
            error: err.message,
        });
    }
};
