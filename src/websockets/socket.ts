import * as IO from 'socket.io';
import * as jwt from 'jsonwebtoken';
import  { Connection } from '../database';
import { OdController, LocationController } from "../controller";
import {ExhibitController} from "../controller/exhibitController";
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
            socket.use((packet, next) =>
            {
                const event: String = packet[0];
                const token = socket.token;

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
            });

            socket.emit('news', { hello: 'world' });

            socket.on('registerOD', (data) =>
            {
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
            });
        });
    }
}