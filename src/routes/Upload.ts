import * as express from 'express';
import {Request, Response} from 'express';
import {importImage} from "../service/Docker";
const UploadRouter = express.Router();

UploadRouter.post('/', (req: Request, res: Response) => {
    res.send('Hello, World');
});
UploadRouter.post('/image', importImage);

export default UploadRouter;
