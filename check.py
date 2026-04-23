import urllib.request

try:
    response = urllib.request.urlopen('http://localhost:5173/')
    html = response.read().decode('utf-8')
    print("HTML length:", len(html))
    if '<section class="process-section"' in html or 'kal-process-section' in html:
        print("PROCESS SECTION IS PRESENT IN DOM!")
    else:
        print("PROCESS SECTION IS MISSING FROM DOM!")
except Exception as e:
    print("Error:", e)
