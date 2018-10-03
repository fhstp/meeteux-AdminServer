
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
}