module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    jade: {
      compile: {
        options: {
          debug: false,
          client: true,
          amd: true,
          namespace: 'templates',
          processName: function(filename) {
            var tokens = filename.split('/');
            var name = tokens[tokens.length - 1];
            name = name.substring(0, name.indexOf('.'));
            console.log(name)

            return name;
          }
        },
        files: {
          'public/js/templates.js': ['public/src/templates/*.jade']
        }
      }
    },
    less: {
      compile: {
        options: {
          path: 'public/css/common'
        },
        files: {
          'public/css/compiled/all.css': ['public/css/pages/*.less']
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-less');
};