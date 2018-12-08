import React from "react";
import { Script } from "the-platform";

const noop = () => {};

export function useSpotifyWebSdk({
  name,
  getOAuthToken,
  onAccountError = noop,
  onNotReady = noop,
  onAuthError = noop,
  onReady = noop,
  onPlayerStateChanged = noop,
}) {
  const [isReady, setIsReady] = React.useState(false);
  const [deviceId, setDeviceId] = React.useState(null);
  const playerRef = React.useRef(null);

  React.useEffect(() => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      playerRef.current = new Spotify.Player({
        name,
        getOAuthToken: async cb => {
          const token = await getOAuthToken();
          cb(token);
        },
      });

      setIsReady(true);
    };
  }, []);

  const handleReady = React.useCallback(({ device_id: readyDeviceId }) => {
    setDeviceId(readyDeviceId);

    if (onReady) {
      onReady(deviceId);
    }
  }, []);

  const handleAccountError = React.useCallback(onAccountError, []);
  const handleInitializationError = React.useCallback(initializationError, []);
  const handleAuthError = React.useCallback(onAuthError, []);
  const handleNotReady = React.useCallback(onNotReady, []);
  const handlePlayerStateChange = React.useCallback(onPlayerStateChanged, []);

  const connect = React.useCallback(() => {
    player.connect();
  }, []);

  React.useEffect(
    () => {
      const player = playerRef.current;

      if (isReady) {
        player.addListener("account_error", handleAccountError);
        player.addListener("ready", handleReady);
        player.addListener("initialization_error", handleInitializationError);
        player.addListener("authentication_error", handleAuthError);
        player.addListener("not_ready", handleNotReady);
        player.addListener("player_state_changed", handlePlayerStateChange);

        return () => {
          player.removeEventListener("ready", handleReady);
          player.removeEventListener(
            "initialization_error",
            handleInitializationError,
          );
          player.removeEventListener("authentication_error", handleAuthError);
          player.removeEventListener("not_ready", handleNotReady);
          player.removeEventListener(
            "player_state_changed",
            handlePlayerStateChange,
          );
        };
      }

      return;
    },
    [isReady],
  );

  return {
    isReady,
    deviceId,
    connect,
    Script: props => (
      <Script src="https://sdk.scdn.co/spotify-player.js" {...props} />
    ),
  };
}

export default useSpotifyWebSdk;
