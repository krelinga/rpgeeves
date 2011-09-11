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


class JsDiceEditHandler(webapp.RequestHandler):
  def get(self):
    """Create a page to allows users to edit stored sets of dice."""
    tpl_path = os.path.join(os.path.dirname(__file__), 'js_dice_edit.html')
    tpl_dict = {
      'starting_set_json': '{"foo": "d20","bar": "2d10 + 3","baz": "3d4"}',
    }
    self.response.out.write(template.render(tpl_path, tpl_dict))

  def post(self):
    """Accept a user-supplied edit of a stored set of dice."""
    self.response.out.write('not implemented yet')


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
