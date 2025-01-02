import app from "./index.js";
import {
  notFoundHandler,
  generalErrorHandler,
  unauthorizedErrorHandler,
} from "./error-handler.js";

const PORT = 8081;

app.get("/authorized", function (req, res) {
  res.send("Secured Resource");
});

app.use(unauthorizedErrorHandler);
app.use(notFoundHandler);
app.use(generalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
