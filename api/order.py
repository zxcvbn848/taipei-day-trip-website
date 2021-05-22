import sys
sys.path.append("..")

from flask import request, Blueprint, jsonify, session
from datetime import datetime
import json
import requests

from mysql_connect import insertOrder, selectOrder
 
api_order = Blueprint("api_order", __name__)

@api_order.route("/orders", methods=["POST"])
def postOrders():
   try:
      if "user" in session:
         # Set Main Keys to Variables
         requestJson = request.get_json()
         orderJson = requestJson["order"]
         tripJson = orderJson["trip"]
         attractionJson = tripJson["attraction"]
         contactJson = orderJson["contact"]

         # Get information
         prime = requestJson["prime"]

         price = int(orderJson["price"])

         attractionId = int(attractionJson["id"])
         attractionName = attractionJson["name"]
         attractionAddress = attractionJson["address"]
         attractionImage = attractionJson["image"]
         attractionBoolean = attractionId and attractionName and attractionAddress and attractionImage

         date = tripJson["date"]
         time = tripJson["time"]
         tripBoolean = price and date and time

         contactName = contactJson["name"]
         contactEmail = contactJson["email"]
         contactPhone = contactJson["phone"]
         contactBoolean = contactName and contactEmail and contactPhone
         userId = int(session["user"]["id"])

         if not (tripBoolean and attractionBoolean and contactBoolean and userId):
            return jsonify({ "error": True, "message": "訂單建立失敗，輸入不正確或其他原因" })
         
         # Deal with prime API
         payByPrime_Url = "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"
         headers = {
            "Content-Type": "application/json",
            "x-api-key": "partner_s7LVqjIdzBwsPr1CsBueKCIWfeGE8V0G7sWirM0puFmJD27oLSlgnhxU"
         }
         tappayRequest = json.dumps({
            "prime": prime,
            "partner_key": "partner_s7LVqjIdzBwsPr1CsBueKCIWfeGE8V0G7sWirM0puFmJD27oLSlgnhxU",
            "merchant_id": "zxcvbn848_ESUN",
            "details": "Tappay test",
            "amount": price,
            "cardholder": {
               "phone_number": contactPhone,
               "name": contactName,
               "email": contactEmail,
               "zip_code": "",
               "address": "",
               "nation_id": "",
            }
         })
         response = requests.post(payByPrime_Url, data = tappayRequest, headers = headers, timeout = 30)
         res = response.json()

         message = ""
         if res["status"] == 0:
            insertOrder(attractionId = attractionId, userId = userId, phone = contactPhone, number = res["rec_trade_id"], price = price, date = date, time = time, status = res["status"])

            createdOrder = selectOrder(res["rec_trade_id"])

            if createdOrder:
               message = "付款成功"
               orderData = {
                  "number": createdOrder["number"],
                  "payment": {
                     "status": res["status"],
                     "message": message
                  }
               }
               return jsonify({ "data": orderData })
            else:
               message = "訂單建立失敗，輸入不正確或其他原因"
               return jsonify({ "error": True, "message": message })
         else:
            message = "訂單建立失敗，輸入不正確或其他原因"
            return jsonify({ "error": True, "message": message })
      else:
         return jsonify({ "error": True, "message": "請先登入" })
   except Exception as e:
      print(e)
      return jsonify({ "error": True, "message": "伺服器內部錯誤" })

@api_order.route("/order/<string:number>", methods=["GET"])
def getOrder(number):
   try:
      if "user" in session:
         selectedOrder = selectOrder(number)

         if selectedOrder:
            orderData = {
               "number": number,
               "price": int(selectedOrder["price"]),
               "trip": {
                  "attraction": {
                     "id": int(selectedOrder["attractionId"]),
                     "name": selectedOrder["attr_name"],
                     "address": selectedOrder["address"],
                     "image": json.loads(selectedOrder["images"])[0]
                  },
                  "date": datetime.strftime(selectedOrder["date"], "%Y-%m-%d"),
                  "time": selectedOrder["time"],
               },
               "contact": {
                  "name": selectedOrder["user_name"],
                  "email": selectedOrder["email"],
                  "phone": selectedOrder["phone"]
               },
               "status": int(selectedOrder["status"])
            }
            return jsonify({ "data": orderData })
         else:
            return jsonify({ "data": None })
      else:
         return jsonify({ "error": True, "message": "請先登入" })
   except Exception as e:
      print(e)
      return jsonify({ "error": True, "message": "伺服器內部錯誤" })

