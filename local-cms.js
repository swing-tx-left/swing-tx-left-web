const childProcess= require('child_process');

const nextDev=childProcess.spawn('npm', ['run-script', 'dev']);

nextDev.stdout.on('data',(data)=>{
	console.log('next dev: '+data);
});

nextDev.stderr.on('data',(data)=>{
	console.error('next dev: '+data);
});


const adminPack=childProcess.spawn('npm', ['run-script', 'adminpack']);

adminPack.stdout.on('data',(data)=>{
	console.log('adminpack: '+data);
});

adminPack.stderr.on('data',(data)=>{
	console.error('adminpack: '+data);
});



const cmsProxy=childProcess.spawn('npm', ['run-script', 'cmsproxy']);

cmsProxy.stdout.on('data',(data)=>{
	console.log('cms proxy: '+data);
});

cmsProxy.stderr.on('data',(data)=>{
	console.error('cms proxy: '+data);
});