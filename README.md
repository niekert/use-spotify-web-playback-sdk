# `use-spotify-web-playback-sdk`

> React hook for interacting with the Spotify Web Playback SDK.

> **Note:** This is using the new [React Hooks API Proposal](https://reactjs.org/docs/hooks-intro.html)
> which is subject to change until React 16.7 final.
>
> You'll need to install `react`, `react-dom`, etc at `^16.7.0-alpha.0`

## Install

```sh
yarn add use-spotify-web-playback-sdk
```

## Usage

```js
import useSpotifyWebPlaybackSdk from "use-spotify-web-playback-sdk";

function MyComponent() {
  const {
    Script: WebPlaybackSdkScript,
    deviceId,
    connect: connectWebPlaybackSdk,
    player, // https://developer.spotify.com/documentation/web-playback-sdk/reference/#api-spotify-player
    isReady,
  } = useSpotifyWebPlaybackSdk({
    name: "My Spotify Player", // Device that shows up in the spotify devices list
    getOAuthToken: () => Promise.resolve(sessionStorage.getItem("accessToken")), // Wherever you get your access token from
    onPlayerStateChanged: (playerState) => {
      console.log('player state changed:', playerState);
    }
  });

  React.useEffect(
    () => {
      if (isReady) {
        connect();
      }
    },
    [isReady],
  );

  // value == ...
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
    <WebPlaybackSdkScript>
      <div>Any children</div>
    </WebPlaybackSdkScript>
    </React.Suspense>
  );
}
```

Also check out the [TypeScript definitions](https://github.com/niekert/use-spotify-web-playback-sdk/blob/master/index.d.ts) for all options that can be passed to the hook

## Help
Check out the [Spotify Playback SDK](https://developer.spotify.com/documentation/web-playback-sdk/reference/#api-spotify-player) docs for reference or feel free to open an issue.
