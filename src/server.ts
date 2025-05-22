import { app } from './app';
import { configs,logger,database } from './config';


async function inti(){
    try{
        app.listen(configs.port,() =>{
            logger.info(`api-server is running on port ${configs.port}`);
        });
        await database.connect();
    }catch(error){
        logger.error('Failed to start the server:', error);
        process.exit(1);
    }
}

inti();