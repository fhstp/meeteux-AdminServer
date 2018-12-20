
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

    public resetLocations(tableid: any): any
    {
        let table = 0;
        let seats = 0;
        return this.database.location.update({ currentSeat: 0, statusId: 3 },{ where: { id: tableid }})
        .spread((affectedCount, affectedRows) => { table = affectedCount; })
        .then( () => {
            return this.database.location.update({ statusId: 3 },{ where: { parentId: tableid }})
            .spread((affectedCount, affectedRows) => { seats = affectedCount; })
            .then( () => {
                let mesg = table + ' table(s) and ' + seats + ' seat(s) reseted successfully!';
                return { data: null, message: new Message(SUCCESS_OK, mesg.toString()) };
            }).catch(() => {
                return { data: null, message: new Message(LOCATION_NOT_UPDATED, "Could not reset locations!")}
            });            
        });
    }

    public resetAllLocations(): any
    {
        let table = 0;
        let seats = 0;
        return this.database.location.update({ currentSeat: 0, statusId: 3 },{ where: { locationTypeId: 3 }})
        .spread((affectedCount, affectedRows) => { table = affectedCount; })
        .then( () => {
            return this.database.location.update({ statusId: 3 },{ where: { locationTypeId: 2 }})
            .spread((affectedCount, affectedRows) => { seats = affectedCount; })
            .then( () => {
                let mesg = table + ' table(s) and ' + seats + ' seat(s) reseted successfully!';
                return { data: null, message: new Message(SUCCESS_OK, mesg) };
            }).catch(() => {
                return { data: null, message: new Message(LOCATION_NOT_UPDATED, "Could not reset locations!")}
            });            
        });
    }
}