import { Router } from 'express';
import { UserController } from './user.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { requirePermissions } from '../../middlewares/rbac.middleware';
import { Permissions } from '../roles/permission.constants';

const router = Router();

// All user routes require authentication
router.use(authMiddleware);

router.post('/', requirePermissions(Permissions.USER_CREATE), UserController.create);
router.get('/', requirePermissions(Permissions.USER_READ), UserController.findAll);
router.get('/:id', requirePermissions(Permissions.USER_READ), UserController.findById);
router.put('/:id', requirePermissions(Permissions.USER_UPDATE), UserController.update);
router.delete('/:id', requirePermissions(Permissions.USER_DELETE), UserController.delete);

export default router;
