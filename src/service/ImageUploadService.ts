import {Request} from 'express';
import {DIR_PATH_UPLOADED_IMAGE} from "../constant/constants";

export async function uploadImage(req: Request) {
    const uploadFile = req.files.file;
    console.log(uploadFile);
    console.log(DIR_PATH_UPLOADED_IMAGE)
    if ("mv" in uploadFile) {
        const path = 'uploads/' + uploadFile.name;
        await uploadFile.mv(
            path,
            function (err) {
                if (err) {
                    console.error(err);
                }
            });
        (req as any).path = path;
        return path;
    }
    return '';
}