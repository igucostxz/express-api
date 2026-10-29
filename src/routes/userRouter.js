import express from 'express';
import asyncRouter from './asyncRouter.js';
import createResourceController from '../controllers/resourceController.js';
import { users } from '../repository/index.js';

const controller = createResourceController(users);
const router = express.Router();

router.get('/', asyncRouter(controller.list));
router.get('/:id', asyncRouter(controller.get));
router.post('/', asyncRouter(controller.create));
router.patch('/:id', asyncRouter(controller.update));
router.delete('/:id', asyncRouter(controller.remove));

export default router;