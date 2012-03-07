#!/usr/bin/env python

from SimpleHTTPServer import SimpleHTTPRequestHandler
import SocketServer
import gzip, time

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

        else:
            SimpleHTTPRequestHandler.do_GET(self)


PORT = 8080

httpd = SocketServer.TCPServer(("", PORT), RequestHandler)

print "serving at port", PORT
httpd.serve_forever()
