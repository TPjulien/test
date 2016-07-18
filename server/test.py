import requests
import sys
import codecs
import re
import string
import htmlmin
from slimmer import html_slimmer

sys.stdout = codecs.getwriter('utf8')(sys.stdout)
sys.stderr = codecs.getwriter('utf8')(sys.stderr)

def toto():
    r = requests.post('https://e-travelmanagement22.amadeus.com/portalApp/', data= {   'LOGINNAME':         'helpdesk@travelplanet.fr',
                                                                                       'SITE':              'Q4OZQ4OZ',
                                                                                       'LANGUAGE':          'FR',
                                                                                       'LOGIN_TYPE':        'SSO',
                                                                                       'PASSWORD':          'travel2014',
 
                                                                                       'BOOKING_FLOW_TYPE': 'MODIFY'}, allow_redirects=True)
    #r.encoding
    #print(r.text[0])
    #print(r.text)

    # regex url
    #urls = re.findall('http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', r.text)
    #print(urls[0]);
    t = r.text;
    
    #print t.translate(string.maketrans("\n\t\r", " "))
    #print("<div><h1>Putain de merde</h1></div>")
    html = htmlmin.minify(t, remove_empty_space=True)
    slimmer = html_slimmer(html.strip().replace('\n', ' ').replace('\t', ' ').replace('\r', ' '))
    print(slimmer);
    
toto()
