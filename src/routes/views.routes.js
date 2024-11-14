import { Router } from 'express';
import { passportCall } from '../utils/passportUtils.js'
import { isNotAuth, isAdmin } from '../middleware/auth.js';
import { cart, currentLog, errorPage, home, login, productList, purchase, realTimeProductList, register, restorePswd, userProfile } from '../controllers/views.controller.js';
import passport from 'passport';

const router = Router();

router.get('/', passportCall('jwt'), home)

router.get('/products', passportCall('jwt'), productList)

router.get('/realtimeproducts', passportCall('jwt'), isAdmin, realTimeProductList)

router.get('/carts/:cid', passportCall('jwt'), cart)

router.get('/register', isNotAuth, register)

router.get('/login', isNotAuth, login)

router.get('/profile', passportCall('jwt'), userProfile)

router.get('/error', errorPage);

router.get('/restore-password', restorePswd)

router.get('/current', passportCall('jwt'), currentLog)

router.get('/purchase/:cid', passportCall('jwt'), purchase)

export default router;
