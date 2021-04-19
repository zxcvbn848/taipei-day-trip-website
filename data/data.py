import mysql.connector
from dotenv import load_dotenv
import os
import json
import urllib.request as req

load_dotenv()

websiteDB = mysql.connector.connect(
   host = os.getenv("SERVER_HOST"),
   port = 3306,
   user = os.getenv("SERVER_USER"),
   password = os.getenv("SERVER_PASSWORD"),
   database = "taipei",
   charset = "utf8"
)

webCursor = websiteDB.cursor()

# with open("taipei-attractions.json", "r", encoding="utf-8") as file:
#    data_dict = json.load(file)
#    results = data_dict["result"]["results"]
#    for result in results:
#       name = result["stitle"]
#       category = result["CAT2"]
#       description = result["xbody"]
#       address = result["address"]
#       transport = result["info"]
#       mrt = result["MRT"]
#       latitude = float(result["latitude"])
#       longitude = float(result["longitude"])
#       sql_cmd = """
#          INSERT INTO attractions (name, category, description, address, transport, mrt, latitude, longitude)
#          VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
#          """
#       webCursor.execute(sql_cmd, (name, category, description, address, transport, mrt, latitude, longitude))

#       websiteDB.commit()


with open("taipei-attractions.json", "r", encoding="utf-8") as file:
   data_dict = json.load(file)
   results = data_dict["result"]["results"]
   for result in results:
      id = result["_id"]
      imagesUrl = result["file"].split("http://")[1: -1]
      for imageUrl in imagesUrl:
         if imageUrl.endswith(("jpg", "JPG", "png")):
            imageUrl = "http://" + imageUrl
            sql_cmd = """
               INSERT INTO images (attraction_id, image_url)
               VALUES (%s, %s)
               """
            webCursor.execute(sql_cmd, (id, imageUrl))

            websiteDB.commit()



