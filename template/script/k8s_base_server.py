#!/usr/bin/env python

import os
import sys
import subprocess

class kubernetes:

    def __init__(self,project_name,template,namespace):
        self.project_name = project_name
        self.file_path = project_name + '-' + namespace + '.yaml'
        self.template = template

    def save_template(self):
        f = open(self.file_path, 'w')
        f.write(self.template)
        f.close()

    def create(self):
        self.save_template()
        os.system('kubectl create -f ' + self.file_path)

    def update(self):
        self.save_template()
        os.system('kubectl apply -f ' + self.file_path)

    def exist_obj(self):
        self.save_template()
        command = 'kubectl get -f ' + self.file_path
        code = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE,stderr=subprocess.STDOUT).wait()
        if code == 0 :
            return True
        else:
            return False
