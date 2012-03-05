#!/usr/bin/env python

from SimpleHTTPServer import SimpleHTTPRequestHandler
import SocketServer

class RequestHandler(SimpleHTTPRequestHandler):

    def __init__(self, *args, **kwargs):
        SimpleHTTPRequestHandler.__init__(self, *args, **kwargs)

    def do_GET(self):

        SimpleHTTPRequestHandler.do_GET(self)


PORT = 8080

httpd = SocketServer.TCPServer(("", PORT), RequestHandler)

print "serving at port", PORT
httpd.serve_forever()
