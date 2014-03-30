var process = require('child_process');
var fs = require('fs');

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
		    upload();
		} else {
		    console.log('filename not provided');
		}
	}

});

function upload(){

	var date = new Date();
	var time = date.getFullYear() + "-" + (date.getMonth()+1) + "-"  + date.getDate() + " "
		+ date.getHours() + ":"  + date.getMinutes(); 

	process.exec('git add *', function (error, stdout, stderr) {


		console.log("git add");


	    if (error !== null) {
	    	console.log('git add * 出错，错误信息：' + error);
	    }else{
	    	process.exec('git commit -m "'+time+'"', function (error, stdout, stderr) {
	    		console.log("git commit");

			    if (error !== null) {
			    	console.log('git commit 出错，错误信息：' + error);
			    }else{
			    		console.log("git push1");
			    	process.exec('git push -u origin master', function (error, stdout, stderr) {
			    		console.log("git push2");

					    if (stdout !== null) {
					    	console.log(stdout);

					    	process.exec('xiuxu123@live.cn', function (error, stdout, stderr) {
					    		console.log("git mail");

							    if (stdout !== null) {
							    	console.log(stdout);
							    }
							});
					    }
					});
			    }
			});
	    }
	});

}