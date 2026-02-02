import type { AnnouncementResponse } from "../interfaces/announcement/AnnouncementResponse";
import api from "./api";

const ANNOUNCEMENTS = "announcement";

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
