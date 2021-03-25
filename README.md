# React Rails Turbo Demo

All the benefits of turbo with all the benefits of React.

[React Rails](https://github.com/reactjs/react-rails) can't handle turbo because React Rails relies on watching for 
specific events to monitor DOM changes and identify when it needs to mount a component. I solved this using the 
[MutationObserver API](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver), the same API Stimulus and 
Turbo use
so 
there's no 
need to 
identify those events. This is particularly helpful when they don't even exist, as is the case with Turbo Stream 
lifecycle events, see [hotwired/turbo#59](https://github.com/hotwired/turbo/pull/59).

This repo is based off the demo from the Hotwire screencast found [here](https://hotwire.dev).

The MutationObserver in `app/javascript/react_rails/observer.js` is based heavily on the underlying observers used 
in both Stimulus and Turbo.

`app/javascript/react_rails/index.js` is just ReactRailsUJS ported so that it doesn't eagerly mount components. The 
observer calls mounting and unmounting functions on my `ReactRails` object. 
