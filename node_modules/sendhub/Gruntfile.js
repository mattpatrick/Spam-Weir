module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    watch: {
      tests: {
        files: ['src/**/*.coffee', 'spec/**/*.coffee'],
        tasks: ['mochaTest']
      }
    },

    bump: {
      options: {
        commitMessage: 'chore: release v%VERSION%',
        commitFiles: ['package.json'],
        files: ['package.json'],
        pushTo: 'origin'
      }
    },

    clean: {
      build: ["lib"]
    },

    coffee: {
      compile: {
        options: {
          join: true
        },
        files: {
          'lib/sendhub.js': ['src/**/*.coffee']
        }
      }
    },

    mochaTest: {
      tests: {
        options: {
          reporter: 'spec',
          require: 'coffee-script'
        },
        src: ['spec/**/*.coffee']
      }
    },

    'npm-contributors': {
      options: {
        commitMessage: 'chore: update contributors'
      }
    },

    'npm-publish': {
      options: {
        requires: ['build'],
        abortIfDirty: false
      }
    }
  });



  grunt.registerTask('build', 'Build coffeescript into javascript', function() {
    grunt.task.run([
      'coffee:compile'
    ]);
  });

  grunt.registerTask('test', 'mochaTest');

  grunt.registerTask('release', 'Bump the version', function(type) {
    grunt.task.run([
      'npm-contributors',
      'bump:' + (type ? type : 'patch'),
    ]);
  });

  // Default task.
  grunt.registerTask('default', ['watch']);
};
