# -*- coding: utf-8 -*-
from django.conf.urls.defaults import *

urlpatterns = patterns('stext.views',
	(r'^$', 'mainPage'),
	(r'^selection/get', 'getSelections'),
	(r'^selection/save', 'saveSelection'),
	(r'^marker.user.js$', 'genUserJs'),
)
