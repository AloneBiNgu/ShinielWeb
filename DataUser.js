const mongoose = require('mongoose');

const WhiteListSchema = new mongoose.Schema({
	KeyCode: {
		type: String,
		required: true,
	},
	KeyCode2: {
		type: String,
	},
	UserId: {
		type: String,
		required: true,
	},
	Hwid: {
		type: String,
		Default: "",
	},
	Time: {
		type: Date,
		Default: 0,
	},
	WhiteListTime: {
		type: Date,
		Default: Date.now
	},
	BlackList: {
		type: Boolean,
		Default: false,
	},
	IsUsing: {
		type: Boolean,
		Default: false,
	}
})

module.exports = mongoose.model("DataUser", WhiteListSchema)