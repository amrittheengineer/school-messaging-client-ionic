import { SetStateAction, Dispatch } from "react";
import { CancelToken } from "axios";

export interface GlobalStateContextInterface {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>; //(user: User) => void;
  // setClassAnnouncements: Dispatch<SetStateAction<Array<ClassAnnouncement>>>; //(user: Array<ClassAnnouncement>) => void;
  classAnnouncements: Array<ClassAnnouncement>;
  // updateClassAnnouncements: (callback: () => void) => void;
  announcements: Array<Announcement>;
  // updateAnnouncements: (callback: () => void) => void;
  hideTabBar: boolean;
  setHideTabBar: Dispatch<SetStateAction<boolean>>;
  loadResourceURL: (url: string) => Promise<any>;
  currentPost: Array<string>;
  setCurrentPost: Dispatch<SetStateAction<Array<string>>>;
  updateUser: () => void;
  hasMoreAnnouncements: boolean;
  announcementsLoading: boolean;
  loadMoreAnnouncements: (cancel?: CancelToken) => void;
  refreshAnnouncements: () => void;
  classAnnouncementsLoading: boolean;
  loadMoreClassAnnouncements: (cancel?: CancelToken) => void;
  refreshClassAnnouncements: () => void;
  hasMoreClassAnnouncements: boolean;
  connectionStatus: boolean;
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

export interface Video {
  url: string;
  name: string;
  timeStamp: string;
  type: string;
}
export interface UserDataRef {
  user_exists: boolean,
  name: string,
  batchId: string,
  phone: string
}

export interface SignUpContextWebInterface {
  setSignInCallBack: (callback: () => void) => void;
  sendOtpWeb: (phone: string) => Promise<any>;
  verifyOtpWeb: (otp: string) => Promise<any>;
  updateUserData: (data: { user_exists: boolean, name?: string, batchId: string, phone: string }) => Promise<any>;
}
export interface SignUpContextInterface {
  setDataRef: (data: UserDataRef) => void;
  setSignInCallBack: (callback: () => void) => void;
  sendOtpCapacitor: (phone: string) => Promise<any>;
  verifyOtpCapacitor: (otp: string) => Promise<any>;
  setClassId: (id: string) => void;
  updateUserData: (data: { user_exists: boolean, name?: string, batchId: string, phone: string }) => Promise<any>;
}
export interface Photo {
  url: string;
  name: string;
  type: string;
}
export interface Album {
  videos: number;
  date: number;
  id: string;
  thumbnail: string;
  title: string;
}

export interface GalleryContextInterface {
  currentAlbum: string;
  setCurrentAlbum: Dispatch<SetStateAction<string>>;
  albumPhotos: Array<Photo>;
  setAlbumPhotos: Dispatch<SetStateAction<Array<Photo>>>; //(photos: Array<string>) => void;
  albumVideos: Array<Video>;
  setAlbumVideos: Dispatch<SetStateAction<Array<Video>>>; //(photos: Array<string>) => void;
  albumList: Array<Album>;
  resetStorageRef: () => void;
  loadImageFromStorage: (directory: string) => void;
  loadVideoFromStorage: (directory: string) => void;
  contentPhotosLoading: boolean;
  contentVideosLoading: boolean;
  hasMorePhotos: boolean;
  hasMoreVideos: boolean;
  downloadFile: (url: string, name: string, type: string) => Promise<any>;
}

export interface User {
  // name: string;
  // phone: string;
  batchId: string;
}

export interface ClassAnnouncement extends Broadcast {
  subject: string;
}
export interface Announcement extends Broadcast {
  photos?: Array<string>;
  url?: Array<string>;
}
export interface URLObject {
  thumbnail: string;
  url: string;
  title?: string;
}

export interface Broadcast {
  message: string;
  timeStamp: number;
  id: string;
}
