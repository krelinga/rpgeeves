#! /usr/bin/env python

import os

from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
from google.appengine.ext.webapp import util

import dice.expression as expression


class DiceHandler(webapp.RequestHandler):
  def get(self):
    d = self.request.get('d').encode('ascii')
    tpl_dict = {'d' : d}
    try:
      entries = expression.Evaluate(d)
      tpl_dict['total']  = sum([int(x) for x in entries])
      tpl_dict['entries'] = [str(x) for x in entries]
    except expression.ParseError, e:
      tpl_dict['error'] = str(e)

    tpl_path = os.path.join(os.path.dirname(__file__), 'dice.html')
    self.response.out.write(template.render(tpl_path, tpl_dict))


def main():
  application = webapp.WSGIApplication([('/dice', DiceHandler)], debug=True)
  util.run_wsgi_app(application)


if __name__ == '__main__':
  main()
