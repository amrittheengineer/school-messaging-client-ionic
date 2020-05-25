import React, { useState, useEffect, useRef } from "react";
import request from "../modules/request";
import { isPlatform } from '@ionic/react';
import axios, { Canceler, CancelToken, AxiosResponse } from "axios";
import {
  GalleryContextInterface,
  Album,
  Video,
  Photo
} from "../interface/TypeInterface";
import { storage } from '../modules/firebase';
import { Plugins, FilesystemDirectory, Storage } from '@capacitor/core';
import "firebase/storage";
import Constant from "../Constant";

const { Filesystem } = Plugins;

export const GalleryContext = React.createContext<GalleryContextInterface | null>(
  null
);
export const GalleryContextProvider = (props: { children: any }) => {
  const [currentAlbum, setCurrentAlbum] = useState<string>("");
  const currentAlbumName = useRef<string>("");
  const [contentPhotosLoading, setContentPhotosLoading] = useState<boolean>(false);
  const [hasMorePhotos, setHasMorePhotos] = useState<boolean>(true);
  const [contentVideosLoading, setContentVideosLoading] = useState<boolean>(false);
  const [hasMoreVideos, setHasMoreVideos] = useState<boolean>(true);

  const [albumPhotos, setAlbumPhotos] = useState<Array<Photo>>([]);
  const [albumVideos, setAlbumVideos] = useState<Array<Video>>([]);
  const imagesPageToken = React.useRef<string>("");
  const videosPageToken = React.useRef<string>("");

  useEffect(() => {
    if (currentAlbum) {
      currentAlbumName.current = albumList.find(album => album.id === currentAlbum)?.title || "Gallery";
      loadImageFromStorage(currentAlbum);
      loadVideoFromStorage(currentAlbum);
    }
  }, [currentAlbum]);

  // const downloadFileOld = (url: string, name: string) => {
  //   let f: FileTransferObject = FileTransfer.create();
  //   return new Promise((resolve, reject) => {
  //     f.download(url, "School App/" + currentAlbum + "/" + name, true).then(entry => {
  //       alert(entry.toURL());
  //       resolve(entry);
  //     }).catch(err => {
  //       alert(err.message);
  //       reject(err);
  //     })
  //   })
  // }

  const downloadFile = (url: string, name: string, type: string) => {
    return new Promise((resolve, reject) => {
      if (isPlatform("capacitor") || isPlatform("cordova")) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.onload = function () {
          if (this.status === 200) {
            var blob = new Blob([this.response], { type });
            var reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = function () {
              var base64data = reader.result;
              Filesystem.writeFile({
                data: base64data?.toString() || "",
                path: `School App/${currentAlbumName.current || "Posts"}/${name}`,
                directory: FilesystemDirectory.Documents,
                recursive: true
              }).then(c => {
                resolve(c);
              }).catch(err => {
                reject(err);

              })
            }
          }
        };
        xhr.send();
      } else {
        fetch(url).then(function (t) {
          return t.blob().then((b) => {
            var a = document.createElement("a");
            a.href = URL.createObjectURL(b);
            a.setAttribute("download", name);
            a.click();
            resolve();
          }
          ).catch(err => {
            reject(err);
          })
        });
      }
    })
  }



  const resetStorageRef = () => {
    setAlbumPhotos([]);
    setAlbumVideos([]);
    setHasMorePhotos(true);
    setHasMoreVideos(true);
    imagesPageToken.current = "";
  };

  const loadVideoFromStorage = async (directory: string) => {
    console.log("Called");
    let data: firebase.storage.ListResult;
    if (contentVideosLoading) {
      console.log("Rejected Call");

      return;
    }
    setContentVideosLoading(true);
    if (videosPageToken.current === "") {
      data = await storage
        .refFromURL(`gs://st-marys-school-d6378.appspot.com/${directory}/videos`)
        .list({
          maxResults: 8,
        });
    } else {
      console.log("[LOG] videosPageToken ", videosPageToken.current);
      data = await storage
        .refFromURL(`gs://st-marys-school-d6378.appspot.com/${directory}/videos`)
        .list({
          maxResults: 8,
          pageToken: videosPageToken.current,
        });
    }

    let dataFetchPromises = data.items.map(
      async (item: firebase.storage.Reference) => {
        let meta = await item.getMetadata();
        let url = await item.getDownloadURL();
        return {
          type: meta.contentType,
          url,
          name: meta.name,
          timeStamp: meta.timeCreated
        };
      }
    );
    Promise.all(dataFetchPromises).then(
      (
        d: Array<{ type: string; url: string; name: string; timeStamp: string }>
      ) => {
        let videos: Array<Video> = [];

        d.forEach(
          (media: {
            type: string;
            url: string;
            name: string;
            timeStamp: string;
          }) => {
            if (media.type.indexOf("video") !== -1) {
              videos.push({ url: media.url, name: media.name, type: media.type, timeStamp: media.timeStamp });
            }
          }
        );
        setAlbumVideos((prev) => [...prev, ...videos]);
        if (data.nextPageToken === undefined) {
          setHasMoreVideos(false);
        } else {
          videosPageToken.current = data.nextPageToken!;
        }
        setContentVideosLoading(false);
        // let images = d.filter((media: {type: string, url: string}) => media.type.indexOf("image") !== -1);
        // let videos = d.filter((media: {type: string, url: string}) => media.type.indexOf("video") !== -1);
      }
    );

    // .then((list) => {
    //       // alert(list.items.map((d) => d.getDownloadURL()));
    //       list.items.forEach((item) => {
    //         // console.log(item);
    //         item.getMetadata().then((file) => {
    //           console.log(file.name);
    //         });
    //       });
    //     })
  };
  const loadImageFromStorage = async (directory: string) => {
    console.log("Called");
    let data: firebase.storage.ListResult;
    if (contentPhotosLoading) {
      console.log("Rejected Call");
      return;
    }
    setContentPhotosLoading(true);
    if (imagesPageToken.current === "") {
      data = await storage
        .refFromURL(`gs://st-marys-school-d6378.appspot.com/${directory}/images`)
        .list({
          maxResults: 8,
        });
    } else {
      console.log("[LOG] imagesPageToken ", imagesPageToken.current);
      data = await storage
        .refFromURL(`gs://st-marys-school-d6378.appspot.com/${directory}/images`)
        .list({
          maxResults: 8,
          pageToken: imagesPageToken.current,
        });
    }

    let dataFetchPromises = data.items.map(
      async (item: firebase.storage.Reference) => {
        let meta = await item.getMetadata();
        let url = await item.getDownloadURL();
        return {
          type: meta.contentType,
          url,
          name: meta.name,
        };
      }
    );
    Promise.all(dataFetchPromises).then(
      (
        d: Array<{ type: string; url: string; name: string; }>
      ) => {
        let images: Array<Photo> = [];

        d.forEach(
          (media: {
            type: string;
            url: string;
            name: string;
          }) => {
            if (media.type.indexOf("image") !== -1) {
              images.push({ url: media.url, name: media.name, type: media.type });
            }
          }
        );
        // let images = d.filter((media: {type: string, url: string}) => media.type.indexOf("image") !== -1);
        // let videos = d.filter((media: {type: string, url: string}) => media.type.indexOf("video") !== -1);
        setAlbumPhotos((prev) => [...prev, ...images]);
        if (data.nextPageToken === undefined) {
          setHasMorePhotos(false);
        } else {
          imagesPageToken.current = data.nextPageToken!;
        }
        setContentPhotosLoading(false);

      }
    );
  };

  useEffect(() => {
    console.log("Content loading ", contentPhotosLoading);
  }, [contentPhotosLoading]);

  const [albumList, setAlbumList] = useState<Array<Album>>([]);

  useEffect(() => {
    if (!albumList.length) {
      Storage.get({ key: Constant.galleryTempListKey }).then(({ value }) => {
        if (value) {
          const items = JSON.parse(value);
          if (items.length) {
            setAlbumList(items);
          }
        }
      })
    }
  }, [albumList])

  useEffect(() => {
    let cancel: Canceler;
    let source: CancelToken = new axios.CancelToken((c) => {
      cancel = c;
    });

    const { requestPromise } = request("/api/student/albums", {
      method: "GET",
      cancelToken: source,
    });

    requestPromise
      .then((res: AxiosResponse<{ data: Array<Album> }>) => {
        const result = [...res.data.data];
        setAlbumList(result);
        if (result.length) {

          Storage.set({ key: Constant.galleryTempListKey, value: JSON.stringify(result) })
        }
      })
      .catch((err) => console.error(err));

    return () => {
      if (cancel) cancel();
    };
  }, []);

  return (
    <GalleryContext.Provider
      value={{
        currentAlbum,
        setCurrentAlbum,
        albumPhotos,
        setAlbumPhotos,
        albumVideos,
        setAlbumVideos,
        albumList,
        loadImageFromStorage,
        contentPhotosLoading,
        contentVideosLoading,
        hasMorePhotos,
        hasMoreVideos,
        downloadFile,
        loadVideoFromStorage,
        resetStorageRef
      }}
    >
      {props.children}
    </GalleryContext.Provider>
  );
};
