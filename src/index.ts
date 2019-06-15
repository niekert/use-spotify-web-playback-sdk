import * as React from 'react';

const noop = () => {};

interface Options {
  name: string;
  getOAuthToken: () => Promise<string>;
  accountError?: (e: unknown) => void;
  onReady?: (deviceId: string) => void;
  onPlayerStateChanged?: Spotify.PlaybackStateListener;
}

declare global {
  interface Window {
    Spotify: typeof Spotify;
  }
}

export function useSpotifyWebPlaybackSdk({
  name,
  getOAuthToken,
  accountError = noop,
  onReady = noop,
  onPlayerStateChanged = noop,
}: Options) {
  const [isReady, setIsReady] = React.useState(false);
  const [deviceId, setDeviceId] = React.useState<string>('');
  const playerRef = React.useRef<Spotify.SpotifyPlayer | null>(null);

  React.useEffect(() => {
    if (window.Spotify) {
      playerRef.current = new Spotify.Player({
        name,
        getOAuthToken: async cb => {
          const token = await getOAuthToken();
          cb(token);
        },
      });
      setIsReady(true);
    }

    (window as any).onSpotifyWebPlaybackSDKReady = () => {
      playerRef.current = new Spotify.Player({
        name,
        getOAuthToken: async cb => {
          const token = await getOAuthToken();
          cb(token);
        },
      });
      setIsReady(true);
    };

    if (!window.Spotify) {
      const scriptTag = document.createElement('script');
      scriptTag.src = 'https://sdk.scdn.co/spotify-player.js';

      document.head!.appendChild(scriptTag);
    }
  }, []);

  const handleReady = React.useCallback(({ device_id: readyDeviceId }) => {
    setDeviceId(readyDeviceId);

    if (onReady) {
      onReady(deviceId);
    }
  }, []);

  React.useEffect(() => {
    if (isReady) {
      playerRef.current!.connect();
    }
  }, [isReady]);

  React.useEffect(() => {
    const player = playerRef.current!;
    if (isReady) {
      player.addListener('account_error', accountError);
      player.addListener('ready', handleReady);
      player.addListener('initialization_error', accountError);
      player.addListener('authentication_error', accountError);
      player.addListener('not_ready', accountError);
      player.addListener('player_state_changed', onPlayerStateChanged);

      return () => {
        player.removeListener('account_error', accountError);
        player.removeListener('ready', handleReady);
        player.removeListener('player_state_changed', onPlayerStateChanged);
      };
    }

    return;
  }, [isReady, onPlayerStateChanged]);

  return {
    player: playerRef.current,
    deviceId,
    isReady,
  };
}
