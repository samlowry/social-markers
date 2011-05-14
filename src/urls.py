# -*- coding: utf-8 -*-
from django.conf.urls.defaults import *

from django.contrib import admin
from django.views import static
import settings

admin.autodiscover()
                                      
urlpatterns = patterns('')
print settings.DEBUG
print settings.MEDIA_ROOT

if settings.DEBUG:
	urlpatterns += patterns('',
		(r'^media/(?P<path>.*)$', static.serve, {'document_root': settings.MEDIA_ROOT}),
	)

urlpatterns += patterns('',
	(r'^', include('stext.urls')),
	(r'^admin/', include(admin.site.urls)),
)
