import requests
import sys

def getTicket (site, client):
    url = "http://data.travelplanet.fr/trusted"
    postdata = {"username": client, "target_site": site}
    #postdata = {"username":"SandrineBiglione", "target_site":"vilogia"}
    r = requests.post(url, params=postdata)

    r.encoding

    if r.text == -1:
        print "User or target site not found"
        return 0
    else:
        print r.text
        return 1

getTicket (sys.argv[1], sys.argv[2])
