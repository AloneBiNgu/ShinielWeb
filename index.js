const express = require("express")
//const vl = require("./vl")
const app = express()
const crypto = require("crypto")
const fetch = require("node-fetch")
const fs = require("fs")
const mongoose = require("mongoose")
const Data = require('./DataUser')

const hash = (str) => {
	return crypto.createHash('sha384').update(str).digest('hex')
}

const base64Encode = (str) => {
	return Buffer.from(str).toString("base64")
}

const base64Decode = (str) => {
	return Buffer.from(str, "base64").toString("ascii")
}

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var LetterArgs = {}
LetterArgs["A"] = "Lone"
LetterArgs["B"] = "CAK"
LetterArgs["C"] = "Bucu"
LetterArgs["D"] = "MANO"
LetterArgs["E"] = "NARUTO"
LetterArgs["F"] = "IDK"
LetterArgs["G"] = "ghe"
LetterArgs["H"] = "NUNGVL"
LetterArgs["I"] = "NHINCL"
LetterArgs["J"] = "LON"
LetterArgs["K"] = "HUCE"
LetterArgs["L"] = "HUAT"
LetterArgs["M"] = "DIME"
LetterArgs["N"] = "DUMA"
LetterArgs["O"] = "CL"
LetterArgs["P"] = "VL"
LetterArgs["Q"] = "MATDAY"
LetterArgs["R"] = "ADU"
LetterArgs["S"] = "CUNGMANH"
LetterArgs["T"] = "ALIME"
LetterArgs["U"] = "QUADU"
LetterArgs["V"] = "DELL"
LetterArgs["W"] = "MANH"
LetterArgs["X"] = "VAYAK"
LetterArgs["Y"] = "LOVE"
LetterArgs["Z"] = "YEU"
// -------------------------------
LetterArgs["a"] = "GKE"
LetterArgs["b"] = "OK"
LetterArgs["c"] = "chien"
LetterArgs["d"] = "uoc"
LetterArgs["e"] = "chiuluon"
LetterArgs["f"] = "vcl"
LetterArgs["g"] = "fbi"
LetterArgs["h"] = "clm"
LetterArgs["i"] = "dmm"
LetterArgs["j"] = "cac"
LetterArgs["k"] = "hihi"
LetterArgs["l"] = "ngaivl"
LetterArgs["m"] = "nhincmm"
LetterArgs["n"] = "dungma"
LetterArgs["o"] = "huhu"
LetterArgs["p"] = "chiuroi"
LetterArgs["q"] = "thaidog"
LetterArgs["r"] = "ngulol"
LetterArgs["s"] = "chetdi"
LetterArgs["t"] = "gaixinh"
LetterArgs["u"] = "united"
LetterArgs["v"] = "xxx"
LetterArgs["w"] = "hiepdam"
LetterArgs["x"] = "mupz"
LetterArgs["y"] = "nunglon"
LetterArgs["z"] = "ranuoc"
// ----------------------------------------------

function Trans(key) {
	let Encode = ""
	for (i = 0; i < key.length; i++) {
		if (LetterArgs[key[i]] !== null) {
			Encode += LetterArgs[key[i]]
		}
	}
	return Encode
}
function DeTrans(key) {
	return new Promise((resolve) => {
		var properti = Object.getOwnPropertyNames(LetterArgs)
		let Check = ""
		let Code = ""
		for (i = 0; i < key.length; i++) {
			Check += key[i]
			for (j = 0; j < properti.length; j++) {
				if (LetterArgs[properti[j]] == Check) {
					Check = ""
					Code += properti[j]
				}
			}
		}
		return resolve(Code)
	})
}

function Reverse(key) {
	let newKey = ""
	for (i = key.length-1; i >= 0; i--) {
		newKey += key[i]
	}
	return newKey
}

async function Decode(index, key) {
	return new Promise(async(resolve, reject) => {
		if (index > 20) return resolve(key)
		let decodeKey = ""
		let ReverseKey = Reverse(key)
		for (var i = 0; i < key.length; i++) {
			decodeKey += String.fromCharCode(Math.floor(ReverseKey[i].charCodeAt() - index));
		}
		console.log(decodeKey)
		//console.log(decodeKey)
		const dataUser = await Data.findOne({KeyCode: decodeKey})
		if (dataUser == null) {
			return resolve(Decode(index + 1, key))
		} else {
			return resolve(decodeKey)
		}
	})
}

function findhwid(headers) {
   	var hwid = null
   	try {
   		hwid = headers["syn-fingerprint"] || headers["krnl-fingerprint"] || headers["Flux-Fingerprint"]
   	} catch {
   		return null
   	}
    return hwid
}
// ----------------------------------------------
app.get("/", async (req, res) => {
	const data = req.query
	const hwid = findhwid(req.headers)
	if (hwid == null) return res.send("HELLO") 
	if (!data.adu || !data.vaiconcak) return res.status(401).send(JSON.stringify({Message: "Invalid Request!"}))
	const rand = data.adu
	const auth = data.vaiconcak
	let decodeAuth = base64Decode(auth)
	decodeAuth = await DeTrans(decodeAuth)
	decodeAuth = await DeTrans(decodeAuth)
	decodeAuth = await Decode(0, decodeAuth)
	//console.log(decodeAuth)
	const dataUser = await Data.findOne({KeyCode: decodeAuth})
	if (!dataUser) return res.status(401).send(JSON.stringify({Message: "Invalid Key!"}))
	if (dataUser.IsUsing == false) return res.status(401).send(JSON.stringify({Message: "Please redeem key before using!"}))
	if (dataUser.BlackList == true) return res.status(401).send(JSON.stringify({Message: "You have been blacklisted!"}))
	if (dataUser.Hwid == "" || !dataUser.Hwid) {
		dataUser.Hwid = hwid
		await dataUser.save()
		const toSend = hash(rand + 'CutDo' + dataUser.KeyCode + 'Winning' + rand + 'QuangNgu' + rand + "RacChxNhinCl" + auth)
		return res.status(200).send(JSON.stringify({Message: toSend}))
	}
	if (dataUser.Hwid !== hwid) return res.status(401).send(JSON.stringify({Message: "Invalid Hwid!"}))
	const toSend = hash(rand + 'CutDo' + dataUser.KeyCode + 'Winning' + rand + 'QuangNgu' + rand + "RacChxNhinCl" + auth)
	res.status(200).send(JSON.stringify({Message: toSend}))
})

app.post("/", async(req, res) => {
	const script = req.body.script
	const scriptFetch = await fetch(script)
	if (!scriptFetch.ok) return
	const text = await scriptFetch.text()
	if (text) {
		fs.writeFile(__dirname + "/Script/script.txt", text, (err, next) => {
			if (err) {
				next(err)
			}
			return res.status(200).send("OK")
		})
	}
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
	console.log("OK")
	if(!mongoose.connections[0].client) {
        mongoose.connect("mongodb+srv://AloneBiNgu:thanhngulol@cluster0.t4sbtjc.mongodb.net/Data", {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        },{server: { auto_reconnect: true }}).then(() => {
        	console.log("connect database")
        })
    }
})