#! /usr/bin/env python

import os

from google.appengine.api import users
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
from google.appengine.ext.webapp import util

import dice.expression as expression
import vars.expander as expander
import vars.store as store


class DiceHandler(webapp.RequestHandler):
  def __EntryHtml(self, entry):
    if entry.color():
      return '<font color="%s" size="+1"><b>%s</b></font>' % (entry.color(),
                                                              str(entry))
    else:
      return str(entry)

  class Exception(Exception):
    pass

  def __ExpandVars(self, to_expand):
    if not expander.RequiresExpansion(to_expand):
      return to_expand
    assert users.get_current_user()
    query = store.User.all()
    query.filter('username =', users.get_current_user())
    results = query.fetch(1)
    if len(results) == 0:
      raise DiceHandler.Exception('You haven\'t created any variables yet!')
    user = results[0]
    try:
      expand_fn = lambda x: expander.ExpandFromStore(x, user)
      expander_instnace = expander.Expander(expand_fn)
      return expander_instnace.Expand(to_expand)
    except expander.UnknownVariableException, e:
      raise DiceHandler.Exception(str(e))

  def get(self):
    d = self.request.get('d').encode('ascii')
    tpl_dict = {'d' : d}

    if expander.RequiresExpansion(d) and not users.get_current_user():
      self.redirect(users.create_login_url(self.request.uri))
      return

    try:
      inlined = self.__ExpandVars(d).encode('ascii')
      entries = expression.Evaluator().Evaluate(inlined)
      tpl_dict['total']  = sum([int(x) for x in entries])
      tpl_dict['entries'] = [self.__EntryHtml(x) for x in entries]
    except DiceHandler.Exception, e:
      tpl_dict['error'] = str(e)

    tpl_path = os.path.join(os.path.dirname(__file__), 'dice.html')
    self.response.out.write(template.render(tpl_path, tpl_dict))


def main():
  application = webapp.WSGIApplication([('/dice', DiceHandler)], debug=True)
  util.run_wsgi_app(application)


if __name__ == '__main__':
  main()
