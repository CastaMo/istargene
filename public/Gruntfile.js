/*global module:false*/
module.exports = function(grunt) {

    var debounceDelay = 0;

    // LiveReload的默认端口号，你也可以改成你想要的端口号
    var lrPort = 35729;
    // 使用connect-livereload模块，生成一个与LiveReload脚本
    // <script src="http://127.0.0.1:35729/livereload.js?snipver=1" type="text/javascript"></script>
    var lrSnippet = require('connect-livereload')({
        port: lrPort
    });
    // 使用 middleware(中间件)，就必须关闭 LiveReload 的浏览器插件
    var serveStatic = require('serve-static');
    var serveIndex = require('serve-index');
    var md5File = require('md5-file');
    var lrMiddleware = function(connect, options, middlwares) {
        return [
            lrSnippet,
            // 静态文件服务器的路径 原先写法：connect.static(options.base[0])
            serveStatic(options.base[0]),
            // 启用目录浏览(相当于IIS中的目录浏览) 原先写法：connect.directory(options.base[0])
            serveIndex(options.base[0])
        ];
    };

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg    : grunt.file.readJSON('package.json'),
        secret : grunt.file.readJSON('../sftp-config.json'),
        dirs   : grunt.file.readJSON('dirs.json'),

        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
        // Task configuration.
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            dist: {
                src: ['lib/<%= pkg.name %>.js'],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                src: '<%= concat.dist.dest %>',
                dest: 'dist/<%= pkg.name %>.min.js'
            }
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                unused: true,
                boss: true,
                eqnull: true,
                browser: true,
                globals: {}
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            lib_test: {
                src: ['lib/**/*.js', 'test/**/*.js']
            }
        },
        qunit: {
            files: ['test/**/*.html']
        },

        express: {
            options: {
                // 服务器端口号
                port: 3000,
                // 服务器地址(可以使用主机名localhost，也能使用IP)
                hostname: 'localhost',
                // 物理路径(默认为. 即根目录) 注：使用'.'或'..'为路径的时，可能会返回403 Forbidden. 此时将该值改为相对路径 如：/grunt/reloard。
                base: '.'
            },
            livereload: {
                options: {
                    middleware: lrMiddleware,
                    livereload: true,
                    script: 'app.js'
                }
            }
        },

        clean: {
            views: ['./views/']
        },

        copy: {
            test: {
                cwd: '<%= dirs.lib_path %>',
                src: ['<%= dirs.js %>common/*.js', '<%= dirs.css %>common/*.css'],
                dest: '<%= dirs.dest_path %>',
                expand: true
            },
            assets: {
                cwd: './assets/images',
                src: ['**/*'],
                dest: '<%= dirs.dest_path %>images/',
                expand: true
            },
            versioncontrol: {
                options : {
                    process: function (content, srcpath) {
                        var commonMap = {
                            utiljs: {
                                reg: /(util\.js)((\?v=)(\w+))?/g,
                                path: 'bin/public/js/common/util.js',
                                prefix: 'util.js?v='
                            }
                        };

                        var pageMap =  {
                            mainCss: {
                                reg   : /(?:\/public\/css\/)(\S+)(?:\/main\.css)(?:(?:\?v=)(?:\w+))?/g,
                                path  : 'bin/public/css/{page}/main.css',
                                prefix: '/public/css/{page}/main.css?v='
                            },
                            base64Css: {
                                reg: /(?:\/public\/css\/)(\S+)(?:\/base64\.css)(?:(?:\?v=)(?:\w+))?/g,
                                path: 'bin/public/css/{page}/base64.css',
                                prefix: '/public/css/{page}/base64.css?v='
                            },
                            mainJs: {
                                reg: /(?:\/public\/js\/)(\S+)(?:\/main\.js)(?:(?:\?v=)(?:\w+))?/g,
                                path: 'bin/public/js/{page}/main.js',
                                prefix: '/public/js/{page}/main.js?v='
                            },
                        };

                        for ( var key in commonMap ) {
                            content = content.replace(commonMap[key].reg, commonMap[key].prefix + md5File(commonMap[key].path).substring(0, 10));
                        }

                        for ( var key in pageMap ) {
                            var found = pageMap[key].reg.exec(content);

                            if (!found )
                                continue;

                            var file    = pageMap[key].path.replace('{page}', found[1]),
                                fileMd5 = md5File(file).substring(0, 10),
                                prefix  = pageMap[key].prefix.replace('{page}', found[1]);

                            content = content.replace(found[0], prefix + fileMd5);
                        }

                        return content;
                    }
                },
                files: [
                    {
                        src: './bin/Home/Home.html',
                        dest: './views/Home.html'
                    },
                    {
                        src: './bin/About/About.html',
                        dest: './views/About.html'
                    },
                    {
                        src: './bin/Coverage/Coverage.html',
                        dest: './views/Coverage.html'
                    },
                    {
                        src: './bin/Product/Product.html',
                        dest: './views/Product.html'
                    },
                    {
                        src: './bin/Service/Service.html',
                        dest: './views/Service.html'
                    },
                    {
                        src: './bin/Story/Story.html',
                        dest: './views/Story.html'
                    },
                    {
                        src: './bin/Purchase/SingleBasic/SingleBasic.html',
                        dest: './views/SingleBasic.html'
                    },
                    {
                        src: './bin/Purchase/SingleUpgrade/SingleUpgrade.html',
                        dest: './views/SingleUpgrade.html'
                    },
                    {
                        src: './bin/Purchase/TotalBasic/TotalBasic.html',
                        dest: './views/TotalBasic.html'
                    }
                ]
            }
        },

        /*编译jade，源文件路径设为src的根目录，src/jade里面装jade的option部分(比如你把head和script分离出来)，编译后放在bin中*/
        jade: {
            options: {
                data: {
                    debug: false,
                },
                pretty: true
            },
            home_test: {
                files: {
                    "<%= dirs.dest_path %>Home/Home.html": "<%= dirs.source_path %><%= dirs.jade %>Home/develop.jade"
                }
            },
            product_test: {
                files: {
                    "<%= dirs.dest_path %>Product/Product.html": "<%= dirs.source_path %><%= dirs.jade %>Product/develop.jade"
                }
            },
            service_test: {
                files: {
                    "<%= dirs.dest_path %>Service/Service.html": "<%= dirs.source_path %><%= dirs.jade %>Service/develop.jade"
                }
            },
            coverage_test: {
                files: {
                    "<%= dirs.dest_path %>Coverage/Coverage.html": "<%= dirs.source_path %><%= dirs.jade %>Coverage/develop.jade"
                }
            },
            about_test: {
                files: {
                    "<%= dirs.dest_path %>About/About.html": "<%= dirs.source_path %><%= dirs.jade %>About/develop.jade"
                }
            },
            story_test: {
                files: {
                    "<%= dirs.dest_path %>Story/Story.html": "<%= dirs.source_path %><%= dirs.jade %>Story/develop.jade"
                }
            },
            single_basic_test: {
                files: {
                    "<%= dirs.dest_path %>Purchase/SingleBasic/SingleBasic.html": "<%= dirs.source_path %><%= dirs.jade %>Purchase/SingleBasic/develop.jade"
                }
            },
            single_upgrade_test: {
                files: {
                    "<%= dirs.dest_path %>Purchase/SingleUpgrade/SingleUpgrade.html": "<%= dirs.source_path %><%= dirs.jade %>Purchase/SingleUpgrade/develop.jade"
                }
            },
            total_basic_test: {
                files: {
                    "<%= dirs.dest_path %>Purchase/TotalBasic/TotalBasic.html": "<%= dirs.source_path %><%= dirs.jade %>Purchase/TotalBasic/develop.jade"
                }
            }
        },


        less: {
            options: {
                compress: false,
                yuicompress: false
            },
            home_test: {
                files: {
                    "<%= dirs.dest_path %><%= dirs.css %>Home/main.css": "<%= dirs.source_path %><%= dirs.less %>Home/main.less",
                    "<%= dirs.dest_path %><%= dirs.css %>Home/base64.css": "<%= dirs.source_path %><%= dirs.less %>Home/base64.less"
                }
            },
            product_test: {
                files: {
                    "<%= dirs.dest_path %><%= dirs.css %>Product/main.css": "<%= dirs.source_path %><%= dirs.less %>Product/main.less",
                    "<%= dirs.dest_path %><%= dirs.css %>Product/base64.css": "<%= dirs.source_path %><%= dirs.less %>Product/base64.less"
                }
            },
            service_test: {
                files: {
                    "<%= dirs.dest_path %><%= dirs.css %>Service/main.css": "<%= dirs.source_path %><%= dirs.less %>Service/main.less",
                    "<%= dirs.dest_path %><%= dirs.css %>Service/base64.css": "<%= dirs.source_path %><%= dirs.less %>Service/base64.less"
                }
            },
            coverage_test: {
                files: {
                    "<%= dirs.dest_path %><%= dirs.css %>Coverage/main.css": "<%= dirs.source_path %><%= dirs.less %>Coverage/main.less",
                    "<%= dirs.dest_path %><%= dirs.css %>Coverage/base64.css": "<%= dirs.source_path %><%= dirs.less %>Coverage/base64.less"
                }
            },
            about_test: {
                files: {
                    "<%= dirs.dest_path %><%= dirs.css %>About/main.css": "<%= dirs.source_path %><%= dirs.less %>About/main.less",
                    "<%= dirs.dest_path %><%= dirs.css %>About/base64.css": "<%= dirs.source_path %><%= dirs.less %>About/base64.less"
                }
            },
            story_test: {
                files: {
                    "<%= dirs.dest_path %><%= dirs.css %>Story/main.css": "<%= dirs.source_path %><%= dirs.less %>Story/main.less",
                    "<%= dirs.dest_path %><%= dirs.css %>Story/base64.css": "<%= dirs.source_path %><%= dirs.less %>Story/base64.less"
                }
            },
            single_basic_test: {
                files: {
                    "<%= dirs.dest_path %><%= dirs.css %>Purchase/SingleBasic/main.css": "<%= dirs.source_path %><%= dirs.less %>Purchase/SingleBasic/main.less",
                    "<%= dirs.dest_path %><%= dirs.css %>Purchase/SingleBasic/base64.css": "<%= dirs.source_path %><%= dirs.less %>Purchase/SingleBasic/base64.less"
                }
            },
            single_upgrade_test: {
                files: {
                    "<%= dirs.dest_path %><%= dirs.css %>Purchase/SingleUpgrade/main.css": "<%= dirs.source_path %><%= dirs.less %>Purchase/SingleUpgrade/main.less",
                    "<%= dirs.dest_path %><%= dirs.css %>Purchase/SingleUpgrade/base64.css": "<%= dirs.source_path %><%= dirs.less %>Purchase/SingleUpgrade/base64.less"
                }
            },
            total_basic_test: {
                files: {
                    "<%= dirs.dest_path %><%= dirs.css %>Purchase/TotalBasic/main.css": "<%= dirs.source_path %><%= dirs.less %>Purchase/TotalBasic/main.less",
                    "<%= dirs.dest_path %><%= dirs.css %>Purchase/TotalBasic/base64.css": "<%= dirs.source_path %><%= dirs.less %>Purchase/TotalBasic/base64.less"
                }
            }
        },
        livescript: {
            options: {
                bare: true,
                join: true,
                flatten: true
            },
            home_test: {
                expand: true,
                cwd: '<%= dirs.source_path %><%= dirs.ls %>Home/',
                src: ['*.ls'],
                dest: '<%= dirs.dest_path %><%= dirs.js %>Home/',
                ext: '.js'
            },
            product_test: {
                expand: true,
                cwd: '<%= dirs.source_path %><%= dirs.ls %>Product',
                src: ['*.ls'],
                dest: '<%= dirs.dest_path %><%= dirs.js %>Product',
                ext: '.js'
            },
            service_test: {
                expand: true,
                cwd: '<%= dirs.source_path %><%= dirs.ls %>Service',
                src: ['*.ls'],
                dest: '<%= dirs.dest_path %><%= dirs.js %>Service',
                ext: '.js'
            },
            coverage_test: {
                expand: true,
                cwd: '<%= dirs.source_path %><%= dirs.ls %>Coverage',
                src: ['*.ls'],
                dest: '<%= dirs.dest_path %><%= dirs.js %>Coverage',
                ext: '.js'
            },
            about_test: {
                expand: true,
                cwd: '<%= dirs.source_path %><%= dirs.ls %>About',
                src: ['*.ls'],
                dest: '<%= dirs.dest_path %><%= dirs.js %>About',
                ext: '.js'
            },
            story_test: {
                expand: true,
                cwd: '<%= dirs.source_path %><%= dirs.ls %>Story',
                src: ['*.ls'],
                dest: '<%= dirs.dest_path %><%= dirs.js %>Story',
                ext: '.js'
            },
            single_basic_test: {
                expand: true,
                cwd: '<%= dirs.source_path %><%= dirs.ls %>Purchase/SingleBasic',
                src: ['*.ls'],
                dest: '<%= dirs.dest_path %><%= dirs.js %>Purchase/SingleBasic',
                ext: '.js'
            },
            single_upgrade_test: {
                expand: true,
                cwd: '<%= dirs.source_path %><%= dirs.ls %>Purchase/SingleUpgrade',
                src: ['*.ls'],
                dest: '<%= dirs.dest_path %><%= dirs.js %>Purchase/SingleUpgrade',
                ext: '.js'
            },
            total_basic_test: {
                expand: true,
                cwd: '<%= dirs.source_path %><%= dirs.ls %>Purchase/TotalBasic',
                src: ['*.ls'],
                dest: '<%= dirs.dest_path %><%= dirs.js %>Purchase/TotalBasic',
                ext: '.js'
            }
        },
        browserify: {
            home_test: {
                files: {
                    "<%= dirs.dest_path %><%= dirs.js %>Home/main.js": ["<%= dirs.dest_path %><%= dirs.js %>Home/index.js"]
                }
            },
            product_test: {
                files: {
                    "<%= dirs.dest_path %><%= dirs.js %>Product/main.js": ["<%= dirs.dest_path %><%= dirs.js %>Product/index.js"]
                }
            },
            service_test: {
                files: {
                    "<%= dirs.dest_path %><%= dirs.js %>Service/main.js": ["<%= dirs.dest_path %><%= dirs.js %>Service/index.js"]
                }
            },
            coverage_test: {
                files: {
                    "<%= dirs.dest_path %><%= dirs.js %>Coverage/main.js": ["<%= dirs.dest_path %><%= dirs.js %>Coverage/index.js"]
                }
            },
            about_test: {
                files: {
                    "<%= dirs.dest_path %><%= dirs.js %>About/main.js": ["<%= dirs.dest_path %><%= dirs.js %>About/index.js"]
                }
            },
            story_test: {
                files: {
                    "<%= dirs.dest_path %><%= dirs.js %>Story/main.js": ["<%= dirs.dest_path %><%= dirs.js %>Story/index.js"]
                }
            },
            single_basic_test: {
                files: {
                    "<%= dirs.dest_path %><%= dirs.js %>Purchase/SingleBasic/main.js": ["<%= dirs.dest_path %><%= dirs.js %>Purchase/SingleBasic/index.js"]
                }
            },
            single_upgrade_test: {
                files: {
                    "<%= dirs.dest_path %><%= dirs.js %>Purchase/SingleUpgrade/main.js": ["<%= dirs.dest_path %><%= dirs.js %>Purchase/SingleUpgrade/index.js"]
                }
            },
            total_basic_test: {
                files: {
                    "<%= dirs.dest_path %><%= dirs.js %>Purchase/TotalBasic/main.js": ["<%= dirs.dest_path %><%= dirs.js %>Purchase/TotalBasic/index.js"]
                }
            }
        },
        watch: {
            home: {
                options: {
                    livereload: lrPort,
                    debounceDelay: debounceDelay
                },
                files: [
                    '<%= dirs.source_path %>**/Home/**'
                ],
                tasks: [
                    'less:home_test',
                    'livescript:home_test',
                    'browserify:home_test',
                    'jade:home_test'
                ]
            },
            product: {
                options: {
                    livereload: lrPort,
                    debounceDelay: debounceDelay
                },
                files: [
                    '<%= dirs.source_path %>**/Product/**'
                ],
                tasks: [
                    'less:product_test',
                    'livescript:product_test',
                    'browserify:product_test',
                    'jade:product_test'
                ]
            },
            service: {
                options: {
                    livereload: lrPort,
                    debounceDelay: debounceDelay
                },
                files: [
                    '<%= dirs.source_path %>**/Service/**'
                ],
                tasks: [
                    'less:service_test',
                    'livescript:service_test',
                    'browserify:service_test',
                    'jade:service_test'
                ]
            },
            coverage: {
                options: {
                    livereload: lrPort,
                    debounceDelay: debounceDelay
                },
                files: [
                    '<%= dirs.source_path %>**/Coverage/**',
                ],
                tasks: [
                    'less:coverage_test',
                    'livescript:coverage_test',
                    'browserify:coverage_test',
                    'jade:coverage_test'
                ]
            },
            about: {
                options: {
                    livereload: lrPort,
                    debounceDelay: debounceDelay
                },
                files: [
                    '<%= dirs.source_path %>**/About/**',
                ],
                tasks: [
                    'less:about_test',
                    'livescript:about_test',
                    'browserify:about_test',
                    'jade:about_test'
                ]
            },
            story: {
                options: {
                    livereload: lrPort,
                    debounceDelay: debounceDelay
                },
                files: [
                    '<%= dirs.source_path %>**/Story/**',
                ],
                tasks: [
                    'less:story_test',
                    'livescript:story_test',
                    'browserify:story_test',
                    'jade:story_test'
                ]
            },
            single_basic_test: {
                options: {
                    livereload: lrPort,
                    debounceDelay: debounceDelay
                },
                files: [
                    '<%= dirs.source_path %>**/Purchase/SingleBasic/**',
                ],
                tasks: [
                    'less:single_basic_test',
                    'livescript:single_basic_test',
                    'browserify:single_basic_test',
                    'jade:single_basic_test'
                ]
            },
            single_upgrade_test: {
                options: {
                    livereload: lrPort,
                    debounceDelay: debounceDelay
                },
                files: [
                    '<%= dirs.source_path %>**/Purchase/SingleUpgrade/**',
                ],
                tasks: [
                    'less:single_upgrade_test',
                    'livescript:single_upgrade_test',
                    'browserify:single_upgrade_test',
                    'jade:single_upgrade_test'
                ]
            },
            total_basic_test: {
                options: {
                    livereload: lrPort,
                    debounceDelay: debounceDelay
                },
                files: [
                    '<%= dirs.source_path %>**/Purchase/TotalBasic/**',
                ],
                tasks: [
                    'less:total_basic_test',
                    'livescript:total_basic_test',
                    'browserify:total_basic_test',
                    'jade:total_basic_test'
                ]
            }
        },
        sftp: {
            options: {
                host: '<%= secret.host %>',
                username: '<%= secret.user %>',
                password: '<%= secret.password %>',
                showProgress: true,
                srcBasePath: "<%= dirs.dest_path %>",
                port: '<%= secret.port %>',
                createDirectories: true
            },
            config: {
                options: {
                    path: "/Project/istargene"
                },
                files: {
                    "./": ["<%= dirs.dest_path %>public/**/*"]
                }
            }
        },
        sshexec: {
            test: {
                command: [  'sh -c "cd Project/istargene; ls; ./deploy.sh"',
                            'sh -c "ls"'],
                options: {
                    host: '<%= secret.host %>',
                    username: '<%= secret.user %>',
                    password: '<%= secret.password %>'
                }
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-livescript');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-ssh');
    grunt.loadNpmTasks('grunt-hashmap');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-express-server');

    grunt.registerTask('default', [
        'express',
        'copy:test',
        'copy:assets',
        'less',
        'livescript',
        'browserify',
        'watch'
    ]);
    grunt.registerTask('ready', [
        'copy:test',
        'copy:assets',
        'less',
        'livescript',
        'uglify',
        'cssmin',
        'clean:version',
        'hashmap'
    ]);
    grunt.registerTask('upload', [
        'jade',
        'copy:backup',
        'sftp'
    ]);
    grunt.registerTask('backup', [
        'copy:backup',
    ]);
    grunt.registerTask('versioncontrol', [
        'clean:views',
        'copy:versioncontrol'
    ]);
};