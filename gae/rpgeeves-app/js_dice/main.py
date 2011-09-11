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

import logging
import os

from google.appengine.api import users
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
from google.appengine.ext.webapp import util
from google.appengine.ext import db


class ExpressionSet(db.Model):
  """A single string containing the serialized json for the user's dice."""
  user = db.UserProperty()
  expression_set = db.StringProperty(multiline=True)


class JsDiceEditHandler(webapp.RequestHandler):
  def getExpressionSetForUser(self, user):
    expression_set_result = db.GqlQuery('SELECT *'
                                        'FROM ExpressionSet '
                                        'WHERE user = :1 '
                                        'LIMIT 1', user)
    for result in expression_set_result:
      return result
    return None

  def get(self):
    """Create a page to allows users to edit stored sets of dice."""
    # Make sure the user is logged in.
    user = users.get_current_user()
    if not user:
      self.redirect(users.create_login_url(self.request.uri))
      return

    # lookup existing expression set for this user
    result = self.getExpressionSetForUser(user)
    if result:
      starting_set_json = result.expression_set
    else:
      starting_set_json = '{}'
      
    tpl_path = os.path.join(os.path.dirname(__file__), 'js_dice_edit.html')
    tpl_dict = {
      'starting_set_json': starting_set_json,
    }
    self.response.out.write(template.render(tpl_path, tpl_dict))

  def post(self):
    """Accept a user-supplied edit of a stored set of dice."""
    logging.info(self.request.body)
    user = users.get_current_user()
    if not user:
      self.response.set_status(401)

    result = self.getExpressionSetForUser(user)
    if result:
      result.expression_set = self.request.body
    else:
      result = ExpressionSet()
      result.user = user
      result.expression_set = self.request.body
    result.put()
    self.response.set_status(200)


class JsDiceHandler(webapp.RequestHandler):
  def get(self):
    """Create a page that allows users to roll a stored set of dice."""
    self.response.out.write('not implemented yet')


def main():
  application = webapp.WSGIApplication([
      ('/js_dice', JsDiceHandler),
      ('/js_dice_edit', JsDiceEditHandler)], debug=True)
  util.run_wsgi_app(application)


if __name__ == '__main__':
  main()
