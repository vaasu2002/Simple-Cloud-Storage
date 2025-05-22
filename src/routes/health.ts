import os from 'os';
import { Router } from 'express';

const healthRoute = Router();

healthRoute.get('/', (_req, res) =>{
    const uptimeSeconds = process.uptime();
    const uptime = new Date(uptimeSeconds * 1000).toISOString().substr(11, 8);
    res.status(200).json({
        success:true,
        data:{
            message:'scs2-api-server is live',
            date:new Date().toLocaleDateString(),
            time:new Date().toLocaleTimeString(),
            uptime:uptime,
            hostname: os.hostname(),
            status: 'healthy'
        }
    });
});


export {healthRoute};