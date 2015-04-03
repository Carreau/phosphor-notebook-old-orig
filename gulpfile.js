/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, S. Chris Colbert
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';

var del = require('del');
var concat = require('gulp-concat');
var gulp = require('gulp');
var header = require('gulp-header');
var nib = require('nib');
var rename = require('gulp-rename');
var stream = require('event-stream');
var stylus = require('gulp-stylus');
var typedoc = require('gulp-typedoc');
var typescript = require('gulp-typescript');


var typings = ['./typings/tsd.d.ts'];


var tsSources = [
  'collections/IIterator',
  'collections/IIterable',
  'collections/ICollection',
  'collections/IDeque',
  'collections/IList',
  'collections/IQueue',
  'collections/IStack',
  'collections/algorithm',
  'collections/ReadOnlyCollection',
  'collections/ReadOnlyList',
  'collections/ArrayIterator',
  'collections/List',
  'collections/ListIterator',
  'collections/CircularBuffer',
  'collections/Queue',

  'core/IDisposable',
  'core/IMessage',
  'core/IMessageFilter',
  'core/IMessageHandler',
  'core/dispatch',
  'core/empty',
  'core/Disposable',
  'core/Message',
  'core/Signal',

  'di/token',
  'di/IInjectable',
  'di/IContainer',
  'di/Container',

  'domutil/boxdata',
  'domutil/hitTest',
  'domutil/overrideCursor',

  'virtualdom/IComponent',
  'virtualdom/IData',
  'virtualdom/IElement',
  'virtualdom/factory',
  'virtualdom/dom',
  'virtualdom/renderer',

  'components/basecomponent',
  'components/component',
  'components/codemirror',

  'panels/enums',
  'panels/geometry',
  'panels/ilayoutitem',
  'panels/itab',
  'panels/itabbable',
  'panels/layout',
  'panels/layoutengine',
  'panels/messages',
  'panels/panel',
  'panels/elementhost',
  'panels/panelitem',
  'panels/spaceritem',
  'panels/boxlayout',
  'panels/boxpanel',
  'panels/menuitem',
  'panels/menu',
  'panels/menubar',
  'panels/singlelayout',
  'panels/singlepanel',
  'panels/splithandle',
  'panels/splitlayout',
  'panels/splitpanel',
  'panels/stacklayout',
  'panels/stackpanel',
  'panels/tab',
  'panels/tabbar',
  'panels/tabpanel',
  'panels/dockarea'

  // 'shell/IPlugin',
  // 'shell/IPluginList',
  // 'shell/IRegion',
  // 'shell/IRegionManager',
  // 'shell/AutoHidePanel',
  // 'shell/PluginList',
  // 'shell/RegionManager',
  // 'shell/Bootstrapper'
].map(function(name) { return './src/' + name + '.ts'; });


var stylSources = './styl/index.styl';




gulp.task('watch', function() {
  gulp.watch(tsSources, ['dist']);
});



gulp.task('notebook', function() {
  var project = typescript.createProject({
    declarationFiles: false,
    noImplicitAny: true,
    target: 'ES5',
  });

  var sources = typings.concat([
    'dist/phosphor.d.ts',
    'notebook/cellmodel.ts',
    'notebook/menuitem.ts',
    'notebook/menu.ts',
    'notebook/menubar.ts',
    'notebook/cell.ts',
    'notebook/notebook.ts',
    'notebook/app.ts',
    'notebook/index.ts',
  ]);

  var src = gulp.src(sources)
    .pipe(typescript(project))
    .pipe(rename(function (path) {
      path.dirname += '/build'; }))
    .pipe(header('"use strict";\n'))
    .pipe(gulp.dest('notebook'));

  return stream.merge(src);
});

gulp.task('css', function() {
  return gulp.src(stylSources)
    .pipe(stylus({ use: [nib()] }))
    .pipe(rename('phosphor.css'))
    .pipe(gulp.dest('./dist'));
});


gulp.task('docs', function() {
  return gulp.src(typings.concat(tsSources))
    .pipe(typedoc({
      out: './docs',
      name: 'Phosphor',
      target: 'ES5',
      mode: 'file',
      includeDeclarations: true }));
});

gulp.task('default', ['dist']);
