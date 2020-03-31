import { Image } from './Image';

export class Artist {
    name: string;
    images: Array<Image>;
    external_urls: spotifyUrls;
}

class spotifyUrls {
    spotify: string;
}