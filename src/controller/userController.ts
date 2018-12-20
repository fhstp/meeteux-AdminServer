
import { Connection } from '../database';
import {
    Message,
    SUCCESS_OK,
    OD_NOT_FOUND,
    OD_NOT_CREATED,
    OD_NOT_UPDATED
} from '../messages';
import * as statusTypes from '../config/statusTypes';
import * as locationTypes from '../config/locationTypes';

export class UserController
{
    private database: Connection;

    constructor()
    {
        this.database = Connection.getInstance();
    }

    public getAllUsers(): any
    {
        return this.database.user.findAll().then( users => {
           return {data: users, message: new Message(SUCCESS_OK, "Found all users!")};
        }).catch(() => {
            return {data: null, message: new Message(OD_NOT_FOUND,"Did not found users!")};
        });
    }
}