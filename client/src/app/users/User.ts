import { Artist } from './Artist';
import { Track } from './Track';
import { Image } from './Image';

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
  artists: Array<Artist>;
  blockedArtists: Array<Artist>;
  overlappingArtists: Array<Artist>;
  score: number;
  favouriteSong: string;
  playlist: string;
  playlists: Array<Playlist>;
  blocked: Array<number>;
}

class Playlist {
  href: string;
  external_urls: {
    spotify: string;
  }
}
