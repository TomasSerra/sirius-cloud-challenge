/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get stats about the storage used today by all users (Only for admins)
 *     tags:
 *          - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK - Stats fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Stats fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: string
 *                         description: User Id
 *                         example: 746bf3nf43nf42409
 *                       mbUsed:
 *                         type: number
 *                         description: Megabytes used today
 *                         example: 60.78
 *       403:
 *         description: Forbidden - User is not authorized to view this data
 *       400:
 *         description: Bad Request - Token not provided or invalid format
 */
