import { BroadcastChannel } from "broadcast-channel";

const logoutChannel = new BroadcastChannel("logout");

export const channelLogin = () => {
  logoutChannel.postMessage("Login");
  localStorage.setItem("token", "this_is_a_demo_token");
  window.location.reload();
};
export const channelLanguage = () => {
  logoutChannel.postMessage("Language Change");
  window.location.reload();
};

export const checkToken = () => {
  const token = JSON.parse(localStorage.getItem("jwtToken"));
  if (!token) return alert("You are not logged in");
  return token;
};

export const channelLogout = () => {
  logoutChannel.postMessage("Logout");
  localStorage.removeItem("token");
  window.location.href = window.location.origin + "/";
};

export const logoutAllTabs = () => {
  logoutChannel.onmessage = () => {
    channelLogout();
    logoutChannel.close();
  };
};

export const loginAllTabs = () => {
  logoutChannel.onmessage = () => {
    channelLogin();
    logoutChannel.close();
  };
};
