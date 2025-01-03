import { registerUser, loginUser } from "../services/user-service.js";
import { resolveError } from "../responses/response-mapper.js";

const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await registerUser(email, password);

    return res.status(200).json({
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error during registration:", error.message);
    return resolveError(error, res);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const result = await loginUser(email, password);

    return res.status(200).json({ message: "Login successful", data: result });
  } catch (error) {
    console.error("Error during login:", error.message);
    return resolveError(error, res);
  }
};

export { register, login };
