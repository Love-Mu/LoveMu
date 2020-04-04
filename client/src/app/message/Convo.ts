import { User } from '../users/User';
import { Message } from '../message/Message';
import { Chatroom } from './Chatroom';

export class Convo {
    _id: number;
    members: Array<User>;
    messages: Message[];
}