#! /usr/bin/env python

import os

from google.appengine.api import users
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
from google.appengine.ext.webapp import util

import dice.expression as expression
import vars.store as store

class VarsHandler(webapp.RequestHandler):
  def __UserForReqeust(self):
    query = store.User.all()
    query.filter('username =', users.get_current_user())
    results = query.fetch(1)
    if len(results) == 0:
      # put a new user
      new_user = store.User(username=users.get_current_user())
      new_user.put()
      results.append(new_user)
    return results[0]
    
  def __RequestVar(self, name):
    return self.request.get(name).encode('ascii')

  def __CheckParse(self, value):
    try:
      evaluator = expression.Evaluator()
      result = evaluator.Evaluate(value)
    except expression.ParseError, e:
      return str(e)
    return None

  def __HandleCreate(self, tpl_dict=None):
    if not tpl_dict: tpl_dict = {}
    tpl_path = os.path.join(os.path.dirname(__file__), 'var_create.html')
    tpl_dict['show_action'] = 'Create'
    tpl_dict['action'] = 'create'
    self.response.out.write(template.render(tpl_path, tpl_dict))

  def __CheckForExistingVariable(self, name):
    query = store.DiceVar.all()
    query.filter('owner =', self.__user)
    query.filter('name =', self.__RequestVar('name'))
    results = query.fetch(1)
    if len(results) != 0:
      return "A variable with this name already exists"
    return None

  def __HandleCreateSubmit(self):
    existing_error = self.__CheckForExistingVariable(self.__RequestVar('name'))
    if existing_error:
      # render error page
      tpl_dict = {'error' : existing_error,
                  'name' : self.__RequestVar('name'),
                  'value' : self.__RequestVar('value')}
      self.__HandleCreate(tpl_dict)
      return

    parse_error = self.__CheckParse(self.__RequestVar('value'))
    if parse_error:
      # render error page
      tpl_dict = {'error' : parse_error,
                  'name' : self.__RequestVar('name'),
                  'value' : self.__RequestVar('value')}
      self.__HandleCreate(tpl_dict)
      return

    new_var = store.DiceVar(owner=self.__user,
                            name=self.__RequestVar('name'),
                            value=self.__RequestVar('value'))
    new_var.put()
    self.__HandleList({'info' : 'Created variable %s' % new_var.name})

  def __HandleList(self, tpl_dict=None):
    if not tpl_dict: tpl_dict = {}
    tpl_path = os.path.join(os.path.dirname(__file__), 'var_list.html')
    owner = self.__user
    query = store.DiceVar.all()
    query.filter('owner =', owner)
    query.order('name')
    results = query.fetch(1)
    tpl_dict['vars'] = results
    self.response.out.write(template.render(tpl_path, tpl_dict))

  def __HandleEdit(self, tpl_dict=None):
    if not tpl_dict: tpl_dict = {}
    tpl_path = os.path.join(os.path.dirname(__file__), 'var_create.html')
    tpl_dict['show_action'] = 'Edit'
    tpl_dict['action'] = 'edit'
    if 'name' not in tpl_dict:
      assert 'value' not in tpl_dict
      query = store.DiceVar.all()
      query.filter('owner =', self.__user)
      name = self.__RequestVar('name')
      query.filter('name =', name)
      results = query.fetch(1)
      if len(results) != 1:
        # handle variable not found
        self.__HandleList({'error' : 'unknown variable %s' % name})
        return
      tpl_dict['name'] = results[0].name
      tpl_dict['value'] = results[0].value
      tpl_dict['original_name'] = results[0].name
    self.response.out.write(template.render(tpl_path, tpl_dict))

  def __HandleEditSubmit(self):
    original_name = self.__RequestVar('original_name')
    name = self.__RequestVar('name')
    query = store.DiceVar.all()
    query.filter('owner =', self.__user)
    query.filter('name =', original_name)
    results = query.fetch(1)
    if len(results) != 1:
      # render error page
      tpl_dict = {'error' : 'Unknown variable %s' % original_name,
                  'name' : name,
                  'original_name' : original_name,
                  'value' : self.__RequestVar('value')}
      self.__HandleEdit(tpl_dict)
      return

    results[0].name = name
    results[0].value = self.__RequestVar('value')

    if original_name != name:
      existing_error = self.__CheckForExistingVariable(name)
      if existing_error:
        # render error page
        tpl_dict = {'error' : existing_error,
                    'name' : name,
                    'original_name' : original_name,
                    'value' : self.__RequestVar('value')}
        self.__HandleEdit(tpl_dict)
        return

    # check for parse error
    parse_error = self.__CheckParse(self.__RequestVar('value'))
    if parse_error:
      # render error page
      tpl_dict = {'error' : parse_error,
                  'original_name' : original_name,
                  'name' : self.__RequestVar('name'),
                  'value' : self.__RequestVar('value')}
      self.__HandleEdit(tpl_dict)
      return

    results[0].put()
    self.__HandleList({'info' : 'Edited variable %s' % results[0].name})

  def get(self):
    # make sure the user is logged in
    user = users.get_current_user()
    if not user:
      self.redirect(users.create_login_url(self.request.uri))
      return
    self.__user = self.__UserForReqeust()

    action = self.__RequestVar('action')
    if action == 'create':
      self.__HandleCreate()
    elif action == 'edit':
      self.__HandleEdit()
    else:
      self.__HandleList()

  def post(self):
    # make sure the user is logged in
    user = users.get_current_user()
    if not user:
      self.redirect(users.create_login_url(self.request.uri))
      return
    self.__user = self.__UserForReqeust()

    action = self.__RequestVar('action')
    if action == 'create':
      self.__HandleCreateSubmit()
    elif action == 'edit':
      self.__HandleEditSubmit()


def main():
  application = webapp.WSGIApplication([('/vars', VarsHandler)], debug=True)
  util.run_wsgi_app(application)


if __name__ == '__main__':
  main()
