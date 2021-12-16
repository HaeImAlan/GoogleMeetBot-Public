const express = require('express');
const path = require('path');
const GoogleMeet = require('./google-meet');
const { MessageEmbed, WebhookClient } = require('discord.js');
const { webhookURL, email, password } = require('./config.json');


const webhookClient = new WebhookClient({ url: webhookURL });
//define the join embed
var joinembed = new MessageEmbed()
	.setTitle('Join Request')
	.setDescription('A request was sent to join the meeting!')
	.setFooter("Google Meet Bot By HaeImAlan")
	.setThumbnail('https://fonts.gstatic.com/s/i/productlogos/meet_2020q4/v1/web-96dp/logo_meet_2020q4_color_2x_web_96dp.png')
	.setColor('#86dc3d')
// define the leave embed
var leaveembed = new MessageEmbed()
	.setTitle('Leave Request')
	.setDescription('A request was sent to leave the meeting!')
	.setFooter("Google Meet Bot By HaeImAlan")
	.setThumbnail('https://fonts.gstatic.com/s/i/productlogos/meet_2020q4/v1/web-96dp/logo_meet_2020q4_color_2x_web_96dp.png')
    .setColor('#dc143c')

//const errorembed = new MessageEmbed()
//    .setTitle('An unexpected error occurred.')
//    .setDescription("An unexpected error occurred, please check the console for more information.")
//    .setFooter("Google Meet Bot By HaeImAlan :( ")
//    .setThumbnail('https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngwing.com%2Fen%2Fsearch%3Fq%3Derror%2BMessage&psig=AOvVaw0L7_bAxVRW6v26esflA0Jb&ust=1635857980543000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCPiXzISc9_MCFQAAAAAdAAAAABAJ')
//    .setColor("#000000")




const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



let head = false;
let strict = false;

meetObj = new GoogleMeet(email, password, head, strict);

// cache store
// can be moved to db
let url = {};
let ind = 0;

app.get('/', (req, res) => {
	res.render('index', { url, email, password })
});
app.post('/postlink', (req, res) => {
	ind++;
	url[ind] = {};
	url[ind].id = ind;
	url[ind].url = req.body.url;
	url[ind].startTime = Date.parse(req.body.startDate);
	url[ind].endTime = Date.parse(req.body.endDate);
	res.redirect("/");
});

const listener = app.listen(3000 || process.env.PORT, () => {

	setInterval(() => {
		// when no scheduled links
		if (Object.keys(url).length === 0) {
			if (meetObj.getBrowserIsActive())
				meetObj.closeBrowser();
			else
				return;
		}
		// check meet array every 10sec
		for (x in url) {
			// join period
			if (url[x].startTime < Date.now() && url[x].endTime > Date.now()) {
				console.log(`Request for joining meet ${url[x].url}`);
				webhookClient.send({
                	content: '<@!416794653099294721>',
                	username: 'Google Meet Bot',
                	avatarURL: 'https://fonts.gstatic.com/s/i/productlogos/meet_2020q4/v1/web-96dp/logo_meet_2020q4_color_2x_web_96dp.png',
                	embeds: [joinembed],


                });
				meetObj.schedule(url[x].url, url[x].id);
				// hack: set above endTime so that it will not come for 
				// 				same meetId in this block
				
				url[x].startTime = url[x].endTime + 2000; 
			}
			// leave period
			if (url[x].endTime < Date.now()) {
				console.log(`Request for leaving meet ${url[x].url}`);
				webhookClient.send({
                	content: '<@!416794653099294721>',
                	username: 'Google Meet Bot',
                	avatarURL: 'https://fonts.gstatic.com/s/i/productlogos/meet_2020q4/v1/web-96dp/logo_meet_2020q4_color_2x_web_96dp.png',
                	embeds: [leaveembed],
                });
				meetObj.closeTab(url[x].id);
				delete url[x];
			}
		}
	}, 10000)

	console.log(`App listening on port ${listener.address().port}`)
})