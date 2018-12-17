
import { Connection } from '../database';
import {
    Message,
    LOCATION_NOT_FOUND,
    SUCCESS_OK,
    LOCATION_NOT_UPDATED,
    LOCATION_NOT_CREATED,
    SUCCESS_CREATED
} from '../messages';
import * as statusTypes from '../config/statusTypes';
import * as locationTypes from '../config/locationTypes';

export class LocationController
{
    private database: Connection;

    constructor()
    {
        this.database = Connection.getInstance();
    }

    public getAllLocations(): any
    {
        return this.database.location.findAll().then( locations => {
           return {data: locations, message: new Message(SUCCESS_OK, "Found all locations!")};
        }).catch(() => {
            return {data: null, message: new Message(LOCATION_NOT_FOUND,"Did not found locations!")};
        });
    }

    public getAllUsers(): any
    {
        return this.database.user.findAll().then( users => {
           return {data: users, message: new Message(SUCCESS_OK, "Found all users!")};
        }).catch(() => {
            return {data: null, message: new Message(LOCATION_NOT_FOUND,"Did not found users!")};
        });
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
            }]/*,
            where: {
                locationId: this.database.location.id
            }*/
        }).then( activities => {
           return {data: activities, message: new Message(SUCCESS_OK, "Found all activities!")};
        }).catch(() => {
            return {data: null, message: new Message(LOCATION_NOT_FOUND,"Did not found activities!")};
        });
    }
}