class UserController {
  constructor({ userService, resolveError }) {
    this.userService = userService;
    this.resolveError = resolveError;

    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
  }

  async register(req, res) {
    try {
      const { email, password } = req.body;

      const result = await this.userService.register(email, password);

      return res.status(200).json({
        message: "User registered successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error during registration:", error.message);
      return this.resolveError(error, res);
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }

      const result = await this.userService.login(email, password);

      return res
        .status(200)
        .json({ message: "Login successful", data: result });
    } catch (error) {
      console.error("Error during login:", error.message);
      return this.resolveError(error, res);
    }
  }
}

export default UserController;
