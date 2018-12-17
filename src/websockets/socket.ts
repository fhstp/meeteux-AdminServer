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
        server.port 
        this.locationController = new LocationController();
        this.database = Connection.getInstance();

        this.attachListeners();
    }

    private attachListeners(): void
    {
        this.io.on('connection', (socket) =>
        {
            socket.use((packet, next) =>
            {
                const event: String = packet[0];
                const token = socket.token;

                /*
                if(event.localeCompare('registerOD') !== 0)
                {
                    jwt.verify(token, process.env.SECRET, (err, decoded) =>
                    {
                        if(err) return next(new Error('Invalid token Error'));

                        const user = decoded.user;

                        if(user)
                        {
                            next();
                        }

                        next(new Error('Access Restricted Error'));
                    });
                }
                else {
                    next();
                }
                */
            });

            socket.emit('news', { text: 'AdminServer on' });

            // Only sending when connecting, but that is not good
            this.locationController.getAllLocations().then( (locations) => {
                socket.emit('getLocationDataResult', locations);
            });

            this.locationController.getAllUsers().then( (users) => {
                socket.emit('getUserDataResult', users);
            });

            this.locationController.getAllActivities().then( (activities) => {
                socket.emit('getActivityDataResult', activities);
            });

           /* socket.on('registerOD', (data) =>
            {
                /*
                this.odController.registerOD(data).then( (result) =>
                {
                    const user = result.data.user;
                    const locations = result.data.locations;

                    // Generate token
                    const token = jwt.sign({user}, process.env.SECRET);

                    // Add token to result and to the socket connection
                    result.data = {token, user, locations};
                    socket.token = token;

                    socket.emit('registerODResult', result);
                });
                *
            });*/

            // Not really listening to this:
            socket.on('getLocationData', () => {
                console.log('getLocationData');
                this.locationController.getAllLocations().then( (locations) => {
                    socket.emit('getLocationaDataResult', locations);
                });
            });

            socket.on('getUserData', () => {
                this.locationController.getAllUsers().then( (users) => {
                    socket.emit('getUserDataResult', users);
                });
            });
        });
    }
}