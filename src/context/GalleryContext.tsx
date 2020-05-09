import React, { useState, useEffect, useRef } from "react";
import request from "../modules/request";
import { isPlatform, getPlatforms } from '@ionic/react'
import axios, { Canceler, CancelToken, AxiosResponse } from "axios";
import {
  GalleryContextInterface,
  Album,
  Video,
  Photo
} from "../interface/TypeInterface";
import { storage } from '../modules/firebase';
import { Plugins, FilesystemDirectory } from '@capacitor/core';
import "firebase/storage";



const { Filesystem } = Plugins;

export const GalleryContext = React.createContext<GalleryContextInterface | null>(
  null
);
export const GalleryContextProvider = (props: { children: any }) => {
  const [currentAlbum, setCurrentAlbum] = useState<string>("");
  const currentAlbumName = useRef<string>("");
  const [contentLoading, setContentLoading] = useState<boolean>(false);
  const [hasMoreItems, setHasMoreItems] = useState<boolean>(true);

  const [albumPhotos, setAlbumPhotos] = useState<Array<Photo>>([]);
  const [albumVideos, setalbumVideos] = useState<Array<Video>>([]);
  const albumStorageRef = React.useRef<string>("");

  useEffect(() => {
    if (currentAlbum) {
      currentAlbumName.current = albumList.find(album => album.id === currentAlbum)?.title || "Gallery";
      loadFromStorage(currentAlbum);
    }
  }, [currentAlbum]);

  const resetStorageRef = () => {
    setAlbumPhotos([]);
    setalbumVideos([]);
    setHasMoreItems(true);
    albumStorageRef.current = "";
  };

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
          if (this.status == 200) {
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

  const loadFromStorage = async (directory: string) => {
    console.log("Called");
    let data: firebase.storage.ListResult;
    if (contentLoading) {
      console.log("Rejected Call");

      return;
    }
    setContentLoading(true);
    if (albumStorageRef.current === "") {
      data = await storage
        .refFromURL(`gs://st-marys-school-d6378.appspot.com/${directory}/thumbs`)
        .list({
          maxResults: 8,
        });
    } else {
      console.log("[LOG] albumStorageRef ", albumStorageRef.current);
      data = await storage
        .refFromURL(`gs://st-marys-school-d6378.appspot.com/${directory}`)
        .list({
          maxResults: 8,
          pageToken: albumStorageRef.current,
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
          timeStamp: meta.timeCreated,
        };
        // return Promise.all([meta, url]).then(([meta, url]) => {
        //   // console.log(url);
        //   // console.log("DDDAAATTTAAA",
        //   // );
        //   // return val;
        // });
      }
    );
    Promise.all(dataFetchPromises).then(
      (
        d: Array<{ type: string; url: string; name: string; timeStamp: string }>
      ) => {
        let images: Array<Photo> = [];
        let videos: Array<Video> = [];

        d.forEach(
          (media: {
            type: string;
            url: string;
            name: string;
            timeStamp: string;
          }) => {
            if (media.type.indexOf("image") !== -1) {
              images.push({ url: media.url, name: media.name, type: media.type });
            } else if (media.type.indexOf("video") !== -1) {
              console.log("[LOG] Video", media.name);
              videos.push({
                url: media.url,
                name: media.name,
                timeStamp: media.timeStamp,
                type: media.type
              });
            }
          }
        );

        setContentLoading(false);

        if (data.nextPageToken === undefined) {
          setHasMoreItems(false);
        } else {
          albumStorageRef.current = data.nextPageToken!;
        }

        // let images = d.filter((media: {type: string, url: string}) => media.type.indexOf("image") !== -1);
        // let videos = d.filter((media: {type: string, url: string}) => media.type.indexOf("video") !== -1);
        setAlbumPhotos((prev) => [...prev, ...images]);
        setalbumVideos((prev) => {
          console.log("[LOG] Video ", videos);

          return [...prev, ...videos];
        });
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

  useEffect(() => {
    console.log("Content loading ", contentLoading);
  }, [contentLoading]);

  const [albumList, setAlbumList] = useState<Array<Album>>([]);
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
        // setAlbumList();
        setAlbumList([...res.data.data]);
      })
      .catch((err) => console.error(err));

    return () => {
      if (cancel) cancel();
    };
  }, []);

  // useEffect(() => {
  // let cancel: Canceler;
  // if (currentAlbum !== null) {
  //   setalbumVideos([]);
  //   let source: CancelToken = new axios.CancelToken((c) => {
  //     cancel = c;
  //   });
  //   const { requestPromise } = request(
  //     "/api/student/get-videos/" + currentAlbum.id + "/1",
  //     { method: "GET", cancelToken: source }
  //   );
  //   requestPromise.then((res: { data: { videos: Array<string> } }) => {
  //     const { videos } = res.data;
  //     setalbumVideos([...videos]);
  //   });
  // }
  // return () => {
  //   if (cancel) cancel();
  // };
  // }, [currentAlbum]);

  return (
    <GalleryContext.Provider
      value={{
        currentAlbum,
        setCurrentAlbum,
        albumPhotos,
        setAlbumPhotos,
        albumVideos,
        setalbumVideos,
        albumList,
        resetStorageRef,
        loadFromStorage,
        contentLoading,
        hasMoreItems,
        downloadFile
      }}
    >
      {props.children}
    </GalleryContext.Provider>
  );
};
