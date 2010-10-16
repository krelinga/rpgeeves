#! /usr/bin/env python

import os

from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
from google.appengine.ext.webapp import util


class DiceHandler(webapp.RequestHandler):
  def get(self):
    tpl_path = os.path.join(os.path.dirname(__file__), 'dice.html')
    self.response.out.write(template.render(tpl_path, {}))


def main():
  application = webapp.WSGIApplication([('/dice', DiceHandler)], debug=True)
  util.run_wsgi_app(application)


if __name__ == '__main__':
  main()
