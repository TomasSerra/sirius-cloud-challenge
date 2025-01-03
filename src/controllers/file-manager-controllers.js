import { uploadFile } from "../services/file-service";
import { resolveError } from "../responses/response-mapper";

const upload = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await uploadFile(email, password);

    return res.status(200).json({
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error during registration:", error.message);
    return resolveError(error, res);
  }
};

export { upload };
