import React, { useState, useEffect } from "react";
import request from "../modules/request";
import axios, { Canceler, CancelToken, AxiosResponse } from "axios";
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import {
  GalleryContextInterface,
  Album,
  Video,
  Photo
} from "../interface/TypeInterface";

import firebase from "firebase/app";
import { File } from '@ionic-native/file'

// import "firebase/firestore";
// import "firebase/auth";
import "firebase/storage";
// import { FirebaseAuthentication } from "@ionic-native/firebase-authentication";

const firebaseConfig = {
  apiKey: "AIzaSyBjWJwgkI8ABEPtmDUxJwzXrwdiQsNX1VM",
  authDomain: "st-marys-school-d6378.firebaseapp.com",
  databaseURL: "https://st-marys-school-d6378.firebaseio.com",
  projectId: "st-marys-school-d6378",
  storageBucket: "st-marys-school-d6378.appspot.com",
  messagingSenderId: "360108059082",
  appId: "1:360108059082:web:8753e636401bce4acac733",
  measurementId: "G-TGBS4PYXMD",
};

const app = firebase.initializeApp(firebaseConfig);
const storage = app.storage();



// storage
//   .refFromURL(
//     "gs://st-marys-school-d6378.appspot.com/3bb063e0-8194-11ea-a388-c5252c0215e2"
//   )
//   .listAll()
//   .then((list) => {
//     // alert(list.items.map((d) => d.getDownloadURL()));
//     list.items.forEach((item) => {
//       // console.log(item);
//       item.getMetadata().then((file) => {
//         console.log(file.name);
//       });
//     });
//   })
//   .catch((err) => {
//     console.log(err);

//     // alert(err.message);
//   });

export const GalleryContext = React.createContext<GalleryContextInterface | null>(
  null
);
export const GalleryContextProvider = (props: { children: any }) => {
  const [currentAlbum, setCurrentAlbum] = useState<string>("");
  const [contentLoading, setContentLoading] = useState<boolean>(false);
  const [hasMoreItems, setHasMoreItems] = useState<boolean>(true);

  const [albumPhotos, setAlbumPhotos] = useState<Array<Photo>>([]);
  const [albumVideos, setalbumVideos] = useState<Array<Video>>([]);
  const albumStorageRef = React.useRef<string>("");
  // useEffect(() => {
  //   let cancel: Canceler;
  //   if (currentAlbum !== null) {
  //     console.log("Changed album state");
  //     setAlbumPhotos([]);
  //     let source: CancelToken = new axios.CancelToken((c) => {
  //       cancel = c;
  //     });
  //     const { requestPromise } = request(
  //       "/api/student/get-photos/" + currentAlbum.id + "/1",
  //       { method: "GET", cancelToken: source }
  //     );

  //     requestPromise
  //       .then((res: { data: { photos: Array<string> } }) => {
  //         const { photos } = res.data;
  //         setAlbumPhotos([...photos]);
  //       })
  //       .catch((err) => console.log(err));
  //   }
  //   return () => {
  //     if (cancel) cancel();
  //   };
  // }, [currentAlbum]);

  useEffect(() => {
    if (currentAlbum) {
      // .then((val) => {
      //   console.log("Resolved", val);
      // })
      // .catch((err) => {
      //   console.log("Rejected", err);
      // });

      loadFromStorage(currentAlbum);
    }
  }, [currentAlbum]);

  const resetStorageRef = () => {
    setAlbumPhotos([]);
    setalbumVideos([]);
    setHasMoreItems(true);
    albumStorageRef.current = "";
  };

  const downloadFile = (url: string, name: string) => {
    let f: FileTransferObject = FileTransfer.create();
    return new Promise((resolve, reject) => {

      f.download(url, "School App/" + currentAlbum + "/" + name, true).then(entry => {
        alert(entry.toURL());
        resolve(entry);
      }).catch(err => {
        alert(err.message);
        reject(err);
      })
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
        .refFromURL(`gs://st-marys-school-d6378.appspot.com/${directory}`)
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
              images.push({ url: media.url, name: media.name });
            } else if (media.type.indexOf("video") !== -1) {
              console.log("[LOG] Video", media.name);
              videos.push({
                url: media.url,
                name: media.name,
                timeStamp: media.timeStamp,
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
