import * as express from 'express';
import {Request, Response} from 'express';
import {uploadImage} from "../service/ImageUploadService";
const UploadRouter = express.Router();

UploadRouter.post('/', (req: Request, res: Response) => {
    res.send('Hello, World');
});
UploadRouter.post('/image', uploadImage);

export default UploadRouter;
