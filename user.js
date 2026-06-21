import { User } from "./db.js";
import bcrypt from "bcrypt";


// ==================== REGISTER USER ====================

async function registerUser(name, email, password) {

    // Normalize inputs
    name = name.trim();
    email = email.trim().toLowerCase();

    // Name validation
    if (!name) {
        console.log("Name cannot be empty.");
        return;
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        console.log("Invalid email format.");
        return;
    }

    // Password validation
    if (!password || password.length < 4) {
        console.log("Password must be at least 4 characters.");
        return;
    }

    // Duplicate email check
    const existingUser = await User.findOne({
        where: {
            email,
        },
    });

    if (existingUser) {
        console.log("Email already exists.");
        return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await User.create({
        name,
        email,
        password: hashedPassword,
    });

    console.log("\nRegistration successful!");
}


// ==================== LOGIN USER ====================

async function loginUser(email, password) {

    // Normalize email
    email = email.trim().toLowerCase();

    // Find user
    const user = await User.findOne({
        where: {
            email,
        },
    });

    // Email not found
    if (!user) {
        console.log("Invalid email or password.");
        return null;
    }

    // Compare password with hashed password
    const isMatch = await bcrypt.compare(
        password,
        user.password
    );

    if (!isMatch) {
        console.log("Wrong credential");
        return null;
    }

    console.log("\nLogin successful!");

    return user;
}


// ==================== EXPORTS ====================

export {
    registerUser,
    loginUser,
};