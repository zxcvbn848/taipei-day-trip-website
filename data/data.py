import mysql.connector
from dotenv import load_dotenv
import os
import json

load_dotenv()

websiteDB = mysql.connector.connect(
   host = os.getenv("SERVER_HOST"),
   port = int(os.getenv("SERVER_PORT")),
   user = os.getenv("SERVER_USER"),
   password = os.getenv("SERVER_PASSWORD"),
   database = "taipei",
   charset = "utf8"
)

webCursor = websiteDB.cursor()

with open("taipei-attractions.json", "r", encoding="utf-8") as file:
   data_dict = json.load(file)
   results = data_dict["result"]["results"]
   for result in results:
      id = result["_id"]
      name = result["stitle"]
      category = result["CAT2"]
      description = result["xbody"]
      address = result["address"]
      transport = result["info"]
      mrt = result["MRT"]
      latitude = float(result["latitude"])
      longitude = float(result["longitude"])

      imagesUrl = result["file"].split("http://")[1:]
      imagesUrlList = []
      for imageUrl in imagesUrl:
         if imageUrl.endswith(("jpg", "JPG", "png", "PNG")):
            imageUrl = "http://" + imageUrl
            imagesUrlList.append(imageUrl)
      imagesUrlListJson = json.dumps(imagesUrlList)

      sql_cmd = """
         INSERT INTO attractions (id, name, category, description, address, transport, mrt, latitude, longitude, images_url)
         VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
         """
      webCursor.execute(sql_cmd, (id, name, category, description, address, transport, mrt, latitude, longitude, imagesUrlListJson))

      websiteDB.commit()


