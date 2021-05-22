import sys
sys.path.append("..")

from flask import request, Blueprint, jsonify, session
from datetime import datetime
import json

from mysql_connect import selectBooking, insertBooking, updateBooking, deleteBookingData
 
api_booking = Blueprint("api_booking", __name__) 

@api_booking.route("/booking", methods=["GET"])
def getBooking():
   try:
      if "user" in session:
         userId = int(session["user"]["id"])

         selectedBooking = selectBooking(userId = userId)
         
         if selectedBooking:
            data = {
               "attraction": {
                  "id": selectedBooking["id"],
                  "name": selectedBooking["name"],
                  "address": selectedBooking["address"],
                  "image": json.loads(selectedBooking["images"])[0]
               },
               "date": datetime.strftime(selectedBooking["date"], "%Y-%m-%d"),
               "time": selectedBooking["time"],
               "price": selectedBooking["price"],
            }
            return jsonify({ "data": data })
         else:
            return jsonify({ "data": None })
   except Exception as e:
      print(e)
      return jsonify({ "error": True, "message": "伺服器內部錯誤" })
      
@api_booking.route("/booking", methods=["POST"])
def postBooking(): 
   try:
      if "user" in session:
         attractionId = int(request.get_json()["attrationId"])
         date = request.get_json()["date"]
         time = request.get_json()["time"]
         price = int(request.get_json()["price"])
         userId = int(session["user"]["id"])

         if not (attractionId and date and time and price and userId):
            return jsonify({ "error": True, "message": "建立失敗，輸入不正確或其他原因" })
         
         originBooking = selectBooking(userId = userId)

         if originBooking:
            updateBooking(userId, attractionId = attractionId, date = date, time = time, price = price)
         else:
            insertBooking(attractionId = attractionId, date = date, time = time, price = price, userId = userId)
         
         return jsonify({ "ok": True })
      else:
         return jsonify({ "error": True, "message": "請先登入" })
   except Exception as e:
      print(e)
      return jsonify({ "error": True, "message": "伺服器內部錯誤" })

@api_booking.route("/booking", methods=["DELETE"])
def deleteBooking():
   try:
      if "user" in session:
         userId = request.get_json()["userId"]
         deleteBookingData(userId = userId)

         deletedBooking = selectBooking(userId = userId)
         if not deletedBooking:
            return jsonify({ "ok": True })
         else:
            return jsonify({ "error": True, "message": "刪除失敗" })
      else:
         return jsonify({ "error": True, "message": "未登入系統，拒絕存取" })
   except Exception as e:
      print(e)
      return jsonify({ "error": True, "message": "伺服器內部錯誤" })