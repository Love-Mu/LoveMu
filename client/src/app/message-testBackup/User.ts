import { Artist } from './Artist';

export class User {
  _id: number;
  dob: Date;
  email: string;
  password: string;
  user_name: string;
  fname: string;
  sname: string;
  location: string;
  image: string;
  gender: string;
  sexuality: string;
  age: string;
  bio: string;
  top: Array<Artist>;
  score: number;
}
