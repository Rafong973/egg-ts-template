#!/usr/bin/env python
# coding:utf8

import re
import sys
from k8s_base_server import kubernetes

template = '''apiVersion: v1
kind: Service
metadata:
  name: {name}-svc
  namespace: {namespace}
spec:
  ports:
    - name: {name}-svc-port
      port: 80
      protocol: TCP
      targetPort: 3000
  selector:
    app: {name}
  sessionAffinity: None
  type: ClusterIP
'''

project_name = sys.argv[1]
tag = sys.argv[2]
# namespace 取tag的字母
namespace = ''.join(re.findall(r'[A-Za-z]', tag))
# 灰度分支和正式分支是同一个namespace
if namespace == 'gray':
    namespace = 'release'
    project_name = project_name + '-gray'
specific_yaml = template.format(name=project_name,namespace=namespace)
k8s = kubernetes(project_name + '-svc',specific_yaml,namespace)
code = k8s.exist_obj()
if not code:
    k8s.create()
