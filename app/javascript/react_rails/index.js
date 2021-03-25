import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';

import Observer from './observer';

const constructorFromGlobal = require('react_ujs/react_ujs/src/getConstructor/fromGlobal');
const constructorFromRequireContextWithGlobalFallback = require('react_ujs/react_ujs/src/getConstructor/fromRequireContextWithGlobalFallback');

const ReactRails = {
    // This attribute holds the name of component which should be mounted
    // example: `data-react-class="MyApp.Items.EditForm"`
    CLASS_NAME_ATTR: 'data-react-class',

    // This attribute holds JSON stringified props for initializing the component
    // example: `data-react-props="{\"item\": { \"id\": 1, \"name\": \"My Item\"} }"`
    PROPS_ATTR: 'data-react-props',

    // This attribute holds which method to use between: ReactDOM.hydrate, ReactDOM.render
    RENDER_ATTR: 'data-hydrate',

    // A unique identifier to identify a node
    CACHE_ID_ATTR: 'data-react-cache-id',

    TURBOLINKS_PERMANENT_ATTR: 'data-turbolinks-permanent',

    components: {},

    // Get the constructor for a className (returns a React class)
    // Override this function to lookup classes in a custom way,
    // the default is ReactRailsUJS.ComponentGlobal
    getConstructor: constructorFromGlobal,

    // Given a Webpack `require.context`,
    // try finding components with `require`,
    // then falling back to global lookup.
    useContext: function (requireContext) {
        this.getConstructor = constructorFromRequireContextWithGlobalFallback(requireContext);
    },

    // Render `componentName` with `props` to a string,
    // using the specified `renderFunction` from `react-dom/server`.
    serverRender: function (renderFunction, componentName, props) {
        const componentClass = this.getConstructor(componentName);
        const element = React.createElement(componentClass, props);
        return ReactDOMServer[renderFunction](element);
    },

    // Within `searchSelector`, find nodes which should have React components
    // inside them, and mount them with their props.
    mountComponents: function (node) {
        const className = node.getAttribute(this.CLASS_NAME_ATTR);
        const constructor = this.getConstructor(className);
        const propsJson = node.getAttribute(this.PROPS_ATTR);
        const props = propsJson && JSON.parse(propsJson);
        const hydrate = node.getAttribute(this.RENDER_ATTR);
        const cacheId = node.getAttribute(this.CACHE_ID_ATTR);
        const turbolinksPermanent = node.hasAttribute(this.TURBOLINKS_PERMANENT_ATTR);

        if (!constructor) {
            const message = 'Cannot find component: \'' + className + '\'';
            if (console && console.log) {
                console.log('%c[react-rails] %c' + message + ' for element', 'font-weight: bold', '', node);
            }
            throw new Error(message + '. Make sure your component is available to render.');
        } else {
            let component = this.components[cacheId];
            if (component === undefined) {
                component = React.createElement(constructor, props);
                if (turbolinksPermanent) {
                    this.components[cacheId] = component;
                }
            }

            if (hydrate && typeof ReactDOM.hydrate === 'function') {
                component = ReactDOM.hydrate(component, node);
            } else {
                component = ReactDOM.render(component, node);
            }
        }
    },

    // Within `searchSelector`, find nodes which have React components
    // inside them, and unmount those components.
    unmountComponents: function (node) {
        ReactDOM.unmountComponentAtNode(node);
    },
};

ReactRails.observer = new Observer(ReactRails);

// These stable references are so that handlers can be added and removed:
ReactRails.handleMount = function (e) {
    let target = undefined;
    if (e && e.target) {
        target = e.target;
    }
    ReactRails.mountComponents(target);
};
ReactRails.handleUnmount = function (e) {
    let target = undefined;
    if (e && e.target) {
        target = e.target;
    }
    ReactRails.unmountComponents(target);
};

self.ReactRails = ReactRails;

export default ReactRails;
