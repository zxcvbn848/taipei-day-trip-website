from flask import *
from mysql_connect import selectAttractions, selectAttraction

app=Flask(__name__)
app.config["JSON_SORT_KEYS"] = False
app.config["JSON_AS_ASCII"] = False
app.config["TEMPLATES_AUTO_RELOAD"] = True

# Pages
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")
# ==============
# API
@app.route("/api/attractions", methods=["GET"])
def getAttractions():
	try:
		page = int(request.args.get("page"))
		keyword = request.args.get("keyword")
		if page == None or page < 0:
			return jsonify({ "error": True, "message": "伺服器內部錯誤" })
		# TBD: keyword 篩選
		
		attractionsDataList = selectAttractions(page = page, keyword = keyword)
		if attractionsDataList == None:
			return jsonify({ "error": True, "message": "伺服器內部錯誤" })
		return jsonify({ "nextPage": page + 1,"data": attractionsDataList })
	except Exception as e:
		print(e)
		return jsonify({ "error": True, "message": e })

@app.route("/api/attraction/<int:id>", methods=["GET"])
def getAttraction(id):
	try:
		attractionData = selectAttraction(id)

		if attractionData == None:
			return jsonify({ "error": True, "message": "景點編號不正確" })	
		else:
			return jsonify({ "data": attractionData })
	except Exception as e:
		print(e)
		return jsonify({ "error": True, "message": "伺服器內部錯誤" })


app.run(host="0.0.0.0", port=3000)