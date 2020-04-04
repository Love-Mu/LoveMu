import { Image } from './Image';
import { Artist } from './Artist';

export class Track {
    external_urls: {
        spotify: string;
    };
    name: string;
    images: Image;
    artist: Artist;
}