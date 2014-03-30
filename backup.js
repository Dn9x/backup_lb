var process = require('child_process');
var fs = require('fs');
var nodemailer = require("nodemailer");

function back(){
	var date = new Date();

	var time = date.getFullYear() + "" + (date.getMonth()+1) + ""  + date.getDate() 
		+ date.getHours() + ""  + date.getMinutes() + ""  + date.getSeconds(); 

	var shell = "mysqldump -u root -p1234 lifebill > bak/lb"+time+".sql";

	process.exec(shell, function (error, stdout, stderr) {
	    //console.log('stdout: ' + stdout);
	    //console.log('stderr: ' + stderr);
	    if (error !== null) {
	      console.log('exec error: ' + error);
	    }

	    console.log(time + "：已经备份成功");
	});


    setTimeout(back, 1000*60*60);
}

setTimeout(back, 1000*10);

fs.watch('bak', function (event, filename) {
    console.log('event is: ' + event);

	//判断事件，一般新增文件会触发两次，一次是rename,一次是change
	if(event == 'change'){
		if (filename) {
		    console.log('filename provided: ' + filename);
		    upload(filename);
		} else {
		    console.log('filename not provided');
		}
	}

});

function upload(filename){

	var date = new Date();
	var time = date.getFullYear() + "-" + (date.getMonth()+1) + "-"  + date.getDate() + " "
		+ date.getHours() + ":"  + date.getMinutes(); 

	// create reusable transport method (opens pool of SMTP connections)
	var smtpTransport = nodemailer.createTransport("SMTP",{
	    service: "QQ",
	    auth: {
	        user: "171373243@qq.com",
	        pass: "307zhanghanyun"
	    }
	});

	//var files = fs.readFileSync("bak/" + filename)

	// setup e-mail data with unicode symbols
	var mailOptions = {
	    from: "171373243@qq.com", // sender address
	    to: "xiuxu123@live.cn", // list of receivers
	    subject: "LifeBill备份：" + time, // Subject line
	    text: "LifeBill备份" + time, // plaintext body
	    attachments: [
	        {   // stream as an attachment
	            fileName: "text4.txt",
	            streamSource: fs.createReadStream("bak/" + filename)
	        },
	        {   // file on disk as an attachment
	            fileName: filename,
	            filePath: "/bak/" + filename // stream this file
	        }
	    ]
	}

	// send mail with defined transport object
	smtpTransport.sendMail(mailOptions, function(error, response){
	    if(error){
	        console.log(error);
	    }else{
	        console.log("Message sent: " + response.message);
	    }

	    // if you don't want to use this transport object anymore, uncomment following line
	    //smtpTransport.close(); // shut down the connection pool, no more messages
	});
	

}