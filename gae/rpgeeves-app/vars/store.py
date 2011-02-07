#! /usr/bin/env python

from google.appengine.ext import db

class User(db.Model):
  username = db.UserProperty(required=True)

class DiceVar(db.Model):
  owner = db.ReferenceProperty(User, required=True)
  name = db.StringProperty(required=True)
  value = db.StringProperty(required=True)
