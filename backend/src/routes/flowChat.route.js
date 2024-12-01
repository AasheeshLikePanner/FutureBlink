import {Router} from 'express';
import { getAllFlowChat, saveFlowChart, scheduleEmail } from '../controllers/flowChat.controller.js';
import {verifyJWT} from '../middleware/auth.middleware.js';

const flowChartRouter = Router();

flowChartRouter.route('/schedule-email').post(verifyJWT, scheduleEmail);

flowChartRouter.route('/save-flowchart').post(verifyJWT, saveFlowChart);

flowChartRouter.route('/get-all-flowchart').get(verifyJWT, getAllFlowChat);

export default flowChartRouter;