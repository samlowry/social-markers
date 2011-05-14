# -*- coding: utf-8 -*-
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.utils import simplejson
from django.http import HttpResponse
import settings
import models


def mainPage(req):
	return render_to_response(
		'base.html',
		{
			'JS_URL': settings.JS_URL,
			'CSS_URL': settings.CSS_URL
		},
		context_instance=RequestContext(req)
	)
	
	
def getSelections(req):
	params = req.GET.get('params')
	m_type = "text/javascript"
	if not params:
		return HttpResponse('throw new Error("Request parameters undefined.");', mimetype=m_type)
	
	try:
		params = simplejson.loads(params)
	except simplejson.JSONDecodeError:
		return HttpResponse('throw new Error("Invalid JSON data.");', mimetype=m_type)
		
	url = params.get('url', False)
	callback = params.get('callback', False)
	
	if (not url or not callback):
		return HttpResponse('throw new Error("Invalid format");', mimetype=m_type)
		
	selections = models.Selection.objects.filter(url=url).order_by('create_datetime')
	selections_list = [{"text": s.text, "hl_type": s.hightlight_type} for s in selections]
	selections_json = simplejson.dumps(selections_list, ensure_ascii=False)
	
	return HttpResponse('%(callback)s(%(json)s);'%{"callback": callback, "json": selections_json}, mimetype=m_type)
	
def saveSelection(req):
	data = req.GET.get('data')
	m_type = "text/javascript"
	if not data:
		return HttpResponse('throw new Error("Request data undefined.");', mimetype=m_type)
	
	try:
		data = simplejson.loads(data)
	except simplejson.JSONDecodeError:
		return HttpResponse('throw new Error("Invalid JSON data.");', mimetype=m_type)
		
	url = data.get('url', False)
	text = data.get('text', False)
	hl_type = data.get('hl_type', None)
	print data
	
	if (not url or not text or hl_type == None):
		return HttpResponse('throw new Error("Invalid JSON data.");', mimetype=m_type)
		
	models.Selection(url = url, text = text, hightlight_type = hl_type).save()
	
	return HttpResponse("//OK", mimetype=m_type)
