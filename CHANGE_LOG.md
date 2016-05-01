- _2.5.3_ : Fix issue passing `routeProps`.

- _2.5.2_ : Fix issue with `transitionBack`.

- _2.5.1_ : Fix for route with no component.

- _2.5.0_ : Allow to pass props from router in routeProps params.

- _2.4.4_ : Fix for routes with no component and correct `transitionBack`.

- _2.4.2_ : Small code improvements.

- _2.4.0_ : Improvements to how rendering is done.

- _2.3.0_ : Add `routeWillFocus` and `routeDidFocus` events that can be
 listened for.

- _2.2.4_ : Fix for passing props to routes that render inside wrapping
components.

- _2.2.3_ : Small fix for styles on `Links`

- _2.2.2_ : Small fixes for None transition and default transition.

- _2.2.1_ : Small performance improvement around try to navigate to the current route.
And add a transition to remove gestures from a transition.

- _2.2.0_ : Add `activeChildStyle` to link to pass a style to a child if link active.

- _2.1.6_ : Fix `lastRoute` and in so doing correcting routes deeper than 2
for `transitionBack`.

- _2.1.5_ : Fix `transitionBack` for sub wrapped routes.

- _2.1.4_ : Fix for sub wrapped routes.

- _2.1.3_ : Fix for active link styles.

- _2.1.2_ : Fix for choosing parent component.

- _2.1.0_ : Add `defaultTransition` prop to `Router` allowing to change the
default transition from `None`.

- _2.0.0_ : Add `None` and `Fade` transitions and default transitions to `None`.
This is a breaking change for those relying on a transition when none has been supplied.

- _1.3.x_ : Add url parameters

- _1.2.x_ : Add passing of children to parent route

- _1.1.x_ : Add sub routing
