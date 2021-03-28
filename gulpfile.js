const { series, watch, src, dest, parallel } = require('gulp');
const pump = require('pump');

// gulp plugins and utils
const livereload = require('gulp-livereload');
const postcss = require('gulp-postcss');
const zip = require('gulp-zip');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const beeper = require('beeper');
const csslint = require('gulp-csslint');
const fs = require('fs');
const eslint = require('gulp-eslint');

// postcss plugins
const autoprefixer = require('autoprefixer');
const colorFunction = require('postcss-color-mod-function');
const cssnano = require('cssnano');
const easyimport = require('postcss-easy-import');


// TryGhost Admin
const dotenv = require('dotenv');
const path = require('path');
const GhostAdminApi = require('@tryghost/admin-api');

const ENV_FILE = path.join(__dirname, '.env');
const env = dotenv.config({ path: ENV_FILE });

function serve(done) {
    livereload.listen();
    done();
}

const handleError = (done) => {
    return function (err) {
        if (err) {
            beeper();
        }
        return done(err);
    };
};

function hbs(done) {
    pump([
        src(['*.hbs', 'partials/**/*.hbs']),
        livereload()
    ], handleError(done));
}

function lintCSS(done) {
    var output = '';
    pump([
        src('assets/css/screen.css'),
        csslint(),
        csslint.formatter('junit-xml', { logger: function (str) { output += str; } })
            .on('end', function (e) {
                if (e) { handleError(done); }
                if (!fs.existsSync('./junit')) {
                    fs.mkdirSync('./junit');
                }
                fs.writeFile('./junit/csslint.xml', output, done);
            })
    ], handleError(done));
}

function lintJS(done) {
    pump([
        src([
            'assets/js/**/*.js',
            '!assets/js/**/jquery.ghosthunter.js'
        ]),
        eslint(),
        eslint.format('junit', fs.createWriteStream('./junit/jslint.xml'))
    ], handleError(done));
}

function css(done) {
    pump([
        src('assets/css/*.css', { sourcemaps: true }),
        postcss([
            easyimport,
            colorFunction(),
            autoprefixer(),
            cssnano()
        ]),
        dest('assets/built/', { sourcemaps: '.' }),
        livereload()
    ], handleError(done));
}

function js(done) {
    pump([
        src([
            // pull in lib files first so our own code can depend on it
            'assets/js/controls/*.js',
            'assets/js/searchconnectors/*.js',
            'assets/js/searchpopupresults.js',
            'assets/js/searchconnectors.js',
            'assets/js/*.js'
        ], { sourcemaps: true }),
        concat('ghost-fluentui.js'),
        uglify(),
        dest('assets/built/', { sourcemaps: '.' }),
        livereload()
    ], handleError(done));
}

function zipper(done) {
    const filename = require('./package.json').name + '.zip';

    pump([
        src([
            '**',
            '!node_modules', '!node_modules/**',
            '!dist', '!dist/**',
            '!yarn-error.log',
            '!config', '!config/**',
            '!assets/js', '!assets/js/**',
            '!assets/css', '!assets/css/**',
            '!*-compose.yml'
        ]),
        zip(filename),
        dest('dist/')
    ], handleError(done));
}

async function deploy(done) {
    try {
        const url = process.env.GHOST_API_URL || env.parsed.GHOST_API_URL;
        const admin_api_key = process.env.GHOST_ADMIN_API_KEY || env.parsed.GHOST_ADMIN_API_KEY;
        const themeName = process.env.THEME_NAME || require('./package.json').name;
        const zipFile = `dist/${themeName}.zip`;
        const api = new GhostAdminApi({
            url,
            key: admin_api_key,
            version: 'v4'
        });

        await api.themes.upload({ file: zipFile });
        await api.themes.activate(themeName);
        done();
    } catch (err) {
        handleError(done);
    }
}

const cssWatcher = () => watch('assets/css/**', css);
const hbsWatcher = () => watch(['*.hbs', 'partials/**/*.hbs'], hbs);
const watcher = parallel(cssWatcher, hbsWatcher);
const build = series(css, js);
const lint = series(lintCSS, lintJS);

exports.lint = lint;
exports.build = build;
exports.zip = series(build, zipper);
exports.default = series(build, serve, watcher);
exports.deploy = deploy;
