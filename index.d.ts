interface Options {
  name: string;
  getOAuthToken: () => Promise<string>;
  accountError?: (e: any) => void;
  onReady?: (deviceId: string) => void;
  onPlayerStateChanged?: (state: any) => void;
}

interface HookReturnValue {
  isReady:boolean,
  deviceId: string| null,
  connect: () =>  Promise<Boolean>,
  player: Spotify.SpotifyPlayer | null,
  Script: React.FunctionComponent<{ children: React.ReactNode}>
}

export default function useSpotifyWebSdk(options:Options): HookReturnValue;
