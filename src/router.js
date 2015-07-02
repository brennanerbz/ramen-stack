import app from 'ampersand-app'
import React from 'react';
import Router from 'ampersand-router';
import qs from 'qs'
import uuid from 'node-uuid'
import xhr from 'xhr'
import Layout from './layout';
import MessagePage from './pages/message';
import PublicPage from './pages/public';
import BeersPage from './pages/beers';
import CreateBeerPage from './pages/create-beer';
import BeerDetailPage from './pages/detail-beer';
import config from './config';
import Beer from './models/beer'

export default Router.extend({

    renderPage(page, opts = {layout: true}) {
        if(opts.layout) {
            page = (
                <Layout me={app.me}>
                    {page}
                </Layout>
            );
        }
        React.render(page, document.body)
    },

    routes: {
        '': 'public',
        'beers/create': 'createBeer',
        'beers/:id': 'detailsBeer',
        'beers': 'listBeers',
        'logout': 'logout',
        '*fourohfour': 'fourOhFour'
    },
    public () {
        this.renderPage(<PublicPage me={app.me}/>, { layout: false });
    },

    listBeers () {
      if (!app.me.authHeader) {
        this.redirectTo('');
      } else {
        app.me.beers.fetch();
        this.renderPage(<BeersPage beers={app.me.beers} />);
      }
    },

    createBeer () {
      if (!app.me.authHeader) {
        this.redirectTo('');
      } else {
        const beer = new Beer();
        this.renderPage(<CreateBeerPage beer={beer} />);
      }
    },

    detailsBeer (id) {
      const _this = this;
      let beer = app.me.beers.get(id);
      if (!beer) {
        beer = new Beer({ _id: id });
        beer.fetch({
          error () {
            _this.renderPage(<MessagePage title='Beer not found' />);
          },
          success () {
            _this.renderPage(<BeerDetailPage beer={beer} />);
          }
        })
      } else {
        this.renderPage(<BeerDetailPage beer={beer} />);
      }
    },

    logout () {
        window.localStorage.clear();
        window.location = '/';
    },

    fourOhFour () {
        this.renderPage(<MessagePage title='Page not found' />);
    }

});