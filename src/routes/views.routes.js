import { Router } from 'express';
import { passportCall } from '../utils/passportUtils.js'
import { isNotAuth, isAdmin } from '../middleware/auth.js';
import { cart, currentLog, errorPage, home, login, productList, purchase, realTimeProductList, register, restorePswd, userProfile } from '../controllers/views.controller.js';

const router = Router();

router.get('/', home)

router.get('/products', productList)

router.get('/realtimeproducts', isAdmin, realTimeProductList)

router.get('/carts/:cid', cart)

router.get('/register', isNotAuth, register)

router.get('/login', isNotAuth, login)

router.get('/profile', passportCall('jwt'), userProfile)

router.get('/error', errorPage);

router.get('/restore-password', restorePswd)

router.get('/current', currentLog)

router.get('/purchase/:cid', purchase)

export default router;
