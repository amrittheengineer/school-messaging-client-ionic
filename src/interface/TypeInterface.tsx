import { SetStateAction, Dispatch } from "react";

export interface GlobalStateContextInterface {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>; //(user: User) => void;
  setClassAnnouncements: Dispatch<SetStateAction<Array<ClassAnnouncement>>>; //(user: Array<ClassAnnouncement>) => void;
  classAnnouncements: Array<ClassAnnouncement>;
  updateClassAnnouncements: (callback: () => void) => void;
  announcements: Array<Announcement>;
  updateAnnouncements: (callback: () => void) => void;
}
// interface Props<T> {
//   list: T[];
//   renderItem: JSX.Element | renderFunc;
//   renderWhenEmpty?: null | (() => JSX.Element);
//   limit?: number;
//   reversed?: boolean;
//   wrapperHtmlTag?: string;
//   group?: GroupInterface;
//   search?: SearchOptionsInterface<T>;
//   display?: DisplayInterface;
//   sort?: boolean | SortInterface;
//   pagination?: InfiniteLoaderProps;
//   sortBy?: SortInterface['by'];
//   sortCaseInsensitive?: SortInterface['caseInsensitive'];
//   sortDesc?: SortInterface['descending'];
//   sortGroupBy?: GroupInterface['sortBy'];
//   sortGroupDesc?: GroupInterface['sortDescending'];
//   showGroupSeparatorAtTheBottom?: GroupInterface['separatorAtTheBottom'];
//   groupReversed?: GroupInterface['reversed'];
//   groupSeparator?: GroupInterface['separator'];
//   groupBy?: GroupInterface['by'];
//   groupOf?: GroupInterface['limit'];
//   displayRow?: DisplayHandlerProps['displayRow'];
//   rowGap?: DisplayHandlerProps['rowGap'];
//   displayGrid?: DisplayHandlerProps['displayGrid'];
//   gridGap?: DisplayHandlerProps['gridGap'];
//   minColumnWidth?: DisplayHandlerProps['minColumnWidth'];
//   filterBy?: string | ((item: T, idx: number) => boolean);
//   searchTerm?: SearchOptionsInterface<T>['term'];
//   searchBy?: SearchOptionsInterface<T>['by'];
//   searchOnEveryWord?: SearchOptionsInterface<T>['everyWord'];
//   searchCaseInsensitive?: SearchOptionsInterface<T>['caseInsensitive'];
//   hasMoreItems?: InfiniteLoaderProps['hasMore'];
//   loadMoreItems?: null | InfiniteLoaderProps['loadMore'];
//   paginationLoadingIndicator?: InfiniteLoaderProps['loadingIndicator'];
//   paginationLoadingIndicatorPosition?: InfiniteLoaderProps['loadingIndicatorPosition'];
// }
export interface Album {
  videos: number;
  date: number;
  id: string;
  thumbnail: string;
  title: string;
}

export interface GalleryContextInterface {
  currentAlbum: Album | null;
  setCurrentAlbum: Dispatch<SetStateAction<Album | null>>;
  albumPhotos: Array<string>;
  setAlbumPhotos: Dispatch<SetStateAction<Array<string>>>; //(photos: Array<string>) => void;
  albumVideos: Array<string>;
  setalbumVideos: Dispatch<SetStateAction<Array<string>>>; //(photos: Array<string>) => void;
  albumList: Array<Album>;
  resetStorageRef: () => void;
  loadFromStorage: (directory: string) => void;
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
