import api from "./axios";
import toast from "react-hot-toast";

const handleError = (error) => {
  const message =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    "Something went wrong";

  toast.error(message);
  return null;
};

// CREATE ROOM
export const createRoomAPI = async (data) => {
  try {
    const res = await api.post(`/rooms/create`, data);
    toast.success("Room created successfully!");
    return res.data;
  } catch (error) {
    return handleError(error);
  }
};

// GET ALL ROOMS OF USER
export const getRoomsAPI = async (email) => {
  try {
    const res = await api.get(`/rooms/list?email=${email}`);
    // console.log(res);
    return res.data;
  } catch (error) {
    return handleError(error);
  }
};

// RENAME ROOM
export const renameRoomAPI = async (roomId, newName) => {
  try {
    const res = await api.patch(`/rooms/${roomId}`, { newName });
    toast.success("Room renamed");
    return res.data;
  } catch (error) {
    return handleError(error);
  }
};

// DELETE ROOM
export const deleteRoomAPI = async (roomId) => {
  try {
    const res = await api.delete(`/rooms/${roomId}`);
    toast.success("Room deleted");
    return res.data;
  } catch (error) {
    return handleError(error);
  }
};