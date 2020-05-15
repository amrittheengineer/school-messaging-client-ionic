import React, { createContext, useState, useEffect } from "react";
import axios, { Canceler, AxiosResponse, Cancel, CancelToken } from "axios";
import request from "../modules/request";
import {
  ClassAnnouncement,
  GlobalStateContextInterface,
  Announcement,
  User,
} from "../interface/TypeInterface";
import { Storage } from "@capacitor/core";

export const GlobalStateContext = createContext<GlobalStateContextInterface | null>(
  null
);

export const GlobalStateContextProvider = (props: { children: any }) => {
  const [announcements, setAnnouncements] = useState<Array<Announcement>>([]);
  const [hasMoreAnnouncements, setHasMoreAnnouncements] = useState<boolean>(true);
  const [announcementsLoading, setAnnouncementsLoading] = useState<boolean>(false);
  const [hideTabBar, setHideTabBar] = useState<boolean>(false);
  const [classAnnouncements, setClassAnnouncements] = useState<
    Array<ClassAnnouncement>
  >([]);
  const [hasMoreClassAnnouncements, setHasMoreClassAnnouncements] = useState<boolean>(true);
  const [classAnnouncementsLoading, setClassAnnouncementsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const updateUser = () => {
    Storage.get({ key: "batchId" }).then(batchId => {
      console.log(batchId.value);

      setUser({ batchId: batchId.value });
    }).catch((err) => {
      console.log(err);
    })
  }

  const [currentPost, setCurrentPost] = useState<Array<string>>([]);

  useEffect(updateUser, []);

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
          console.log(data);
          setAnnouncements((prev) => data);
        })
        .catch((err) => console.log(err))
        .finally(() => {
          if (callback) callback();
        });
    }
  };

  const loadMoreAnnouncements = (source?: CancelToken) => {
    if (announcementsLoading || !hasMoreAnnouncements) {
      return;
    }
    setAnnouncementsLoading(true);
    const timeStamp: number = announcements.length ? announcements[announcements.length - 1].timeStamp : Date.now();

    const { requestPromise } = request(
      "/api/student/announcements/" + timeStamp,
      { method: "GET", cancelToken: source }
    );

    requestPromise
      .then((res) => {
        const { data } = res.data;
        if (!data.length) {
          setHasMoreAnnouncements(false);
        } else {
          setAnnouncements(prev => [...prev, ...data]);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setAnnouncementsLoading(false);
      })
  }
  const loadMoreClassAnnouncements = (source?: CancelToken) => {
    if (classAnnouncementsLoading || !hasMoreClassAnnouncements) {
      return;
    }
    setClassAnnouncementsLoading(true);
    const timeStamp: number = classAnnouncements.length ? classAnnouncements[classAnnouncements.length - 1].timeStamp : Date.now();

    const { requestPromise } = request(
      `/api/student/class-announcements/${user!.batchId}/${timeStamp}`,
      { method: "GET", cancelToken: source }
    );
    requestPromise
      .then((res: AxiosResponse<Array<ClassAnnouncement>>) => {
        const data = res.data;
        if (!data.length) {
          setHasMoreClassAnnouncements(false);
        } else {
          setClassAnnouncements(prev => [
            ...prev, ...data.sort((next, current) => current.timeStamp - next.timeStamp),
          ]);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setClassAnnouncementsLoading(false);
      })
  }

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

  const resetAnnouncements = () => {
    setAnnouncements(prev => []);
    setHasMoreAnnouncements(true);
    setAnnouncementsLoading(false);
  }
  const resetClassAnnouncements = () => {
    setClassAnnouncements(prev => []);
    setHasMoreClassAnnouncements(true);
    setClassAnnouncementsLoading(false);
  }


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

      loadMoreAnnouncements(source2);

      loadMoreClassAnnouncements(source1);


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
        currentPost,
        setCurrentPost,
        updateUser,
        announcementsLoading,
        hasMoreAnnouncements,
        loadMoreAnnouncements,
        resetAnnouncements,
        resetClassAnnouncements,
        hasMoreClassAnnouncements,
        loadMoreClassAnnouncements,
        classAnnouncementsLoading
      }}
    >
      {props.children}
    </GlobalStateContext.Provider>
  );
};
// export GlobalStateContextProvider;
