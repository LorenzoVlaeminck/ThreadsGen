export interface Post {
  content: string;
  hashtags: string[];
  imagePrompt: string;
}

export interface GeneratedResponse {
  posts: Post[];
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
