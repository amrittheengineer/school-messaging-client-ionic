import axios from "axios";
import Constant from "../Constant";
const { url } = Constant;
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

/**
 * Request Wrapper with default success/error actions
 */

const request = function (apiPath: string, options: any) {
  const client = axios.create({
    baseURL: url,
    cancelToken: options.cancelToken ? options.cancelToken : source.token,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      // mode: "cors",
    },
  });
  console.log("Making request");

  return {
    requestPromise: client(Object.assign({ url: apiPath }, options)),
    cancel: () =>
      options.cancelToken ? source.cancel("Request Cancelled.") : {},
  };
};

export default request;
