import {Request, Response} from 'express';
import {DIR_PATH_UPLOADED_IMAGE} from "../constant/constants";

export async function uploadImage(req: Request, res: Response, next: Function) {
    const uploadFile = req.files.file;
    console.log(uploadFile);
    if ("mv" in uploadFile) {
        uploadFile.mv(DIR_PATH_UPLOADED_IMAGE, function (err) {
            if (err)
                return res.status(500).send(err);
        });
    }
}