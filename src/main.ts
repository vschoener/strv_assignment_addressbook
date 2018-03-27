import { app, logger } from './bootstrap';

app.run().catch(err => {
    logger.error(err);
});
