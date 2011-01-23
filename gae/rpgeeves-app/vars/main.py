#! /usr/bin/env python

import os

from google.appengine.api import users
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
from google.appengine.ext.webapp import util

class VarsHandler(webapp.RequestHandler):
  def get(self):
    # make sure the user is logged in
    user = users.get_current_user()
    if not user:
      self.redirect(users.create_login_url(self.request.uri))
      return

    self.response.out.write('hello vars!')


def main():
  application = webapp.WSGIApplication([('/vars', VarsHandler)], debug=True)
  util.run_wsgi_app(application)


if __name__ == '__main__':
  main()
