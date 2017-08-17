var fs = require('fs');
var zip = require('file-zip');
var del = require('del');
var copy = require('recursive-copy');

// Delete all public files
del(['./public/*']).then(paths => {
  console.log('Deleted files and folders:\n', paths.join('\n'));

  copyfile();
});

// Copy files from src to public
var copyfile = function(){

  // Source elements
  var options = {
    filter: [
      'css/**/*',
      'fonts/**/*',
      'data/**/*',
      'img/**/*',
      'js/**/*',
      '*.html',
      '!.DS_Store',
      '!README.html',
      '!index.html'
    ],
  };
  copy('src', 'public/source/', options)
    .then(function(results) {
      console.info('Copied ' + results.length + ' files');
    })
    .catch(function(error) {
      console.error('Copy failed: ' + error);
    });

  // Readme
  copy('src', 'public/', {filter: ['README.md']})
    .then(function(results) {
      console.info('Copied ' + results.length + ' files');
    })
    .catch(function(error) {
      console.error('Copy failed: ' + error);
    });
}


// Create Zip using public files
var createZip = function(){

  // console.log("Compress ...");
  // zip.zipFolder(['./public/src'],'./public/html-safetypay-portugal.zip',function(err){
  //   if(err){
  //     console.log('zip error',err);
  //   }else{
  //     console.log('zip success');
  //   }
  // });
}
