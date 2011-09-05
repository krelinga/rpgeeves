#! /usr/bin/env python

# Copyright 2011 Andrew Kreling
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import os

from google.appengine.api import users
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
from google.appengine.ext.webapp import util

import dice.expression as expression


class DiceHandler(webapp.RequestHandler):
  def __EntryHtml(self, entry):
    if entry.color():
      return '<font color="%s" size="+1"><b>%s</b></font>' % (entry.color(),
                                                              str(entry))
    else:
      return str(entry)

  class Exception(Exception):
    pass

  def __EvaluateExpression(self, to_evaluate):
    try:
      return expression.Evaluator().Evaluate(to_evaluate)
    except expression.ParseError, e:
      raise DiceHandler.Exception(str(e))

  def get(self):
    d = self.request.get('d').encode('ascii')
    tpl_dict = {'d' : d}

    try:
      entries = self.__EvaluateExpression(d)
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
