import React, { useState, useEffect } from "react";
import request from "../modules/request";
import axios, { Canceler, CancelToken, AxiosResponse } from "axios";
import { GalleryContextInterface, Album } from "../interface/TypeInterface";

import firebase from "firebase/app";
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
  const [currentAlbum, setCurrentAlbum] = useState<Album | null>(null);

  const [albumPhotos, setAlbumPhotos] = useState<Array<string>>([]);
  const [albumVideos, setalbumVideos] = useState<Array<string>>([]);
  const albumStorageRef = React.useRef<firebase.storage.ListResult | null>(
    null
  );
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
    if (currentAlbum) loadFromStorage(currentAlbum.id);
  }, [currentAlbum]);

  const resetStorageRef = () => {
    setAlbumPhotos([]);
    setalbumVideos([]);
    albumStorageRef.current = null;
  };

  const loadFromStorage = async (directory: string) => {
    if (albumStorageRef.current === null) {
      albumStorageRef.current = await storage
        .refFromURL(`gs://st-marys-school-d6378.appspot.com/${directory}`)
        .list({
          maxResults: 8,
        });
    } else {
      albumStorageRef.current = await storage
        .refFromURL(`gs://st-marys-school-d6378.appspot.com/${directory}`)
        .list({
          maxResults: 8,
          pageToken: albumStorageRef.current.nextPageToken,
        });
    }

    let data = albumStorageRef.current?.items.map(
      async (item: firebase.storage.Reference) => {
        let meta = item.getMetadata();
        let url = item.getDownloadURL();

        return Promise.all([meta, url]).then(([meta, url]) => {
          // console.log([meta.contentType]);
          // console.log("DDDAAATTTAAA",
          return {
            type: meta.contentType,
            url,
          };
          // );
          // return val;
        });
      }
    );
    Promise.all(data).then((d: Array<{ type: string; url: string }>) => {
      let images: Array<string> = [];
      let videos: Array<string> = [];

      d.forEach((media: { type: string; url: string }) => {
        if (media.type.indexOf("image") !== -1) {
          images.push(media.url);
        } else if (media.type.indexOf("video") !== -1) {
          images.push(media.url);
        }
      });

      // let images = d.filter((media: {type: string, url: string}) => media.type.indexOf("image") !== -1);
      // let videos = d.filter((media: {type: string, url: string}) => media.type.indexOf("video") !== -1);
      setAlbumPhotos((prev) => [...prev, ...images]);
      setAlbumPhotos((prev) => [...prev, ...videos]);
    });

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

  useEffect(() => {
    let cancel: Canceler;
    if (currentAlbum !== null) {
      setalbumVideos([]);
      let source: CancelToken = new axios.CancelToken((c) => {
        cancel = c;
      });
      const { requestPromise } = request(
        "/api/student/get-videos/" + currentAlbum.id + "/1",
        { method: "GET", cancelToken: source }
      );
      requestPromise.then((res: { data: { videos: Array<string> } }) => {
        const { videos } = res.data;
        setalbumVideos([...videos]);
      });
    }
    return () => {
      if (cancel) cancel();
    };
  }, [currentAlbum]);

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
      }}
    >
      {props.children}
    </GalleryContext.Provider>
  );
};
