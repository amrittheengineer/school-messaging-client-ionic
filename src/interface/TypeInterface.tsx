export interface GlobalStateContextInterface {
  user: User | null;
  setUser: (user: User) => void;
  classAnnouncements: Array<ClassAnnouncement>;
  updateClassAnnouncements: (callback: () => void) => void;
  announcements: Array<Announcement>;
  updateAnnouncements: (callback: () => void) => void;
}

export interface Album {
  videos: number;
  date: number;
  id: string;
  thumbnail: string;
  title: string;
}

export interface GalleryContextInterface {
  currentAlbum: Album | null;
  setCurrentAlbum: (photos: Album | null) => void;
  albumPhotos: Array<string>;
  setAlbumPhotos: (photos: Array<string>) => void;
  albumVideos: Array<string>;
  setalbumVideos: (photos: Array<string>) => void;
  albumList: Array<Album>;
}

export interface User {
  name: string;
  phone: string;
  batchId: string;
}

export interface ClassAnnouncement extends Broadcast {
  subject: string;
}
export interface Announcement extends Broadcast {
  photos: Array<string> | null;
  videos: Array<string> | null;
  url: Array<URLObject>;
}
export interface URLObject {
  thumbnail: string;
  url: string;
  title: string | null;
}

export interface Broadcast {
  message: string;
  timeStamp: number;
  id: string;
}
