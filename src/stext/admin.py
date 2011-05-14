# -*- coding: utf-8 -*-

from django.contrib import admin
from stext.models import Selection

	
class SelectionAdmin(admin.ModelAdmin):
	list_display = ('create_datetime', 'url', 'hightlight_type', 'text')

admin.site.register(Selection, SelectionAdmin)
	

