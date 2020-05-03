import React, { createContext, useState, useEffect } from "react";
import axios, { Canceler, AxiosResponse } from "axios";
import request from "../modules/request";
import {
  ClassAnnouncement,
  GlobalStateContextInterface,
  Announcement,
  User,
} from "../interface/TypeInterface";

export const GlobalStateContext = createContext<GlobalStateContextInterface | null>(
  null
);

export const GlobalStateContextProvider = (props: { children: any }) => {
  const [announcements, setAnnouncements] = useState<Array<Announcement>>([]);
  const [hideTabBar, setHideTabBar] = useState<boolean>(false);
  const [classAnnouncements, setClassAnnouncements] = useState<
    Array<ClassAnnouncement>
  >([]);
  const [user, setUser] = useState<User | null>({
    name: "Amrit",
    phone: "6385141855",
    batchId: "03ee1740-7b40-11ea-881d-4f34ce240b83",
  });

  const [currentPost, setCurrentPost] = useState<Array<string>>([]);


  const updateAnnouncements = (callback: () => void) => {
    if (user && user.batchId) {
      setAnnouncements((prev) => []);
      console.log("Updating Announcements state");
      const { requestPromise } = request(
        "/api/student/announcements/" + Date.now(),
        { method: "GET" }
      );
      requestPromise
        .then((res) => {
          const { data } = res.data;
          // console.log(data.data);
          setAnnouncements((prev) => data);
        })
        .catch((err) => console.log(err))
        .finally(() => {
          if (callback) callback();
        });
    }
  };

  const loadResourceURL = (url: string) => {
    return new Promise((resolve, reject) => {
      fetch(
        'https://cors-bypasss.herokuapp.com/http://bbblogin-ftw.herokuapp.com/get-url?link=' + url,
        { method: 'GET', mode: 'cors', headers: { 'Origin': '', 'X-Requested-With': '' } },
      )
        .then(res => res.json())
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          reject(err);
        });
    })
  }
  const updateClassAnnouncements = (callback: () => void) => {
    if (user && user.batchId) {
      setClassAnnouncements((prev) => []);
      console.log("Updating Class announcements state");
      const { requestPromise } = request(
        "/api/student/class-announcements/" + user.batchId,
        { method: "GET" }
      );

      requestPromise
        .then((res) => {
          const data = res.data;
          console.log(data.length);
          setClassAnnouncements((prev) => data);
        })
        .catch((err) => console.log(err))
        .finally(() => {
          if (callback) callback();
        });
    }
  };

  // setInterval(() => {
  //   setClassAnnouncements((prev) => [...prev, ...prev]);
  // }, 10000);

  useEffect(() => {
    let cancel1: Canceler, cancel2: Canceler;
    if (user && user.batchId) {
      console.log("Changed Class announcements state");
      let source1 = new axios.CancelToken((c) => {
        cancel1 = c;
      });
      let source2 = new axios.CancelToken((c) => {
        cancel2 = c;
      });
      const requestPromise1 = request(
        "/api/student/class-announcements/" + user.batchId,
        { method: "GET", cancelToken: source1 }
      ).requestPromise;
      const requestPromise2 = request(
        "/api/student/announcements/" + Date.now(),
        { method: "GET", cancelToken: source2 }
      ).requestPromise;

      requestPromise1
        .then((res: AxiosResponse<Array<ClassAnnouncement>>) => {
          const data = res.data;
          setClassAnnouncements([
            ...data.sort((next, current) => current.timeStamp - next.timeStamp),
          ]);
        })
        .catch((err) => console.log(err));

      requestPromise2
        .then((res) => {
          const { data } = res.data;
          console.log(data);

          setAnnouncements([...data]);
        })
        .catch((err) => console.log(err));
    }
    return () => {
      if (cancel1) cancel1();
      if (cancel2) cancel2();
    };
  }, [user]);
  // useEffect(() => {
  //   firebase.auth().onAuthStateChanged(fuser => {
  //     if (fuser) {
  //       console.log(fuser);
  //       setUser(fuser);

  //       // Stop the login flow / Navigate to next page
  //       // Stack navigate to next screen
  //     }
  //   });
  // }, []);

  return (
    <GlobalStateContext.Provider
      value={{
        user,
        setUser,
        classAnnouncements,
        updateClassAnnouncements,
        announcements,
        updateAnnouncements,
        setClassAnnouncements,
        hideTabBar,
        setHideTabBar,
        loadResourceURL,
        currentPost, setCurrentPost
      }}
    >
      {props.children}
    </GlobalStateContext.Provider>
  );
};
// export GlobalStateContextProvider;
