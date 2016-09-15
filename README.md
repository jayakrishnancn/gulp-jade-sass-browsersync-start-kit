# jade-gulp-sass-browser-sync 
contains 
  * jade
  * sass
  * browserSync 
  * autoprefixer
  * imagemin
  * html-minifier
  * jsbeautifier
  * uglify
  * plumber
  * rename
  * gulp
  * gulp-if
  
#Local Installation
  1. Clone this repo, or download it into a directory of your choice.
  2. Inside the directory, run npm install.
  
#Usage
###development mode
  ```javascript
    $ gulp
  ```

###for image minification use:  

  ```javascript
    $ gulp imgmin
  ```
###  To copy vendor files to dest directory 

  ```javascript
    $ gulp vendor
  ```
###configuration
  * var minificaiton=true ;  for minification of image,css,html,js use this , in config portion of gulpfile.js
