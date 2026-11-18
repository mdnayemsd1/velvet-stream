import { queryOptions } from "@tanstack/react-query";
import { adminStatus, getVideo, listVideos } from "./videos.functions";

export const videosQuery = () => queryOptions({ queryKey: ["videos"], queryFn: () => listVideos() });

export const videoQuery = (id: string) =>
  queryOptions({ queryKey: ["videos", id], queryFn: () => getVideo({ data: { id } }) });

export const adminStatusQuery = () =>
  queryOptions({ queryKey: ["admin-status"], queryFn: () => adminStatus(), staleTime: 0 });
