import { User } from '../users/User';
import { Message } from '../message/Message';

export class Convo {
    _id: number;
    user: User;
    messages: Array<Message>;
}