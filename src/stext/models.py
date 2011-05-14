# -*- coding: utf-8 -*-
from django.db import models

class Selection(models.Model):
	#согласно это статье: http://www.computerra.ru/31915/ урлы сайтов могут быть под 1500 символов длинной
	#пока именно такую цифру я и оставлю в ограничениях, но она неразумна
	url = models.CharField(verbose_name=u"Адрес сайта", max_length=1500)
	create_datetime = models.DateTimeField(verbose_name = u"Дата создания", auto_now_add = True)
	text = models.TextField(verbose_name = u'Выделенный текст')
	hightlight_type = models.SmallIntegerField(verbose_name="Тип подсветки")
	
	
	def __unicode__(self):
		return u"%s %s"%(self.url, self.text)

	
