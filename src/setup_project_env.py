# -*- coding: utf-8 -*-

import os
import sys
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJECT_ROOT = project_root + '/'

def add_path(path):
	while path in sys.path:
		sys.path.remove(path)
	sys.path.insert(1, path)

add_path(os.path.join(project_root, 'etc'))
add_path(os.path.join(project_root, 'src'))
