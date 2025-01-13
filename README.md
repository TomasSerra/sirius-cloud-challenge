# Cloud Storage Challenge for Sirius

Creation of a simple API that allow users to upload, download and share files.

## How to start the project

1. Create Auth0, Azure Blob and Google Cloud Storage account
2. Find the following data and save it in .env file:

- AUTH0_DOMAIN
- AUTH0_CLIENT_ID
- AUTH0_CLIENT_SECRET
- AUTH0_API_AUDIENCE
- AUTH0_ISSUER
- GCP_BUCKET_NAME
- GCP_PROJECT_ID
- AZURE_STORAGE_ACCOUNT_NAME
- AZURE_STORAGE_ACCOUNT_KEY
- AZURE_STORAGE_CONTAINER_NAME

3. Config PostgreSQL and save DATABASE_URL in .env
4. Run `npm run dev` to start running the server on localhost:8081

## Features

- Register and login users
- Upload, download and share files for autenticated users
- Get stats of daily usage if you are admin
