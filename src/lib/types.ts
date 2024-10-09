export interface searchSongResult {
  success: boolean;
  data: data;
}

export interface data {
  total: number;
  start: number;
  results: searchResults[];
}

export interface searchResults {
  id: string;
  name: string;
  artists: { primary: artists[] };
  image: downloadUrl[];
  downloadUrl: downloadUrl[];
  addedBy?: string;
  queueId?: string;
  voteCount: number;
  topVoters?: TUser[];
}
export interface downloadUrl {
  quality: string;
  url: string;
}

export interface artists {
  id: number;
  name: string;
  role: string;
  image: [];
  type: "artist";
  url: string;
}

export interface songState {
  isPaused: boolean;
}

export interface TUser {
  _id: string;
  email: string;
  name: string;
  username: string;
  imageUrl: string;
  role?: "admin" | "listener" | string;
  token?: string;
  roomId?: string;
}

export interface listener {
  totalUsers: number;
  currentPage: number;
  roomUsers: roomUsers[];
}

export interface roomUsers {
  _id: string;
  userId: TUser;
}

export interface queue {
  _id: string;
  roomId: string;
  songData: searchResults;
  playing: boolean;
}

export interface upvVotes {
  queueId: string;
}
