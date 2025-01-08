import app from "./index.js";

const PORT = 8081;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Documentación de Swagger en http://localhost:${PORT}/api-docs`);
});
