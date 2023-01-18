import {User} from '../src/entities/User'
import {Request} from "express";
import {Express} from "express";

declare module "express" {
    export interface Request {
        user: any
    }
}