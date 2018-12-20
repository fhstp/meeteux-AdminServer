
import { Connection } from '../database';
import {
    Message,
    ACTIVITY_NOT_FOUND,
    SUCCESS_OK
} from '../messages';
import * as statusTypes from '../config/statusTypes';
import * as locationTypes from '../config/locationTypes';

export class ActivityController
{
    private database: Connection;

    constructor()
    {
        this.database = Connection.getInstance();
    }

    public getAllActivities(): any
    {
        return this.database.activity.findAll({
            attributes: ['id','liked','createdAt','updatedAt','locationId'],
            include: [{
                model: this.database.location,
                attributes: [['description', 'locationDesc']]
            }, {
                model: this.database.user,
                attributes: [['name', 'userName']]
            }]
        }).then( activities => {
           return {data: activities, message: new Message(SUCCESS_OK, "Found all activities!")};
        }).catch(() => {
            return {data: null, message: new Message(ACTIVITY_NOT_FOUND,"Did not found activities!")};
        });
    }
}