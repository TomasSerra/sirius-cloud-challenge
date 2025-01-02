import { registerUser } from "../services/user-service.js";

const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await registerUser(email, password);

    return res.status(201).json({
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error during registration:", error.message);

    return res.status(500).json({
      message: "An error occurred during registration",
      error: error.message,
    });
  }
};

export { register };
