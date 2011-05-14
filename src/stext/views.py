# -*- coding: utf-8 -*-
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.utils import simplejson
from django.http import HttpResponse
import settings
import models


def genJsLoader(req):
	site_url = "".join([req.META['wsgi.url_scheme'], "://", req.META['HTTP_HOST']])
	
	params = {
		"js_url": "",
		"css_url": "",
		"selection_get_url": site_url + "/selection/get/",
		"selection_save_url": site_url + "/selection/save/",
	}
	
	
	if(settings.JS_URL[0] != "h"): #settings.JS_URL = "/path_to_js"
		params['js_url'] = site_url + settings.JS_URL
	else:#settings.JS_URL = "http://example.org/path_to_js"
		params['js_url'] = settings.JS_URL
		
	if(settings.CSS_URL[0] != "h"):
		params['css_url'] = site_url + settings.CSS_URL
	else:
		params['css_url'] = settings.CSS_URL
	
	return '''
// ==UserScript==
// @name          Social Web Markers
// @namespace     socialwebmarkers
// @description	  Mark the Web, see other people marks
// @include       *
// @version       0.1
// @source       http://with.in/
// @author       samlowry
// ==/UserScript==
(function(sl, cl, sg, ss) {
	var d = document,
		s = d.createElement("script"),
		c = d.createElement("link"),
		h = d.getElementsByTagName("head")[0];
		
	s.src = sl;
	s.type = "text/javascript";
	s.language = "JavaScript";
	
	c.type = "text/css";
	c.rel = "stylesheet";
	c.href = cl;
	h.appendChild(s);
	h.appendChild(c);
	window.TS_CONFIG = {
		"SELECTION_GET": sg,
		"SELECTION_SAVE": ss
	};
})(
	"%(js_url)s",
	"%(css_url)s",
	"%(selection_get_url)s",
	"%(selection_save_url)s"
)
	'''%params
	
def genBookmarklet(req):
	return "javascript:(%s)"%genJsLoader(req)
	
def genUserJs(req):
	m_type = "text/javascript"
	return HttpResponse(genJsLoader(req), mimetype=m_type)
	

def mainPage(req):
	return render_to_response(
		'base.html',
		{
			'bookmarklet': genBookmarklet(req).replace("\n", "").replace("\t", "")
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
	
	if (not url or not text or hl_type == None):
		return HttpResponse('throw new Error("Invalid JSON data.");', mimetype=m_type)
		
	models.Selection(url = url, text = text, hightlight_type = hl_type).save()
	
	return HttpResponse("//OK", mimetype=m_type)
	
	
