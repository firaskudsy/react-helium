var fs = require('fs');
console.log('Incrementing build number...');
fs.readFile('version.json',function(err,content) {
    if (err) throw err;
    var metadata = JSON.parse(content);
    metadata.version = (Number(metadata.version) + 0.1).toString();
    fs.writeFile('version.json',JSON.stringify(metadata),function(err){
        if (err) throw err;
    })
});