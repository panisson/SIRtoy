#!/usr/bin/env python

from SimpleHTTPServer import SimpleHTTPRequestHandler
import SocketServer
import gzip, time
from ast import literal_eval
import json

class RequestHandler(SimpleHTTPRequestHandler):

    def __init__(self, *args, **kwargs):
        SimpleHTTPRequestHandler.__init__(self, *args, **kwargs)

    def do_GET(self):

        if self.path == "/stream":
            
            self.send_response(200)
            self.send_header("Content-Type", "application/x-javascript")
            self.send_header("Tranfer-Encoding", "chunked")
            self.end_headers()
            f = gzip.open("graph.json.gz", 'r');
            line = f.readline()
            while line != '':
                self.wfile.write(line)
                time.sleep(0.02)
                line = f.readline()
                
        elif self.path == "/ht09":
            
            self.send_response(200)
            self.send_header("Content-Type", "application/x-javascript")
            self.send_header("Tranfer-Encoding", "chunked")
            self.end_headers()
            
            sep = '\n\r'
            f = gzip.open("ht09_frames.dat.gz", 'r');
            line = f.readline()
            nodes = set()
            prev = []
            while line != '':
                contacts = literal_eval(line)
                #jso = {'an':{}, 'ae':{}, 'de':{}}
                
                #self.wfile.write(line)
                
                for (source,target) in contacts:
                    
                    if source == target: continue 
                    
                    if source > target: (source,target) = (target,source)
                    
                    if source not in nodes:
                        o = json.dumps({'an':{str(source):{}}})
                        self.wfile.write(o+sep)
                        nodes.add(source)
                    if target not in nodes:
                        o = json.dumps({'an':{str(target):{}}})
                        self.wfile.write(o+sep)
                        nodes.add(target)
                    
                    if (source,target) not in prev and (target, source) not in prev:
                        o = json.dumps({'ae':{str(source)+'-'+str(target): {'source':str(source), 'target':str(target)}}})
                        self.wfile.write(o+sep)
                
                for (source,target) in prev:
                    if source == target: continue
                    if source > target: (source,target) = (target,source) 
                    
                    if (source,target) not in contacts and (target,source) not in contacts: 
                        o = json.dumps({'de':{str(source)+'-'+str(target): {}}})
                        self.wfile.write(o+sep)
                
                prev = contacts
                self.wfile.flush()
                time.sleep(0.2)
                line = f.readline()
                
        else:
            SimpleHTTPRequestHandler.do_GET(self)


PORT = 8080

httpd = SocketServer.TCPServer(("", PORT), RequestHandler)

print "serving at port", PORT
httpd.serve_forever()
