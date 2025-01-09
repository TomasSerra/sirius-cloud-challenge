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
 *               example: "https://cloudchallengesirius.blob.core.windows.net/files/677e751ebecbc7810f7a8556/9c2e1454a8dab46f1c1667c80348da5276679a76305c0fa034e195512978c205?sv=2025-01-05&se=2025-01-09T15%3A14%3A33Z&sr=b&sp=r&sig=MasNNX3BPV8SwGfgcAp0gYEW%2FKCmqDD7FKWflMW4nuM%3D"
 *       400:
 *         description: Bad Request - Invalid filename
 *       404:
 *         description: Not Found - File does not exist
 *       500:
 *         description: Internal Server Error - Server error occurred
 */
