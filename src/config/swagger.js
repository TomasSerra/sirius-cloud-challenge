import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Cloud Storage Challenge",
      version: "1.0.0",
      description: "Documentation for the Cloud Storage Challenge API",
    },
    servers: [
      {
        url: "http://localhost:8081",
        description: "Local server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    tags: [
      {
        name: "Admin",
        description: "Endpoints for admin operations",
      },
      {
        name: "Auth",
        description: "Endpoints for authentication",
      },
      {
        name: "Files",
        description: "Endpoints for file operations",
      },
    ],
  },
  apis: ["./src/swagger/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
