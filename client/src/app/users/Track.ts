import { Image } from './Image';
import { Artist } from './Artist';

export class Track {
    external_urls: {
        spotify: string;
    };
    name: string;
    album: {
        images: Array<Image>;
    };
    artists: Array<Artist>;
}