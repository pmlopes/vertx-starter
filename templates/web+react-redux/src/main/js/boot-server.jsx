import * as React from 'react';
import {Provider} from 'react-redux';
import {renderToString} from 'react-dom/server';
import {StaticRouter} from 'react-router-dom';
import {replace} from 'react-router-redux';
import {createMemoryHistory} from 'history';
import {routes} from './routes';
import configureStore from './configureStore';

export default function (params) {
  return function (ctx) {
    // Prepare Redux store with in-memory history, and dispatch a navigation event
    // corresponding to the incoming URL
    const basename = params.base.substring(0, params.base.length - 1); // Remove trailing slash
    const urlAfterBasename = ctx.request().uri().substring(basename.length);

    const store = configureStore(createMemoryHistory());
    store.dispatch(replace(urlAfterBasename));

    // Prepare an instance of the application and perform an inital render that will
    // cause any async tasks (e.g., data access) to begin
    const routerContext = {};
    const app = (
      <Provider store={store}>
        <StaticRouter basename={basename} context={routerContext} location={ctx.request().uri()} children={routes}/>
      </Provider>
    );

    renderToString(app);

    // If there's a redirection, perform 302 status and end the request
    if (routerContext.url) {
      ctx.response()
        .putHeader("Location", routerContext.url)
        .setStatusCode(302)
        .end();
      return;
    }

    // Once any async tasks are done, we can perform the final render
    // We also send the redux store state, so the client can continue execution where the server left off
    ctx
      // we define a hardcoded title for our application
      .put('title', 'Home Page')
      // server side rendering
      .put('ssr', renderToString(app));

    params.engine.render(ctx, "templates", "/index.hbs", (res) => {
      if (res.succeeded()) {
        ctx.response()
          .putHeader("Content-Type", 'text/html')
          .end(res.result());
      } else {
        ctx.fail(res.cause());
      }
    });
  };
};
