#! /usr/bin/env python

import os

from google.appengine.api import users
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
from google.appengine.ext.webapp import util

import vars.store as store

class VarsHandler(webapp.RequestHandler):
  def __HandleNew(self):
    pass

  def __HandleList(self):
    tpl_path = os.path.join(os.path.dirname(__file__), 'var_list.html')
    owner = users.get_current_user()
    tpl_dict = {'vars' : [store.DiceVar(owner=owner, name="foo", value="1d6"),
                          store.DiceVar(owner=owner, name="bar", value="1d20")]}
    self.response.out.write(template.render(tpl_path, tpl_dict))
    pass
  def get(self):
    # make sure the user is logged in
    user = users.get_current_user()
    if not user:
      self.redirect(users.create_login_url(self.request.uri))
      return

    action = self.request.get('action').encode('ascii')
    if action == 'new':
      self.__HandleNew()
      return
    else:
      self.__HandleList()
      return


def main():
  application = webapp.WSGIApplication([('/vars', VarsHandler)], debug=True)
  util.run_wsgi_app(application)


if __name__ == '__main__':
  main()
