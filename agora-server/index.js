import express from 'express';
import dotenv from 'dotenv';
import pkg from 'agora-access-token';
import cors from 'cors';
import { createServer } from 'http';
const { RtcTokenBuilder, RtmRole, RtcRole } = pkg;

dotenv.config();

const PORT = 8080;

const APP_ID = process.env.APP_ID;
const APP_CERTIFICATE = process.env.APP_CERTIFICATE;

const app = express();
const httpServer = createServer(app);

const corsOptions = {
    origin: `http://localhost:${process.env.CLIENT_PORT}`,
    optionsSuccessStatus: 200
};

const nocache = (req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
}

const generateAccessToken = (req, resp) => {
    // set response header
    resp.header('Access-Control-Allow-Origin', '*'); 
    // get channel name
    const channelName = req.query.channelName;
    console.log(channelName);
    //print channel name type
    console.log(typeof channelName);
    if (!channelName) {
        return resp.status(500).json({ 'error': 'channel is required' });
    }
    // get uid
    let uid = req.query.uid;
    if (!uid || uid == '') {
        uid = 0;
    }
    // get role
    let role;
    console.log(req.query.role);
    if (req.query.role === 'publisher') {
        role = RtcRole.PUBLISHER;
      } else if (req.query.role === 'audience') {
        role = RtcRole.SUBSCRIBER
      } else {
        return resp.status(400).json({ 'error': 'role is incorrect' });
      }
    // get the expire time
    let expireTime = req.query.expireTime;
    if (!expireTime || expireTime == '') {
        expireTime = 3600;
    } else {
        expireTime = parseInt(expireTime, 10);
    }
    // calculate privilege expire time
    const currentTime = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTime + expireTime;
    // build the token
    const token = RtcTokenBuilder.buildTokenWithUid(`${process.env.APP_ID}`, `${process.env.APP_CERTIFICATE}`, channelName, uid, role, privilegeExpireTime);
    // return the token
    return resp.json({ 'token': token , 'uid': uid, 'channelName': channelName, 'appID': `${process.env.APP_ID}`, 'certificate': `${process.env.APP_CERTIFICATE}`, 'expireTime': expireTime, 'role': role });

};

app.use(cors(corsOptions));



app.get('/access_token', nocache, generateAccessToken);

httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`APP_ID: ${APP_ID}`)
    console.log(`APP_CERTIFICATE: ${APP_CERTIFICATE}`)
    console.log(`Server running on port ${PORT}`);
});
