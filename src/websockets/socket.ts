import * as IO from 'socket.io';
import * as jwt from 'jsonwebtoken';
import  { Connection } from '../database';
import { LocationController, UserController, ActivityController } from "../controller";
import {LOCATION_NOT_FOUND, Message} from "../messages";
import {INVALID_TOKEN} from "../messages/authenticationTypes";

export class WebSocket
{
    private io: any;
    private database: any;
    private locationController: LocationController;
    private userController: UserController;
    private activityController: ActivityController;

    constructor(server: any)
    {
        this.io = new IO(server);
        this.locationController = new LocationController();
        this.userController = new UserController();
        this.activityController = new ActivityController();
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

            socket.on('resetLocationData', (id) => {
                this.locationController.resetLocations(id).then( (message) => {
                    socket.emit('resetLocationDataResult', message);
                });
            });

            socket.on('resetAllLocationData', () => {
                this.locationController.resetAllLocations().then( (message) => {
                    socket.emit('resetAllLocationDataResult', message);
                });
            });

            socket.on('getUserData', () => {
                this.userController.getAllUsers().then( (users) => {
                    socket.emit('getUserDataResult', users);
                });
            });

            socket.on('getActivityData', () => {
                this.activityController.getAllActivities().then( (activities) => {
                    socket.emit('getActivityDataResult', activities);
                });
            });
        });
    }
}