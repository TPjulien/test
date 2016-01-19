import requests
import sys

def getTicket (site, client):
    print(site)
    print(client)
    url = "http://data.travelplanet.fr/trusted"
    postdata = {"username": client, "target_site": site}
    #postdata = {"username":"SandrineBiglione", "target_site":"vilogia"}
    r = requests.post(url, params=postdata)

    r.encoding

    print(r.text)
    return r.text

getTicket (sys.argv[1], sys.argv[2])
