import express from "express";
import {
  upload,
  download,
  share,
} from "../controllers/file-manager-controllers.js";

const fileManagerRoutes = express.Router();

/**
 * @swagger
 * /api/files/upload:
 *   post:
 *     summary: Upload a file to the server
 *     tags:
 *       - Files
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to be uploaded
 *                 example: "file.png"
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "File uploaded successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     filename:
 *                       type: string
 *                       description: The uploaded file's name
 *                       example: "file.png"
 *                     size:
 *                       type: integer
 *                       description: The file's size in bytes
 *                       example: 102400
 *       400:
 *         description: Bad Request - Invalid file format or missing file
 *       500:
 *         description: Internal Server Error - Server error occurred
 */

fileManagerRoutes.post("/upload", upload);

/**
 * @swagger
 * /api/files/share/{filename}:
 *   post:
 *     summary: Share a file by filename
 *     tags:
 *       - Files
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: filename
 *         in: path
 *         required: true
 *         description: The name of the file to be shared
 *         schema:
 *           type: string
 *           example: "file.png"
 *     responses:
 *       200:
 *         description: File shared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "File shared successfully"
 *       400:
 *         description: Bad Request - Invalid filename
 *       404:
 *         description: Not Found - File does not exist
 *       500:
 *         description: Internal Server Error - Server error occurred
 */

fileManagerRoutes.post("/share/:fileId", share);

/**
 * @swagger
 * /api/files/download/{filename}:
 *   get:
 *     summary: Get the file url signed for download
 *     tags:
 *       - Files
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: filename
 *         in: path
 *         required: true
 *         description: The name of the file to be downloaded
 *         schema:
 *           type: string
 *           example: "file.png"
 *     responses:
 *       200:
 *         description: File downloaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "File downloaded successfully"
 *       400:
 *         description: Bad Request - Invalid filename
 *       404:
 *         description: Not Found - File does not exist
 *       500:
 *         description: Internal Server Error - Server error occurred
 */

fileManagerRoutes.get("/download/:fileId", download);

export default fileManagerRoutes;
