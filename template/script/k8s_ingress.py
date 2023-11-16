#!/usr/bin/env python
# coding:utf8

import re
import sys
from k8s_base_server import kubernetes

template = '''apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  annotations:
    nginx.ingress.kubernetes.io/service-weight: ''
  generation: 1
  name: {name}-ingress
  namespace: {namespace}
spec:
  rules:
    - host: {domain}.api.meiway.cc
      http:
        paths:
          - backend:
              serviceName: {name}-svc
              servicePort: 80
            path: /
status:
  loadBalancer:
    ingress:
      - ip: 47.115.112.192
'''

project_name = sys.argv[1]
tag = sys.argv[2]

# namespace 取tag的字母
namespace = ''.join(re.findall(r'[A-Za-z]', tag))

# 域名去掉-符号
domain = project_name.replace('-','')
if namespace == 'test':
    domain += 'test'

specific_yaml = template.format(name=project_name,domain=domain,namespace=namespace)
k8s = kubernetes(project_name + '-ingress',specific_yaml,namespace)
code = k8s.exist_obj()
if not code:
    k8s.create()
