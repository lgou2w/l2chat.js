/*
 * Copyright (C) 2019-2020 The lgou2w <lgou2w@hotmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const fs = require('fs');
const path = require('path');
const uglifycss = require('uglifycss');

const config = {
  src: path.resolve(__dirname, '..', 'src', 'l2chat.css'),
  dist: path.resolve(__dirname, '..', 'dist', 'l2chat.css'),
  min: path.resolve(__dirname, '..', 'dist', 'l2chat.min.css')
};

const build = (dist) => {
  if (!fs.existsSync(dist))
    fs.mkdirSync(dist);
  fs.copyFileSync(config.src, config.dist, fs.constants.COPYFILE_FICLONE);
  fs.writeFileSync(config.min, uglifycss.processFiles([ config.src ]));
};

build(path.resolve(__dirname, '..', 'dist'));
