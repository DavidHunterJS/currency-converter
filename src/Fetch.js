import axios from "axios";

export const GET = (query) => {
  console.log("Fetch Fired");
  return axios.get(query);
};
