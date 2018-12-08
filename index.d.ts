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
  Script: React.Component
}

export default function useSpotifyWebSdk(options:Options): HookReturnValue;
