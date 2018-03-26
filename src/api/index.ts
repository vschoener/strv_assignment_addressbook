import { Router } from 'express';

// Let's say we only want to enable this list of api version
const apiVersions: Array<string> = ['v1'];
const defaultApi: string = 'v1';

// Small api loader
const router = Router();
apiVersions.forEach((apiVersion) => {
    router.use(`/${apiVersion}`, require(__dirname + `/${apiVersion}`));
});

router.use('/', require(__dirname + `/${defaultApi}`));

export default router;
