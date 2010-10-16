#! /usr/bin/env python

from google.appengine.ext import webapp
from google.appengine.ext.webapp import util

class DiceHandler(webapp.RequestHandler):
    def get(self):
        self.response.out.write('Dice!')


def main():
    application = webapp.WSGIApplication([('/dice', DiceHandler)],
                                         debug=True)
    util.run_wsgi_app(application)


if __name__ == '__main__':
    main()
