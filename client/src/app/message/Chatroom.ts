import { User } from '../users/User';
import { Message } from '../message/Message';

export class Chatroom {
    _id: number;
    members: Array<string>;
    message: [Message];
}