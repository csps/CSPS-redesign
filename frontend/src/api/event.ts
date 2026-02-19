import type {
  EventRequest,
  EventUpdateRequest,
} from "../interfaces/event/EventRequest";
import type { EventResponse } from "../interfaces/event/EventResponse";
import type { PaginatedResponse } from "../interfaces/paginated";
import api from "./api";

const EVENTS = "event";

/**
 * Get all events.
 * Endpoint: GET /api/event/all
 */
export const getAllEvents = async (): Promise<EventResponse[]> => {
  try {
    const response = await api.get<{ data: EventResponse[] }>(`${EVENTS}/all`);
    return response.data.data;
  } catch (err: any) {
    if (err.response?.status === 404) {
      return [];
    }
    console.error("Error fetching all events:", err);
    throw err;
  }
};

/**
 * Get event by ID.
 * Endpoint: GET /api/event/{id}
 */
export const getEventById = async (id: number): Promise<EventResponse> => {
  try {
    const response = await api.get<{ data: EventResponse }>(`${EVENTS}/${id}`);
    // handle both wrapped and unwrapped responses
    const raw = response.data as any;
    return raw.data ? raw.data : raw;
  } catch (err) {
    console.error(`Error fetching event ${id}:`, err);
    throw err;
  }
};

/**
 * Get events by date.
 * Endpoint: GET /api/event?eventDate={date}
 */
export const getEventsByDate = async (
  eventDate: string,
): Promise<EventResponse[]> => {
  try {
    const response = await api.get<EventResponse[]>(EVENTS, {
      params: { eventDate },
    });
    return response.data;
  } catch (err: any) {
    if (err.response?.status === 404) {
      return [];
    }
    console.error(`Error fetching events for date ${eventDate}:`, err);
    throw err;
  }
};

/**
 * Get event by S3 image key.
 * Endpoint: GET /api/event/image/{s3ImageKey}
 */
export const getEventByS3ImageKey = async (
  s3ImageKey: string,
): Promise<EventResponse> => {
  try {
    const response = await api.get<EventResponse>(
      `${EVENTS}/image/${s3ImageKey}`,
    );
    return response.data;
  } catch (err) {
    console.error(`Error fetching event with image key ${s3ImageKey}:`, err);
    throw err;
  }
};

/**
 * Create a new event.
 * Endpoint: POST /api/event/add
 */
export const createEvent = async (
  eventData: EventRequest,
  image?: File,
): Promise<EventResponse> => {
  try {
    const formData = new FormData();
    formData.append("event", JSON.stringify(eventData));
    if (image) {
      formData.append("eventImage", image);
    }

    const response = await api.post<{ data: EventResponse }>(
      `${EVENTS}/add`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    console.log(`RESPONSE: ${response}`);
    return response.data.data;
  } catch (err) {
    console.error("Error creating event:", err);

    throw err;
  }
};

/**
 * Update event (full update).
 * Endpoint: PUT /api/event/{id}
 */
export const updateEvent = async (
  id: number,
  eventData: EventRequest,
  image?: File,
): Promise<EventResponse> => {
  try {
    const formData = new FormData();
    formData.append("event", JSON.stringify(eventData));
    if (image) {
      formData.append("eventImage", image);
    }

    const response = await api.put<{ data: EventResponse }>(
      `${EVENTS}/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data.data;
  } catch (err) {
    console.error(`Error updating event ${id}:`, err);
    throw err;
  }
};

/**
 * Partially update event.
 * Endpoint: PATCH /api/event/{id}
 */
export const patchEvent = async (
  id: number,
  eventData: Partial<EventUpdateRequest>,
  image?: File,
): Promise<EventResponse> => {
  try {
    const formData = new FormData();
    formData.append("event", JSON.stringify(eventData));
    if (image) {
      formData.append("eventImage", image);
    }

    const response = await api.patch<{ data: EventResponse }>(
      `${EVENTS}/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data.data;
  } catch (err) {
    console.error(`Error patching event ${id}:`, err);
    throw err;
  }
};

/**
 * Delete event.
 * Endpoint: DELETE /api/event/{id}
 */
export const deleteEvent = async (id: number): Promise<void> => {
  try {
    await api.delete(`${EVENTS}/${id}`);
  } catch (err) {
    console.error(`Error deleting event ${id}:`, err);
    throw err;
  }
};

export const getUpcomingEvents = async (): Promise<EventResponse[]> => {
  try {
    const response = await api.get<{ data: EventResponse[] }>(
      `${EVENTS}/upcoming`,
    );

    return response.data.data;
  } catch (err: any) {
    if (err.response?.status === 404) {
      return [];
    }
    console.error("Error fetching upcoming events:", err);
    throw err;
  }
};

export const getEventByMonth = async (
  month: number,
  year: number,
): Promise<EventResponse[]> => {
  try {
    const response = await api.get<{ data: EventResponse[] }>(
      `${EVENTS}/by-month?year=${year}&month=${month}`,
    );
    return response.data.data;
  } catch (err: any) {
    if (err.response?.status === 404) {
      return [];
    }
    console.error("Error fetching events by month:", err);
    throw err;
  }
};

export const getPastEvents = async (): Promise<EventResponse[]> => {
  try {
    const response = await api.get<{ data: EventResponse[] }>(`${EVENTS}/past`);
    return response.data.data;
  } catch (err: any) {
    if (err.response?.status === 404) {
      return [];
    }
    console.error("Error fetching past events:", err);
    throw err;
  }
};

/**
 * Get student's event history (attended/registered events)
 * Endpoint: GET /api/event/my-history
 */
export const getMyEventHistory = async (
  page: number = 0,
  size: number = 5,
  sort?: string,
): Promise<PaginatedResponse<EventResponse>> => {
  try {
    const params: Record<string, string | number> = { page, size };
    if (sort) params.sort = sort;
    const response = await api.get<{ data: PaginatedResponse<EventResponse> }>(
      `${EVENTS}/my-history`,
      { params },
    );
    return response.data.data;
  } catch (err: any) {
    if (err.response?.status === 404) {
      return {
        totalPages: 0,
        totalElements: 0,
        number: 0,
        size,
        numberOfElements: 0,
        last: true,
        first: true,
        empty: true,
        content: [],
      };
    }
    console.error("Error fetching event history:", err);
    throw err;
  }
};

export default {
  getAllEvents,
  getEventById,
  getEventsByDate,
  getEventByS3ImageKey,
  createEvent,
  updateEvent,
  patchEvent,
  deleteEvent,
  getUpcomingEvents,
  getEventByMonth,
  getPastEvents,
  getMyEventHistory,
};
