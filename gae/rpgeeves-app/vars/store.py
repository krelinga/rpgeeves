#! /usr/bin/env python

from google.appengine.ext import db

class DiceVar(db.Model):
  owner = db.UserProperty(required=True)
  name = db.StringProperty(required=True)
  value = db.StringProperty(required=True)
