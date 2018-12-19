import * as IO from 'socket.io';
import * as jwt from 'jsonwebtoken';
import  { Connection } from '../database';
import { LocationController } from "../controller";
import {LOCATION_NOT_FOUND, Message} from "../messages";
import {INVALID_TOKEN} from "../messages/authenticationTypes";

export class WebSocket
{
    private io: any;
    private database: any;
    private locationController: LocationController;

    constructor(server: any)
    {
        this.io = new IO(server);
        this.locationController = new LocationController();
        this.database = Connection.getInstance();

        this.attachListeners();
    }

    private attachListeners(): void
    {
        this.io.on('connection', (socket) =>
        {
            console.log('connected' );

            socket.emit('news', { text: 'AdminServer on' });

            socket.on('getLocationData', () => {
                this.locationController.getAllLocations().then( (locations) => {
                    socket.emit('getLocationaDataResult', locations);
                });
            });

            socket.on('getUserData', () => {
                this.locationController.getAllUsers().then( (users) => {
                    socket.emit('getUserDataResult', users);
                });
            });

            socket.on('getActivityData', () => {
                this.locationController.getAllActivities().then( (activities) => {
                    socket.emit('getActivityDataResult', activities);
                });
            });
        });
    }
}