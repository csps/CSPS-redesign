import type { AnnouncementResponse } from "../interfaces/announcement/AnnouncementResponse";
import api from "./api";

const ANNOUNCEMENTS = "announcement";

/**
 * Create a new announcement.
 * Endpoint: POST /api/announcement/add
 */
export const createAnnouncement = async (data: {
  title: string;
  content: string;
}): Promise<AnnouncementResponse> => {
  try {
    const response = await api.post<{ data: AnnouncementResponse }>(
      `${ANNOUNCEMENTS}/add`,
      data,
    );
    return response.data.data;
  } catch (err) {
    console.error("Error creating announcement:", err);
    throw err;
  }
};

/**
 * Get all announcements.
 * Endpoint: GET /api/announcement/all
 */
export const getAllAnnouncements = async (): Promise<
  AnnouncementResponse[]
> => {
  try {
    const response = await api.get<{ data: AnnouncementResponse[] }>(
      `${ANNOUNCEMENTS}/all`,
    );
    return response.data.data;
  } catch (err) {
    console.error("Error fetching announcements:", err);
    throw err;
  }
};
