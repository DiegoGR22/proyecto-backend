import { Router } from "express";
import { passportCall } from "../../utils/passportUtils.js";
import passport from "passport";
import { current, failLogin, failRegister, githubLogin, login, logout, register, restorePswd, role } from '../../controllers/user.controller.js';

const router = Router();

router.post('/register',passport.authenticate('register', {failureRedirect: 'failRegister'}), register)

router.get('/failRegister', failRegister)

router.post('/login', passport.authenticate('login', {failureRedirect: 'failLogin'}), login);

router.get('/failLogin', failLogin)

router.post('/logout', logout)

router.post('/role', role);

router.post('/restore-password', restorePswd)

router.get('/github', passport.authenticate('github', {scope: ['user: email']}), async (req, res) => {})

router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}), githubLogin)

router.get('/current', passportCall('jwt'), current)

export default router;